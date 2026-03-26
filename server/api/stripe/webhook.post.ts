import Stripe from 'stripe'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const stripe = new Stripe(config.stripeSecretKey)

    const body = await readRawBody(event)
    const sig = getHeader(event, 'stripe-signature')

    let stripeEvent: Stripe.Event

    try {
        stripeEvent = stripe.webhooks.constructEvent(body!, sig!, config.stripeWebhookSecret)
    } catch (err) {
        throw createError({ statusCode: 400, message: `Webhook error: ${err}` })
    }

    const supabase = serverSupabaseServiceRole(event)

    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const mode = session.metadata?.mode

        if (!userId) return { received: true }

        if (mode === 'payment') {
            // Récupérer les line items pour savoir quel pack
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
            const priceId = lineItems.data[0]?.price?.id

            // Mapper priceId → Coins
            const coinsMap: Record<string, number> = {
                [config.public.stripePriceCoinsStarter]: 300,
                [config.public.stripePriceCoinsPopular]: 800,
                [config.public.stripePriceCoinsPro]: 2000,
            }

            const coins = coinsMap[priceId!] ?? 0

            if (coins > 0) {
                await supabase.from('WalletTransactions').insert({
                    user_id: userId,
                    amount: coins,
                    operation: 'credit',
                    type: 'purchase',
                    reference_id: null
                })
            }
        }

        if (mode === 'subscription') {
            // Activer toutes les features pour l'abonné
            await supabase.from('Subscriptions').upsert({
                user_id: userId,
                status: 'active',
                stripe_customer_id: session.customer as string,
                current_period_end: null
            }, { onConflict: 'user_id' })
        }
    }

    if (stripeEvent.type === 'customer.subscription.updated') {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        const userId = (customer as Stripe.Customer).metadata?.user_id

        if (!userId) return { received: true }

        if (subscription.cancel_at) {
            await supabase.from('Subscriptions').upsert({
                user_id: userId,
                status: 'canceled',
                stripe_customer_id: subscription.customer as string,
                current_period_end: new Date(subscription.cancel_at * 1000).toISOString()
            }, { onConflict: 'user_id' })
        }

        if (subscription.status === 'canceled') {
            await supabase.from('Subscriptions').upsert({
                user_id: userId,
                status: 'deleted',
                stripe_customer_id: subscription.customer as string,
                current_period_end: null
            }, { onConflict: 'user_id' })

            await supabase
                .from('Streamer')
                .update({ is_sub: false })
                .eq('id', userId)
        }
    }

    if (stripeEvent.type === 'customer.subscription.deleted') {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        const userId = (customer as Stripe.Customer).metadata?.user_id

        if (userId) {
            await supabase.from('Subscriptions').upsert({
                user_id: userId,
                status: 'deleted',
                stripe_customer_id: subscription.customer as string,
                current_period_end: null
            }, { onConflict: 'user_id' })
        }
    }

    return { received: true }
})