import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export async function checkAdmin(event : any) {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    if (!user?.sub) throw createError({ statusCode: 401, message: 'Non authentifié' })

    const { data: streamer, error } = await client
        .from('Streamer')
        .select('is_admin')
        .eq('id', user.sub)
        .single()

    if (error || !streamer?.is_admin) throw createError({ statusCode: 403, message: 'Accès réservé aux administrateurs' })

    return client
}