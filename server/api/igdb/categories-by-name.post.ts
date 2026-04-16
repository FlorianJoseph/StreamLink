import { getCachedTwitchToken } from '~/server/utils/twitchToken'
import { categoryFromIgdb } from '~/utils/igdbCategory'

/**
 * Résout les catégories IGDB pour une liste de noms de jeux.
 * Utilisé pour enrichir les streamers offline dont le jeu est stocké sans ID.
 *
 * POST /api/igdb/categories-by-name
 * Body: { gameNames: string[] }
 * Returns: Record<string, string | null>  (gameName → category)
 */
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const gameNames: string[] = body?.gameNames ?? []

    if (!Array.isArray(gameNames) || gameNames.length === 0) return {}

    const unique = [...new Set(gameNames.filter(Boolean))]
    if (unique.length === 0) return {}

    const token = await getCachedTwitchToken()

    // IGDB supporte where name = ("name1","name2",...) pour la correspondance exacte
    const quoted = unique.map(n => `"${n.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',')

    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID!,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: `
      fields name, genres.id, themes.id, game_modes.id;
      where name = (${quoted});
      limit 50;
    `,
    })

    if (!igdbRes.ok) {
        console.error('[categories-by-name] Erreur IGDB', igdbRes.status, await igdbRes.text())
        return {}
    }

    const igdbGames = await igdbRes.json()

    const result: Record<string, string | null> = {}
    for (const game of igdbGames) {
        const genreIds: number[] = (game.genres ?? []).map((g: any) => g.id)
        const themeIds: number[] = (game.themes ?? []).map((t: any) => t.id)
        const modeIds: number[] = (game.game_modes ?? []).map((m: any) => m.id)
        result[game.name] = categoryFromIgdb(genreIds, themeIds, modeIds)
    }

    return result
})
