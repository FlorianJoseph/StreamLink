import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = serverSupabaseServiceRole(event)

    const { count, error } = await supabase
        .from('Raid')
        .select('*', { count: 'exact', head: true })

    if (error) throw createError({ statusCode: 500, message: error.message })

    return { count: count ?? 0 }
})