import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user } } = await client.auth.getUser()
    if (!user) throw createError({ statusCode: 401 })

    const { data: tokenData } = await client
        .from('StreamerTokens')
        .select('access_token')
        .eq('user_id', user.id)
        .maybeSingle()

    if (!tokenData?.access_token) return { success: false }

    const twitchRaiderId = user.user_metadata?.provider_id ?? user.user_metadata?.sub

    const res = await fetch(
        `https://api.twitch.tv/helix/raids?broadcaster_id=${twitchRaiderId}`,
        {
            method: 'DELETE',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${tokenData.access_token}`,
            }
        }
    )

    // Supprime le dernier raid + décrédite les Coins
    const { data: lastRaid } = await client
        .from('Raid')
        .select('id, coins_earned')
        .eq('raider_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (lastRaid) {
        await Promise.all([
            // Supprime le raid → libère les limites
            client.from('Raid').delete().eq('id', lastRaid.id),
            // Décrédite les Coins
            client.from('WalletTransactions').delete()
                .eq('user_id', user.id)
                .eq('type', 'raid')
                .order('created_at', { ascending: false })
                .limit(1)
        ])
    }

    return { success: res.ok || res.status === 404 }
})