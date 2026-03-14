import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('user_visible')
        .select(`
            username,
            avatar_url,
            nationality,
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