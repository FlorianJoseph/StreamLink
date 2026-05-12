import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const adminClient = serverSupabaseServiceRole(event)
    const user = await serverSupabaseUser(event)

    if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const userId = user.sub
    const query = getQuery(event)
    const linkId = query.linkId as string

    if (!linkId) throw createError({ statusCode: 400, message: 'linkId requis' })

    const { data: linkStats } = await client
        .from('link_stats')
        .select('link_id, day, daily_clicks, total_clicks')
        .eq('user_id', userId)
        .eq('link_id', linkId)
        .order('day', { ascending: true })

    const lastRow = linkStats?.at(-1)
    const totalClicks = lastRow?.total_clicks ?? 0

    const sumDays = (days: number) => {
        const since = new Date()
        since.setDate(since.getDate() - days)
        const sinceStr = since.toISOString().slice(0, 10)
        return (linkStats ?? [])
            .filter(r => r.day >= sinceStr)
            .reduce((sum, r) => sum + r.daily_clicks, 0)
    }

    const weekClicks = sumDays(7)
    const monthClicks = sumDays(30)

    // Custom range
    let customClicks: number | null = null
    if (query.from && query.to) {
        const from = query.from as string
        const to = query.to as string
        customClicks = (linkStats ?? [])
            .filter(r => r.day >= from && r.day <= to)
            .reduce((sum, r) => sum + r.daily_clicks, 0)
    }

    // Tendance : 7j récents vs 7j précédents
    const recentStr = (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().slice(0, 10) })()
    const prevStr = (() => { const d = new Date(); d.setDate(d.getDate() - 14); return d.toISOString().slice(0, 10) })()

    const recentDays = (linkStats ?? []).filter(r => r.day >= recentStr).reduce((sum, r) => sum + r.daily_clicks, 0)
    const prevDays = (linkStats ?? []).filter(r => r.day >= prevStr && r.day < recentStr).reduce((sum, r) => sum + r.daily_clicks, 0)
    const weekTrend = prevDays === 0 ? (recentDays > 0 ? 1 : null) : recentDays - prevDays

    const prevMonthStr = (() => { const d = new Date(); d.setDate(d.getDate() - 60); return d.toISOString().slice(0, 10) })()
    const monthStr = (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10) })()

    const recentMonth = (linkStats ?? []).filter(r => r.day >= monthStr).reduce((sum, r) => sum + r.daily_clicks, 0)
    const prevMonth = (linkStats ?? []).filter(r => r.day >= prevMonthStr && r.day < monthStr).reduce((sum, r) => sum + r.daily_clicks, 0)
    const monthTrend = prevMonth === 0 ? (recentMonth > 0 ? 1 : null) : recentMonth - prevMonth

    // Vérifie le statut sub
    const { data: sub } = await adminClient
        .from('Subscriptions')
        .select('status')
        .eq('user_id', userId)
        .single()

    const isSub = ['active', 'trialing', 'past_due'].includes(sub?.status ?? '')

    return {
        total: totalClicks,
        week: isSub ? weekClicks : 0,
        month: isSub ? monthClicks : 0,
        custom: isSub ? customClicks : 0,
        weekTrend: isSub ? weekTrend : 0,
        monthTrend: isSub ? monthTrend : 0,
    }
})