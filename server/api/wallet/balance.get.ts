import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)

    if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

    const supabase = await serverSupabaseClient(event)

    const { data, error } = await supabase
        .rpc('get_wallet_balance', { p_user_id: user.sub })

    if (error) throw createError({ statusCode: 500, message: error.message })

    return { balance: data }
})