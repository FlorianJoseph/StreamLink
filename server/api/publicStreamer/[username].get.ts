import { createClient } from '@supabase/supabase-js'
import type { Tables } from '~/types/database.types'

export type StreamerPublic = Tables<'streamer_public'>

export default defineEventHandler(async (event) => {
    const { NUXT_PUBLIC_SUPABASE_URL, NUXT_PUBLIC_SUPABASE_KEY } = process.env
    const supabase = createClient(NUXT_PUBLIC_SUPABASE_URL!, NUXT_PUBLIC_SUPABASE_KEY!)
    const { username } = event.context.params as { username: string }

    try {
        const { data, error } = await supabase
            .from<'streamer_public', StreamerPublic>('streamer_public')
            .select('*')
            .eq('username', username)
            .maybeSingle() // renvoie un objet ou null si aucun streamer

        if (error) throw error

        return data ?? null
    } catch (error: any) {
        console.error('Erreur récupération streamer public:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur récupération streamer public'
        })
    }
})