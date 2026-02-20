export const useAdminStatsRepository = () => {
    const { supabase } = useSupabase()

    const countStreamers = async () => {
        const { count, error } = await supabase
            .from('Streamer')
            .select('*', { count: 'exact', head: true })

        if (error) throw error
        return count ?? 0
    }

    const countStreamersVisible = async () => {
        const { count, error } = await supabase
            .from('streamer_visible')
            .select('*', { count: 'exact', head: true })

        if (error) throw error
        return count ?? 0
    }

    const countStreamersVisible7D = async () => {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const { count, error } = await supabase
            .from('streamer_visible')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', sevenDaysAgo.toISOString())

        if (error) throw error
        return count ?? 0
    }

    const countNewsletter = async () => {
        const { count, error } = await supabase
            .from('newsletter_subscriptions')
            .select('*', { count: 'exact', head: true })

        if (error) throw error
        return count ?? 0
    }

    const countNewsletterNotVisible = async () => {
        const { count, error } = await supabase
            .from('newsletter_not_streamer_visible')
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

    return { countStreamers, countStreamersVisible, countStreamersVisible7D, countNewsletter, countNewsletterNotVisible, countLinks, countSlots }
}