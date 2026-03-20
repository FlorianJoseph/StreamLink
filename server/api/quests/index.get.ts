import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    const { data, error } = await supabase
        .from('Quests')
        .select('*')
        .eq('is_active', true)

    if (error) throw createError({ statusCode: 500, message: error.message })

    return data
})