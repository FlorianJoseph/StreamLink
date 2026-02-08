const tokenCache = {
    token: null as string | null,
    expiresAt: 0
}

export const getCachedTwitchToken = async () => {
    const now = Date.now()

    if (tokenCache.token && tokenCache.expiresAt > now) {
        return tokenCache.token
    }

    const clientId = process.env.TWITCH_CLIENT_ID
    const clientSecret = process.env.TWITCH_CLIENT_SECRET

    const res = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
        { method: 'POST' }
    )

    const data = await res.json()

    // Cache pour ~1h
    tokenCache.token = data.access_token
    tokenCache.expiresAt = now + (3600 * 1000)

    return data.access_token
}