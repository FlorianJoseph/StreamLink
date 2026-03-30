import { getCachedTwitchToken } from '~/server/utils/twitchToken'

export interface LiveStatus {
    isLive: boolean
    gameName: string | null
    gameId: string | null
    viewerCount: number | null
    title: string | null
    thumbnailUrl: string | null
    startedAt: string | null
}

export async function fetchLiveStatuses(
    usernames: string[]
): Promise<Record<string, LiveStatus>> {
    if (usernames.length === 0) return {}

    // Nettoyage défensif : on retire tout ce qui n'est pas une string non vide
    const cleaned = usernames.filter(
        (u): u is string => typeof u === 'string' && u.trim().length > 0
    )

    if (cleaned.length === 0) return {}

    const token = await getCachedTwitchToken()

    const chunks: string[][] = []
    for (let i = 0; i < cleaned.length; i += 100) {
        chunks.push(cleaned.slice(i, i + 100))
    }

    const results: Record<string, LiveStatus> = {}

    for (const username of cleaned) {
        results[username.toLowerCase()] = {
            isLive: false,
            gameName: null,
            gameId: null,
            viewerCount: null,
            title: null,
            thumbnailUrl: null,
            startedAt: null,
        }
    }

    for (const chunk of chunks) {
        // URLSearchParams gère l'encodage proprement, y compris les caractères spéciaux
        const params = new URLSearchParams()
        params.append('type', 'live')
        for (const u of chunk) {
            params.append('user_login', u.trim())
        }

        const url = `https://api.twitch.tv/helix/streams?${params.toString()}`

        const res = await fetch(url, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            console.error('[twitchLive] Erreur Twitch API', res.status, await res.text())
            console.error('[twitchLive] URL appelée:', url)
            continue
        }

        const data = await res.json()

        for (const stream of data.data) {
            results[stream.user_login.toLowerCase()] = {
                isLive: true,
                gameName: stream.game_name || null,
                gameId: stream.game_id || null,
                viewerCount: stream.viewer_count ?? null,
                title: stream.title || null,
                thumbnailUrl: stream.thumbnail_url?.replace('{width}x{height}', '440x248') ?? null,
                startedAt: stream.started_at || null,
            }
        }
    }

    return results
}