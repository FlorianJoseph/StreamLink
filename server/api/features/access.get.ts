import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

    const supabase = serverSupabaseServiceRole(event)

    const { data, error } = await supabase
        .from('FeatureAccess')
        .select('feature_key, expires_at')
        .eq('user_id', user.sub)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

    if (error) throw createError({ statusCode: 500, message: error.message })

    return data
})