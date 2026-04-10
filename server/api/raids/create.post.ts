import { serverSupabaseClient } from '#supabase/server'

const MAX_RAIDS_PER_WEEK = 4

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const targetUsername: string = body?.targetUsername
    const coinsEarned: number = body?.coinsEarned

    if (!targetUsername || coinsEarned === undefined) {
        throw createError({ statusCode: 400, message: 'targetUsername et coinsEarned requis' })
    }

    // Récupère le streamer connecté
    const { data: { user } } = await client.auth.getUser()
    if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

    const raiderId = user.id

    // Vérifie que le raider ne raid pas sa propre chaîne
    const { data: raider } = await client
        .from('Streamer')
        .select('username')
        .eq('id', raiderId)
        .maybeSingle()

    if (raider?.username?.toLowerCase() === targetUsername.toLowerCase()) {
        throw createError({ statusCode: 400, message: 'Vous ne pouvez pas vous raider vous-même' })
    }

    // Calcule le début de la semaine (lundi)
    const now = new Date()
    const day = now.getDay()
    const diff = (day === 0 ? -6 : 1 - day)
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() + diff)
    weekStart.setHours(0, 0, 0, 0)

    // Vérifie le nombre de raids cette semaine
    const { count: weeklyRaids } = await client
        .from('Raid')
        .select('id', { count: 'exact', head: true })
        .eq('raider_id', raiderId)
        .gte('created_at', weekStart.toISOString())

    if ((weeklyRaids ?? 0) >= MAX_RAIDS_PER_WEEK) {
        throw createError({ statusCode: 429, message: 'Limite de 4 raids par semaine atteinte' })
    }

    // Vérifie que le même streamer n'a pas déjà été raidé cette semaine
    const { count: alreadyRaided } = await client
        .from('Raid')
        .select('id', { count: 'exact', head: true })
        .eq('raider_id', raiderId)
        .eq('target_username', targetUsername.toLowerCase())
        .gte('created_at', weekStart.toISOString())

    if ((alreadyRaided ?? 0) > 0) {
        throw createError({ statusCode: 409, message: 'Vous avez déjà raidé ce streamer cette semaine' })
    }

    const providerToken: string | null = body?.providerToken ?? null
    let raidedViaApi = false

    // Tente le raid via API Twitch si token disponible
    if (providerToken) {
        try {
            // Récupère l'ID Twitch du streamer cible
            const targetRes = await fetch(
                `https://api.twitch.tv/helix/users?login=${targetUsername}`,
                {
                    headers: {
                        'Client-ID': process.env.TWITCH_CLIENT_ID!,
                        'Authorization': `Bearer ${providerToken}`,
                    }
                }
            )
            const targetData = await targetRes.json()
            const targetId = targetData.data?.[0]?.id

            if (targetId) {
                const twitchRaiderId = user.user_metadata?.provider_id ?? user.user_metadata?.sub

                if (twitchRaiderId) {
                    const raidRes = await fetch(
                        `https://api.twitch.tv/helix/raids?from_broadcaster_id=${twitchRaiderId}&to_broadcaster_id=${targetId}`,
                        {
                            method: 'POST',
                            headers: {
                                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                                'Authorization': `Bearer ${providerToken}`,
                            }
                        }
                    )
                    if (raidRes.ok) raidedViaApi = true
                }
            }
        } catch (err) {
            console.warn('[raids] Twitch API raid échoué, fallback presse-papier', err)
        }
    }

    // RPC atomique
    const { error: raidError } = await client.rpc('create_raid', {
        p_raider_id: raiderId,
        p_target_username: targetUsername.toLowerCase(),
        p_coins_earned: coinsEarned,
    })

    if (raidError) throw createError({ statusCode: 500, message: raidError.message })

    return { success: true, coinsEarned, raidedViaApi }
})