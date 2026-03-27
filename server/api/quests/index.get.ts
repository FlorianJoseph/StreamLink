import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = serverSupabaseServiceRole(event)

    const { data, error } = await supabase
        .from('Quests')
        .select('*')
        .eq('is_active', true)

    if (error) throw createError({ statusCode: 500, message: error.message })

    return data
})