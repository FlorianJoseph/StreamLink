import { createClient } from '@supabase/supabase-js'
import type { Tables } from '~/types/database.types'

export type UserPublic = Tables<'streamer_public'>

export default defineEventHandler(async (event) => {
    const { NUXT_PUBLIC_SUPABASE_URL, NUXT_PUBLIC_SUPABASE_KEY } = process.env
    const supabase = createClient(NUXT_PUBLIC_SUPABASE_URL!, NUXT_PUBLIC_SUPABASE_KEY!)
    const { username } = event.context.params as { username: string }

    try {
        const { data, error } = await supabase
            .from('user_public')
            .select('*')
            .eq('username', username)
            .limit(1)
            .maybeSingle()

        if (error) throw error

        if (!data) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User public non trouvé'
            })
        }

        const parsedUser = {
            user_id: data.user_id,
            user: typeof data.user === 'string' ? JSON.parse(data.user) : data.user,
            design: typeof data.design === 'string' ? JSON.parse(data.design) : data.design,
            links: typeof data.links === 'string' ? JSON.parse(data.links) : data.links,
            slots: typeof data.slots === 'string' ? JSON.parse(data.slots) : data.slots,
        }

        return parsedUser
    } catch (error: any) {
        console.error('Erreur récupération user public:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur récupération user public'
        })
    }
})