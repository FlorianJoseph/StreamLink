import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const supabase = serverSupabaseServiceRole(event)

    const page = parseInt(getQuery(event).page as string) || 0
    const limit = 10

    const { data, error } = await supabase
        .from('WalletTransactions')
        .select('id, amount, operation, type, created_at')
        .eq('user_id', user.sub)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1)


    if (error) throw createError({ statusCode: 500, message: error.message })

    return data
})