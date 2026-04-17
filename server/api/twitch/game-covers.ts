import { getCachedTwitchToken } from '~/server/utils/twitchToken'
import { resolveCategoryCover } from '~/utils/covers'
import { categoryFromIgdb } from '~/utils/igdbCategory'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const gameIds: string[] = body?.gameIds ?? []

    if (!Array.isArray(gameIds) || gameIds.length === 0) return {}

    // Dédupliquer
    const uniqueIds = [...new Set(gameIds.filter(Boolean))]
    if (uniqueIds.length === 0) return {}

    const token = await getCachedTwitchToken()
    const quotedIds = uniqueIds.map(id => `"${id}"`).join(',')

    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID!,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: `
      fields name, cover.url, genres.id, themes.id, game_modes.id, external_games.uid, external_games.external_game_source;
      where external_games.external_game_source = 14
      & external_games.uid = (${quotedIds});
      limit 100;
    `,
    })

    if (!igdbRes.ok) {
        console.error('[game-covers] Erreur IGDB', igdbRes.status, await igdbRes.text())
        return {}
    }

    const igdbGames = await igdbRes.json()

    // Construit un dictionnaire twitchGameId → { cover, category }
    const covers: Record<string, { cover: string | null; category: string | null }> = {}

    for (const game of igdbGames) {
        const genreIds: number[] = (game.genres ?? []).map((g: any) => g.id)
        const themeIds: number[] = (game.themes ?? []).map((t: any) => t.id)
        const modeIds: number[] = (game.game_modes ?? []).map((m: any) => m.id)
        const category = categoryFromIgdb(genreIds, themeIds, modeIds)

        for (const ext of game.external_games ?? []) {
            if (ext.external_game_source === 14 && uniqueIds.includes(ext.uid)) {
                const igdbCover = game.cover?.url?.replace('t_thumb', 't_cover_big') ?? null
                const cover = resolveCategoryCover({ igdbCover, categoryName: game.name })
                covers[ext.uid] = { cover: cover ?? null, category }
            }
        }
    }

    return covers
})