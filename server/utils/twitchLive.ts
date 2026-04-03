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

const cache = new Map<string, { data: Record<string, LiveStatus>, ts: number }>()
const inFlight = new Map<string, Promise<Record<string, LiveStatus>>>()
const TTL = 60_000       // données fraîches
const STALE_TTL = 300_000 // données utilisables jusqu'à 5min

export async function fetchLiveStatuses(
    usernames: string[]
): Promise<Record<string, LiveStatus>> {
    if (usernames.length === 0) return {}

    // Normalisation en amont — un seul toLowerCase() par username
    const cleaned = usernames
        .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
        .map(u => u.trim().toLowerCase())
    if (cleaned.length === 0) return {}

    const key = [...cleaned].sort().join(',')

    const cached = cache.get(key)
    const age = cached ? Date.now() - cached.ts : Infinity

    // Cache frais → retour immédiat
    if (cached && age < TTL) return cached.data

    // Stale-while-revalidate : données périmées mais encore utilisables
    // → on retourne immédiatement ET on refresh en arrière-plan
    if (cached && age < STALE_TTL) {
        if (!inFlight.has(key)) {
            const bg = doFetch(cleaned, key)
            inFlight.set(key, bg)
            bg.finally(() => inFlight.delete(key))
        }
        return cached.data
    }

    // Déduplication des requêtes simultanées
    if (inFlight.has(key)) return inFlight.get(key)!

    const promise = doFetch(cleaned, key)
    inFlight.set(key, promise)
    try {
        return await promise
    } finally {
        inFlight.delete(key)
    }
}

async function doFetch(
    cleaned: string[],
    key: string
): Promise<Record<string, LiveStatus>> {
    const token = await getCachedTwitchToken()

    const chunks: string[][] = []
    for (let i = 0; i < cleaned.length; i += 100) {
        chunks.push(cleaned.slice(i, i + 100))
    }

    const results: Record<string, LiveStatus> = {}
    for (const username of cleaned) {
        results[username] = {
            isLive: false,
            gameName: null,
            gameId: null,
            viewerCount: null,
            title: null,
            thumbnailUrl: null,
            startedAt: null,
        }
    }

    await Promise.allSettled(chunks.map(async (chunk) => {
        const params = new URLSearchParams()
        params.append('type', 'live')
        for (const u of chunk) params.append('user_login', u)

        const url = `https://api.twitch.tv/helix/streams?${params.toString()}`
        const res = await fetch(url, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            console.error('[twitchLive] Erreur Twitch API', res.status, await res.text())
            return
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
    }))

    cache.set(key, { data: results, ts: Date.now() })
    return results
}