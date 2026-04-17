import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event)

    // Début de la semaine (lundi)
    const now = new Date()
    const day = now.getDay()
    const diff = (day === 0 ? -6 : 1 - day)
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() + diff)
    weekStart.setHours(0, 0, 0, 0)

    // Récupère tous les raids de la semaine
    const { data: raids } = await client
        .from('Raid')
        .select('raider_id, coins_earned')
        .gte('created_at', weekStart.toISOString())

    if (!raids?.length) return []

    // Agrège par raider
    const map = new Map<string, { count: number; coins: number }>()
    for (const raid of raids) {
        const existing = map.get(raid.raider_id) ?? { count: 0, coins: 0 }
        map.set(raid.raider_id, {
            count: existing.count + 1,
            coins: existing.coins + (raid.coins_earned ?? 0),
        })
    }

    // Récupère les profils des raiders
    const ids = Array.from(map.keys())
    const { data: streamers } = await client
        .from('Streamer')
        .select('id, username, avatar_url')
        .in('id', ids)

    return (streamers ?? [])
        .map(s => ({
            username: s.username,
            avatar_url: s.avatar_url,
            raidCount: map.get(s.id)?.count ?? 0,
            coinsEarned: map.get(s.id)?.coins ?? 0,
        }))
        .sort((a, b) => b.raidCount - a.raidCount)
        .slice(0, 10)
})
