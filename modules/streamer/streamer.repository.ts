import type { StreamerInsert, StreamerUpdate } from '~/modules/streamer/streamer.type'

export const useStreamerRepository = () => {
    const { supabase } = useSupabase()

    const fetchStreamer = async (userId: string) => {
        const { data, error } = await supabase
            .from('Streamer')
            .select('*')
            .eq('id', userId)
            .maybeSingle()

        if (error) throw error
        return data
    }

    const fetchStreamerPublic = async (username: string) => {
        const { data, error } = await supabase
            .from('Streamer')
            .select('*')
            .eq('username', username)
            .single()

        if (error) throw error
        return data
    }

    const fetchAllStreamers = async () => {
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

    const createStreamer = async (payload: StreamerInsert) => {
        const { data, error } = await supabase
            .from('Streamer')
            .insert([payload])
            .select()
            .single()

        if (error) throw error
        return data
    }

    const updateStreamer = async (streamerId: string, payload: StreamerUpdate) => {
        const { data, error } = await supabase
            .from('Streamer')
            .update(payload)
            .eq('id', streamerId)
            .select()
            .single()

        if (error) throw error
        return data
    }

    return { fetchStreamer, fetchStreamerPublic, fetchAllStreamers, createStreamer, updateStreamer }
}