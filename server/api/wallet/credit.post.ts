import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const { amount, type, referenceId } = await readBody(event)
    const user = await serverSupabaseUser(event)

    if (!user || !amount || !type) {
        throw createError({ statusCode: 400, message: 'Paramètres manquants' })
    }

    const supabase = await serverSupabaseClient(event)

    // Vérification idempotence — quête déjà créditée ?
    if (type === 'quest' && referenceId) {
        const { data: existing } = await supabase
            .from('WalletTransactions')
            .select('id')
            .eq('user_id', user.sub)
            .eq('type', 'quest')
            .eq('reference_id', referenceId)
            .maybeSingle()

        if (existing) {
            return { success: true, skipped: true }
        }
    }

    const { error } = await supabase
        .from('WalletTransactions')
        .insert({
            user_id: user.sub,
            amount,
            operation: 'credit',
            type,
            reference_id: referenceId ?? null
        })

    if (error) throw createError({ statusCode: 500, message: error.message })

    return { success: true }
})