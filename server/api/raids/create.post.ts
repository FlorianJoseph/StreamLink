import { serverSupabaseClient } from '#supabase/server'

const MAX_RAIDS_PER_WEEK = 4

async function refreshTwitchToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: string } | null> {
    try {
        const res = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env.TWITCH_CLIENT_ID!,
                client_secret: process.env.TWITCH_CLIENT_SECRET!,
            }),
        })
        if (!res.ok) return null
        const data = await res.json()
        return {
            accessToken: data.access_token,
            expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        }
    } catch {
        return null
    }
}

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const targetUsername: string = body?.targetUsername
    const coinsEarned: number = body?.coinsEarned

    if (!targetUsername || coinsEarned === undefined) {
        throw createError({ statusCode: 400, message: 'targetUsername et coinsEarned requis' })
    }

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
        throw createError({ statusCode: 400, message: 'Tu ne peux pas te raid toi-même' })
    }

    // Calcule le début de la semaine (lundi)
    const now = new Date()
    const day = now.getDay()
    const diff = (day === 0 ? -6 : 1 - day)
    const weekStart = new Date(now)
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
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

    const { count: dailyRaids } = await client
        .from('Raid')
        .select('id', { count: 'exact', head: true })
        .eq('raider_id', raiderId)
        .gte('created_at', today.toISOString())

    if ((dailyRaids ?? 0) >= 1) {
        throw createError({ statusCode: 429, message: 'Tu as déjà raid aujourd\'hui' })
    }

    // Vérifie que le même streamer n'a pas déjà été raidé cette semaine
    const { count: alreadyRaided } = await client
        .from('Raid')
        .select('id', { count: 'exact', head: true })
        .eq('raider_id', raiderId)
        .eq('target_username', targetUsername.toLowerCase())
        .gte('created_at', weekStart.toISOString())

    if ((alreadyRaided ?? 0) > 0) {
        throw createError({ statusCode: 409, message: 'Tu as déjà raid ce streamer cette semaine' })
    }

    // Récupère le token Twitch depuis la BDD
    const { data: tokenData } = await client
        .from('StreamerTokens')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', raiderId)
        .maybeSingle()

    let providerToken = tokenData?.access_token ?? null
    let raidedViaApi = false

    // Refresh si token expiré ou expirant dans moins de 5 minutes
    if (tokenData?.refresh_token && tokenData?.expires_at) {
        const expiresAt = new Date(tokenData.expires_at)
        const fiveMinutes = 5 * 60 * 1000
        if (expiresAt.getTime() - Date.now() < fiveMinutes) {
            const refreshed = await refreshTwitchToken(tokenData.refresh_token)

            if (refreshed) {
                providerToken = refreshed.accessToken
                await client
                    .from('StreamerTokens')
                    .update({
                        access_token: refreshed.accessToken,
                        expires_at: refreshed.expiresAt,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', raiderId)
            }
        }
    }

    if (providerToken) {
        try {
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