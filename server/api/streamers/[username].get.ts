import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const serviceClient = serverSupabaseServiceRole(event)

    const { username } = event.context.params as { username: string }

    const { data, error } = await client
        .from('user_page')
        .select('*')
        .eq('username', username)
        .limit(1)
        .maybeSingle()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Erreur récupération user page' })
    }

    const { data: brandingAccess } = await client
        .from('FeatureAccess')
        .select('id')
        .eq('user_id', data.user_id)
        .eq('feature_key', 'no_branding')
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
        .maybeSingle()

    const { data: subscription } = await serviceClient
        .from('Subscriptions')
        .select('status, current_period_end')
        .eq('user_id', data.user_id)
        .maybeSingle()

    const isSub = subscription?.status === 'active' ||
        (subscription?.status === 'canceled' && subscription?.current_period_end &&
            new Date(subscription.current_period_end) > new Date())

    const parsedUser = {
        user_id: data?.user_id,
        user: typeof data?.user === 'string' ? JSON.parse(data.user) : data?.user,
        design: typeof data?.design === 'string' ? JSON.parse(data.design) : data?.design,
        links: typeof data?.links === 'string' ? JSON.parse(data.links) : data?.links,
        slots: typeof data?.slots === 'string' ? JSON.parse(data.slots) : data?.slots,
        noBranding: !!brandingAccess || isSub
    }

    return parsedUser
})