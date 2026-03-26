import Stripe from 'stripe'
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

    const { priceId, mode } = await readBody(event)
    if (!priceId || !mode) throw createError({ statusCode: 400, message: 'priceId ou mode manquant' })

    const config = useRuntimeConfig()
    const stripe = new Stripe(config.stripeSecretKey)
    const supabase = serverSupabaseServiceRole(event)

    let customerId: string | undefined

    if (mode === 'subscription') {
        const { data: sub } = await supabase
            .from('Subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.sub)
            .single()

        customerId = sub?.stripe_customer_id ?? undefined

        if (!customerId) {
            const customer = await stripe.customers.create({
                metadata: { user_id: user.sub }
            })
            customerId = customer.id

            const { error } = await supabase
                .from('Subscriptions')
                .upsert({
                    user_id: user.sub,
                    stripe_customer_id: customerId,
                    status: 'pending'
                }, { onConflict: 'user_id' })

            console.log('upsert error:', error?.message)
        }
    }

    const session = await stripe.checkout.sessions.create({
        ...(customerId ? { customer: customerId } : {}),
        ui_mode: 'embedded',
        mode,
        line_items: [{ price: priceId, quantity: 1 }],
        return_url: `${config.public.appUrl}/checkout?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
            user_id: user.sub,
            mode,
        }
    })

    return { clientSecret: session.client_secret }
})