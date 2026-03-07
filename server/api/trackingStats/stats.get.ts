import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const userId = user.sub

    const [{ count: totalViews }, { data: linkStats }] = await Promise.all([
        client
            .from('PageEvent')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('type', 'PAGE_VIEW'),

        client
            .from('link_stats')
            .select('link_id, day, daily_clicks, week_clicks, total_clicks')
            .eq('user_id', userId)
            .order('day', { ascending: true })
    ])

    // Dernière ligne par lien = totaux corrects
    const lastPerLink = Object.values(
        (linkStats ?? []).reduce((acc, row) => {
            acc[row.link_id] = row
            return acc
        }, {} as Record<string, any>)
    )

    const totalClicks = lastPerLink.reduce((sum, row) => sum + (row.total_clicks ?? 0), 0)
    const weekClicks = lastPerLink.reduce((sum, row) => sum + (row.week_clicks ?? 0), 0)

    // Clics globaux par jour (tous liens confondus)
    const dailyClicks = Object.values(
        (linkStats ?? []).reduce((acc, row) => {
            if (!acc[row.day]) acc[row.day] = { day: row.day, daily_clicks: 0 }
            acc[row.day].daily_clicks += row.daily_clicks
            return acc
        }, {} as Record<string, { day: string; daily_clicks: number }>)
    ).sort((a, b) => a.day.localeCompare(b.day))

    return {
        total: {
            views: totalViews ?? 0,
            clicks: totalClicks,
        },
        week: {
            clicks: weekClicks,
        },
        daily: dailyClicks,  // [{ day, daily_clicks }] pour le graphique
        links: linkStats ?? []
    }
})