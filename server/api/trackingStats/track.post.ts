import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { userId, type, linkId } = await readBody(event)

    if (!userId || !type) return { success: false }

    const { error } = await client
        .from('PageEvent')
        .insert({
            user_id: userId,
            type,
            link_id: linkId ?? null
        })

    if (error) return { success: false, error: error.message };

    return { success: true }
})