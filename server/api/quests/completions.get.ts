import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)

    if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

    const supabase = serverSupabaseServiceRole(event)

    const { data, error } = await supabase
        .from('QuestCompletions')
        .select('quest_id')
        .eq('user_id', user.sub)

    if (error) throw createError({ statusCode: 500, message: error.message })

    return data.map(r => r.quest_id)
})