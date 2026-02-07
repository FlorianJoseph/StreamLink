import { getCachedTwitchToken } from '~/server/utils/twitchToken'
import { resolveCategoryCover } from '~/utils/covers'

export default defineEventHandler(async (event) => {
    const { search } = getQuery(event)
    const token = await getCachedTwitchToken()

    const twitchRes = await fetch(
        `https://api.twitch.tv/helix/search/categories?query=${search}`,
        {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${token}`,
            },
        }
    )
    const twitchData = await twitchRes.json()
    const twitchIds = twitchData.data.map((c: any) => c.id)
    const quotedTwitchIds = twitchIds.map((id: any) => `"${id}"`).join(',')

    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID!,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        body: `
    fields name, cover.url, external_games.uid, external_games.external_game_source;
    where external_games.external_game_source = 14
    & external_games.uid = (${quotedTwitchIds});
    limit 5;
  `
    })

    const igdbGames = await igdbRes.json()

    const igdbByTwitchId = Object.fromEntries(
        igdbGames.flatMap((g: any) =>
            g.external_games?.map((e: any) => [
                e.uid,
                g.cover?.url
                    ?.replace('t_thumb', 't_original')
            ]) || []
        )
    )

    return twitchData.data
        .slice(0, 5)
        .map((cat: any) => {
            const igdbCover = igdbByTwitchId[cat.id]

            return {
                label: cat.name,
                cover: resolveCategoryCover({
                    igdbCover,
                    categoryName: cat.name,
                }),
            }
        })
})