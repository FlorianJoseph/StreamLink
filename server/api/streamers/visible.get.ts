import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('users_visible')
        .select(`
            username,
            avatar_url,
            language,
            Schedule (
                ScheduleSlot (
                    game,
                    day,
                    start_at,
                    end_at
                )
            )
        `)
    if (error) throw createError({ statusCode: 500, message: error.message })

    return data
})