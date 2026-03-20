import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

    const supabase = serverSupabaseServiceRole(event)

    const { error } = await supabase
        .rpc('check_and_credit_quests', { p_user_id: user.sub })

    if (error) throw createError({ statusCode: 500, message: error.message })

    return { success: true }
})