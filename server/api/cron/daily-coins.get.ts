import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const auth = getHeader(event, 'authorization')
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const supabase = serverSupabaseServiceRole(event)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Récupérer tous les abonnés actifs
    const { data: subscribers } = await supabase
        .from('Subscriptions')
        .select('user_id')
        .in('status', ['active', 'past_due'])

    if (!subscribers?.length) return { credited: 0 }

    // Filtrer ceux qui ont déjà reçu leurs coins aujourd'hui
    const { data: alreadyClaimed } = await supabase
        .from('WalletTransactions')
        .select('user_id')
        .eq('type', 'daily')
        .gte('created_at', today.toISOString())
        .in('user_id', subscribers.map(s => s.user_id))

    const claimedIds = new Set(alreadyClaimed?.map(t => t.user_id) ?? [])
    const toCredit = subscribers.filter(s => !claimedIds.has(s.user_id))

    if (!toCredit.length) return { credited: 0 }

    await supabase.from('WalletTransactions').insert(
        toCredit.map(s => ({
            user_id: s.user_id,
            amount: 6,
            operation: 'credit',
            type: 'daily',
        }))
    )

    return { credited: toCredit.length }
})
