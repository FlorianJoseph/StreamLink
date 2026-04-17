import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count } = await client
        .from('Raid')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

    return { count: count ?? 0 }
})
