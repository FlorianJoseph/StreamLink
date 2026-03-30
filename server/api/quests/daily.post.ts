import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const supabase = serverSupabaseServiceRole(event)

    // Vérifier si déjà connecté aujourd'hui
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: existing } = await supabase
        .from('WalletTransactions')
        .select('id')
        .eq('user_id', user.sub)
        .eq('type', 'daily')
        .gte('created_at', today.toISOString())
        .single()

    if (existing) return { credited: false, coins: 0 }

    // Créditer 3 coins
    await supabase.from('WalletTransactions').insert({
        user_id: user.sub,
        amount: 3,
        operation: 'credit',
        type: 'daily',
    })

    return { credited: true, coins: 3 }
})