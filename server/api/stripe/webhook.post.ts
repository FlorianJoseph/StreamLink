// import { loadStripe } from '@stripe/stripe-js';
// import { serverSupabaseServiceRole } from '#supabase/server'

// export default defineEventHandler(async (event) => {
//     const config = useRuntimeConfig()
//     const stripe = await loadStripe(config.stripeSecretKey);

//     const body = await readRawBody(event)
//     const sig = getHeader(event, 'stripe-signature')

//     let stripeEvent: stripe.Event

//     try {
//         stripeEvent = stripe.webhooks.constructEvent(body!, sig!, config.stripeWebhookSecret)
//     } catch (err) {
//         throw createError({ statusCode: 400, message: `Webhook error: ${err}` })
//     }

//     const supabase = serverSupabaseServiceRole(event)

//     if (stripeEvent.type === 'checkout.session.completed') {
//         const session = stripeEvent.data.object as Stripe.Checkout.Session
//         const userId = session.metadata?.user_id
//         const mode = session.metadata?.mode

//         if (!userId) return { received: true }

//         if (mode === 'payment') {
//             // Récupérer les line items pour savoir quel pack
//             const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
//             const priceId = lineItems.data[0]?.price?.id

//             // Mapper priceId → Shards
//             const shardsMap: Record<string, number> = {
//                 [process.env.STRIPE_PRICE_STARTER!]: 500,
//                 [process.env.STRIPE_PRICE_POPULAR!]: 1500,
//                 [process.env.STRIPE_PRICE_PRO!]: 3500,
//             }

//             const shards = shardsMap[priceId!] ?? 0

//             if (shards > 0) {
//                 await supabase.from('WalletTransactions').insert({
//                     user_id: userId,
//                     amount: shards,
//                     operation: 'credit',
//                     type: 'purchase',
//                     reference_id: null
//                 })
//             }
//         }

//         if (mode === 'subscription') {
//             // Activer toutes les features pour l'abonné
//             const features = ['premium_theme', 'no_branding', 'mobile_export']
//             for (const featureKey of features) {
//                 await supabase.from('FeatureAccess').upsert({
//                     user_id: userId,
//                     feature_key: featureKey,
//                     expires_at: null, // illimité
//                     source: 'subscription'
//                 }, { onConflict: 'user_id, feature_key' })
//             }
//         }
//     }

//     if (stripeEvent.type === 'customer.subscription.deleted') {
//         const subscription = stripeEvent.data.object as Stripe.Subscription
//         // Récupérer le user_id depuis les metadata du customer
//         const customer = await stripe.customers.retrieve(subscription.customer as string)
//         const userId = (customer as Stripe.Customer).metadata?.user_id

//         if (userId) {
//             await supabase
//                 .from('FeatureAccess')
//                 .update({ expires_at: new Date().toISOString() })
//                 .eq('user_id', userId)
//                 .eq('source', 'subscription')
//         }
//     }

//     return { received: true }
// })