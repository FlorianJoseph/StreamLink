import type { LinkInsert, LinkUpdate } from '~/modules/link/link.type'

export const useLinkRepository = () => {
    const { supabase } = useSupabase()

    const fetchByUserId = async (userId: string) => {
        const { data, error } = await supabase
            .from('Link')
            .select('*')
            .eq('streamer_id', userId)
            .order('order', { ascending: true })

        if (error) throw error
        return data
    }

    const fetchLinkPublic = async (streamerId: string) => {
        const { data, error } = await supabase
            .from('Link')
            .select('*')
            .eq('streamer_id', streamerId)
            .order('order', { ascending: true })

        if (error) throw error
        return data
    }

    const create = async (payload: LinkInsert) => {
        const { data, error } = await supabase
            .from('Link')
            .insert([payload])
            .select()
            .single()

        if (error) throw error
        return data
    }

    const update = async (id: string, payload: LinkUpdate) => {
        const { data, error } = await supabase
            .from('Link')
            .update(payload)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    const remove = async (id: string) => {
        const { error } = await supabase
            .from('Link')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    const updateVisibility = async (id: string, visible: boolean) => {
        const { error } = await supabase
            .from('Link')
            .update({ visible })
            .eq('id', id)

        if (error) throw error
    }

    const updateOrder = async (links: { id: string; order: number }[]) => {
        for (const link of links) {
            const { error } = await supabase
                .from('Link')
                .update({ order: link.order })
                .eq('id', link.id)

            if (error) throw error
        }
    }

    return {
        fetchByUserId,
        fetchLinkPublic,
        create,
        update,
        remove,
        updateVisibility,
        updateOrder,
    }
}
