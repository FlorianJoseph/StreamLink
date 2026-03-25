import Stripe from 'stripe'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const config = useRuntimeConfig()
    const stripe = new Stripe(config.stripeSecretKey)
    const sessionId = getQuery(event).session_id as string

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId)
    const priceId = lineItems.data[0]?.price?.id

    const coinsMap: Record<string, number> = {
        [config.stripePriceCoinsStarter]: 300,
        [config.stripePriceCoinsPopular]: 750,
        [config.stripePriceCoinsPro]: 1700,
    }

    return { coins: coinsMap[priceId!] ?? 0, mode: session.metadata?.mode }
})