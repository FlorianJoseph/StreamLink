import type { DesignInsert, DesignUpdate } from '~/modules/design/design.type'

export const useDesignRepository = () => {
    const { supabase } = useSupabase()

    const findByUserId = async (userId: string) => {
        const { data, error } = await supabase
            .from('Design')
            .select('*')
            .eq('streamer_id', userId)
            .maybeSingle()

        if (error) throw error
        return data
    }

    const create = async (payload: DesignInsert) => {
        const { data, error } = await supabase
            .from('Design')
            .insert(payload)
            .select()
            .single()

        if (error) throw error
        return data
    }

    const update = async (id: number, payload: DesignUpdate) => {
        const { error } = await supabase
            .from('Design')
            .update(payload)
            .eq('id', id)

        if (error) throw error
    }

    return {
        findByUserId,
        create,
        update,
    }
}