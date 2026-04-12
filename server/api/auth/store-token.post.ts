import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const { accessToken, refreshToken } = body

    if (!accessToken) {
        throw createError({ statusCode: 400, message: 'accessToken requis' })
    }

    const { data: { user } } = await client.auth.getUser()
    if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

    const { error } = await client
        .from('StreamerTokens')
        .upsert({
            user_id: user.id,
            access_token: accessToken,
            refresh_token: refreshToken ?? null,
            expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

    if (error) throw createError({ statusCode: 500, message: error.message })

    return { success: true }
})