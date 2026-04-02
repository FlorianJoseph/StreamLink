import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = serverSupabaseServiceRole(event)
    const { type, utm_source, utm_campaign, userId } = await readBody(event)

    await supabase.from('MarketingEvent').insert({ 
        type, 
        utm_source: utm_source ?? null,
        utm_campaign: utm_campaign ?? null,
        user_id: userId ?? null 
    })

    return { success: true }
})