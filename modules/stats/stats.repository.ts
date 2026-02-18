export const useStatsRepository = () => {
    const { supabase } = useSupabase()

    const countStreamers = async () => {
        const { count, error } = await supabase
            .from('streamer_visible')
            .select('*', { count: 'exact', head: true })

        if (error) throw error
        return count ?? 0
    }

    const countLinks = async () => {
        const { count, error } = await supabase
            .from('Link')
            .select('*', { count: 'exact', head: true })
        if (error) throw error
        return count ?? 0
    }

    const countSlots = async () => {
        const { count, error } = await supabase
            .from('ScheduleSlot')
            .select('*', { count: 'exact', head: true })

        if (error) throw error
        return count ?? 0
    }

    return { countStreamers, countLinks, countSlots }
}