export default defineEventHandler(async (event) => {
    const family = getRouterParam(event, 'family')

    const url = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`

    const css = await $fetch<string>(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    })

    // Fetch chaque URL woff2 et convertir en base64
    const woff2Urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)]
        .map(m => m[1])

    let cssWithBase64 = css

    for (const woff2Url of woff2Urls) {
        const buffer = await $fetch<ArrayBuffer>(woff2Url, { responseType: 'arrayBuffer' })
        const base64 = Buffer.from(buffer).toString('base64')
        cssWithBase64 = cssWithBase64.replace(woff2Url, `data:font/woff2;base64,${base64}`)
    }

    return cssWithBase64
})