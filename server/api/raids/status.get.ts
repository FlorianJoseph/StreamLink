import { serverSupabaseClient } from '#supabase/server'

const MAX_RAIDS_PER_WEEK = 4

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data: { user } } = await client.auth.getUser()
    if (!user) return { remaining: 0, used: 0, total: MAX_RAIDS_PER_WEEK }

    // Début de la semaine (lundi)
    const now = new Date()
    const day = now.getDay()
    const diff = (day === 0 ? -6 : 1 - day)
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() + diff)
    weekStart.setHours(0, 0, 0, 0)

    // Nombre de raids cette semaine
    const { count } = await client
        .from('Raid')
        .select('id', { count: 'exact', head: true })
        .eq('raider_id', user.id)
        .gte('created_at', weekStart.toISOString())

    const today = new Date(now)
    today.setHours(0, 0, 0, 0)

    // Nombre de raids aujourd'hui
    const { count: dailyCount } = await client
        .from('Raid')
        .select('id', { count: 'exact', head: true })
        .eq('raider_id', user.id)
        .gte('created_at', today.toISOString())

    const used = count ?? 0

    // Récupère les raids de la semaine pour afficher les streamers raidés
    const { data: weeklyRaids } = await client
        .from('Raid')
        .select('target_username')
        .eq('raider_id', user.id)
        .gte('created_at', weekStart.toISOString())

    return {
        remaining: Math.max(0, MAX_RAIDS_PER_WEEK - used),
        used,
        total: MAX_RAIDS_PER_WEEK,
        canRaidToday: (dailyCount ?? 0) === 0,
        raidedThisWeek: weeklyRaids?.map(r => r.target_username) ?? [],
    }
})