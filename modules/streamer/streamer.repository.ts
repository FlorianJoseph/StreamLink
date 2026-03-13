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

    return { findByUserId, create, update }
}