import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const userId = user.sub

    const [{ data: linkStats }, { count: totalViews }] = await Promise.all([
        client
            .from('link_stats')
            .select('link_id, day, daily_clicks, total_clicks')
            .eq('user_id', userId)
            .order('day', { ascending: true }),

        client
            .from('PageEvent')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('type', 'PAGE_VIEW'),
    ])

    const weekStr = (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().slice(0, 10) })()
    const prevStr = (() => { const d = new Date(); d.setDate(d.getDate() - 14); return d.toISOString().slice(0, 10) })()

    // Grouper par lien
    const byLink = (linkStats ?? []).reduce((acc, row) => {
        if (!acc[row.link_id]) acc[row.link_id] = []
        acc[row.link_id].push(row)
        return acc
    }, {} as Record<string, any[]>)

    const links = Object.entries(byLink).map(([linkId, rows]) => {
        const lastRow = rows.at(-1)
        const recent = rows.filter(r => r.day >= weekStr).reduce((sum, r) => sum + r.daily_clicks, 0)
        const prev = rows.filter(r => r.day >= prevStr && r.day < weekStr).reduce((sum, r) => sum + r.daily_clicks, 0)
        const trend = prev === 0 ? (recent > 0 ? 1 : null) : recent - prev

        return {
            link_id: linkId,
            total_clicks: lastRow?.total_clicks ?? 0,
            trend,
        }
    })

    const totalClicks = links.reduce((sum, l) => sum + l.total_clicks, 0)

    return {
        links,
        total: {
            views: totalViews ?? 0,
            clicks: totalClicks,
        }
    }
})