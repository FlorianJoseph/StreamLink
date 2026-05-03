import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = serverSupabaseServiceRole(event)

    const { count, error } = await supabase
        .from('PageEvent')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'PAGE_VIEW')

    if (error) throw createError({ statusCode: 500, message: error.message })

    return { count: count ?? 0 }
})