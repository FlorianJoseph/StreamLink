async function getTwitchToken() {
    const clientId = process.env.TWITCH_CLIENT_ID
    const clientSecret = process.env.TWITCH_CLIENT_SECRET

    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
        method: 'POST'
    })

    const data = await res.json()
    return data.access_token
}

export default defineEventHandler(async (event) => {
    const { search } = getQuery(event)
    const token = await getTwitchToken()

    const response = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID!,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        body: `fields name,cover.url; search "${search}";`
    })

    const data = await response.json()

    return data.map((g: any) => ({
        label: g.name,
        cover: g.cover?.url || null
    }))
})
