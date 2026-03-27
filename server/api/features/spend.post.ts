import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

    const { featureKey, priceId } = await readBody(event)
    if (!featureKey || !priceId) throw createError({ statusCode: 400, message: 'Paramètres manquants' })

    const supabase = serverSupabaseServiceRole(event)

    // Récupérer le prix
    const { data: price, error: priceError } = await supabase
        .from('FeaturePrices')
        .select('*')
        .eq('id', priceId)
        .eq('feature_key', featureKey)
        .single()

    if (priceError || !price) throw createError({ statusCode: 404, message: 'Prix introuvable' })

    // Vérifier le solde
    const { data: balance } = await supabase
        .rpc('get_wallet_balance', { p_user_id: user.sub })

    if (balance < price.cost) throw createError({ statusCode: 400, message: 'Solde insuffisant' })

    // Vérifier si déjà actif
    const { data: existing } = await supabase
        .from('FeatureAccess')
        .select('id, expires_at')
        .eq('user_id', user.sub)
        .eq('feature_key', featureKey)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

    const expiresAt = existing?.expires_at
        ? new Date(new Date(existing.expires_at).getTime() + price.duration_days * 86400000)
        : new Date(Date.now() + price.duration_days * 86400000)

    // Insérer dans FeatureAccess
    const { error: accessError } = await supabase
        .from('FeatureAccess')
        .upsert({
            user_id: user.sub,
            feature_key: featureKey,
            expires_at: expiresAt.toISOString(),
            source: 'purchase'
        }, { onConflict: 'user_id, feature_key' })

    if (accessError) throw createError({ statusCode: 500, message: accessError.message })

    // Débiter les Coins
    const { error: walletError } = await supabase
        .from('WalletTransactions')
        .insert({
            user_id: user.sub,
            amount: price.cost,
            operation: 'debit',
            type: 'spend',
            reference_id: null
        })

    if (walletError) throw createError({ statusCode: 500, message: walletError.message })

    return { success: true, expiresAt }
})