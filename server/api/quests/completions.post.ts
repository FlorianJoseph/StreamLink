import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const { questId } = await readBody(event)
    const user = await serverSupabaseUser(event)

    if (!user || !questId) throw createError({ statusCode: 400, message: 'Paramètres manquants' })

    const supabase = await serverSupabaseClient(event)

    const { error } = await supabase
        .from('QuestCompletions')
        .insert({ user_id: user.sub, quest_id: questId })

    // Conflit = déjà complétée, pas une erreur
    if (error && error.code !== '23505') {
        throw createError({ statusCode: 500, message: error.message })
    }

    return { success: true }
})