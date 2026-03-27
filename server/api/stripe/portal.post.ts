import Stripe from 'stripe'
import { serverSupabaseUser } from '#supabase/server'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const config = useRuntimeConfig()
    const stripe = new Stripe(config.stripeSecretKey)

    // Récupérer le customer Stripe depuis la BDD
    const supabase = serverSupabaseServiceRole(event)
    const { data: subscription } = await supabase
        .from('Subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', user.sub)
        .single()

    if (!subscription?.stripe_customer_id)
        throw createError({ statusCode: 404, message: 'Customer Stripe introuvable' })

    const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripe_customer_id,
        return_url: `${config.public.appUrl}/shop`,
    })

    return { url: session.url }
})