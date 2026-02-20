import type { StreamerInsert, StreamerUpdate } from '~/modules/streamer/streamer.type'

export const useStreamerRepository = () => {
    const { supabase } = useSupabase()

    const findByUserId = async (userId: string) => {
        const { data, error } = await supabase
            .from('Streamer')
            .select('*')
            .eq('id', userId)
            .maybeSingle()

        if (error) throw error
        return data
    }

    const findByUsername = async (username: string) => {
        const { data, error } = await supabase
            .from('Streamer')
            .select('*')
            .eq('username', username)
            .single()

        if (error) throw error
        return data
    }

    const findAllVisible = async () => {
        const { data, error } = await supabase
            .from('streamer_visible')
            .select(`
            *,
            Schedule (
                id,
                ScheduleSlot (
                    id,
                    game,
                    day,
                    start_at
                )
            )
        `)
            .order('created_at', { ascending: true })
        if (error) throw error
        return data
    }

    const create = async (payload: StreamerInsert) => {
        const { data, error } = await supabase
            .from('Streamer')
            .insert([payload])
            .select()
            .single()

        if (error) throw error
        return data
    }

    const update = async (userId: string, payload: StreamerUpdate) => {
        const { data, error } = await supabase
            .from('Streamer')
            .update(payload)
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    }

    return { findByUserId, findByUsername, findAllVisible, create, update }
}