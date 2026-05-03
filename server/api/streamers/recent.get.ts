import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)
    const query = getQuery(event)
    const limit = Number(query.limit) || 5

    const { data, error } = await supabase
        .from('Streamer')
        .select('username, avatar_url')
        .not('avatar_url', 'is', null)
        .neq('avatar_url', '')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw createError({ statusCode: 500, message: error.message })

    return data
})