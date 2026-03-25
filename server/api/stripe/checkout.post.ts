import Stripe from 'stripe'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })
        
    const { priceId } = await readBody(event)
    if (!priceId) throw createError({ statusCode: 400, message: 'priceId manquant' })

    const config = useRuntimeConfig()
    const stripe = new Stripe(config.stripeSecretKey)


    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        return_url: `${config.public.appUrl}/shop?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
            user_id: user.sub,
        }
    })

    return { clientSecret: session.client_secret }
})