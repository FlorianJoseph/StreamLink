import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const supabase = serverSupabaseServiceRole(event)
    const { data } = await supabase
        .from('Subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.sub)
        .single()

    return data
})