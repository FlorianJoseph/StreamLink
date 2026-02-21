export const useAdminStatsRepository = () => {
    const { supabase } = useSupabase()

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const countStreamers = async () => {
        const { count, error } = await supabase
            .from('Streamer')
            .select('*', { count: 'exact', head: true })

        if (error) throw error
        return count ?? 0
    }

    const countStreamers7D = async () => {
        const { count, error } = await supabase
            .from('Streamer')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', sevenDaysAgo.toISOString())

        if (error) throw error
        return count ?? 0
    }

    const countStreamers30D = async () => {
        const { count, error } = await supabase
            .from('Streamer')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', thirtyDaysAgo.toISOString())

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
        const { count, error } = await supabase
            .from('streamer_visible')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', sevenDaysAgo.toISOString())


        if (error) throw error
        return count ?? 0
    }

    const countStreamersVisible30D = async () => {
        const { count, error } = await supabase
            .from('streamer_visible')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', thirtyDaysAgo.toISOString())


        if (error) throw error
        return count ?? 0
    }

    const countTotalStreamersVisiblePrev7D = async () => {
        const { count, error } = await supabase
            .from('streamer_visible')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', fourteenDaysAgo.toISOString())
            .lt('created_at', sevenDaysAgo.toISOString())

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
    const countNewsletter7D = async () => {
        const { count, error } = await supabase
            .from('newsletter_subscriptions')
            .select('*', { count: 'exact', head: true })
            .filter('subscribed_at', 'gte', sevenDaysAgo.toISOString())

        if (error) throw error
        return count ?? 0
    }
    const countNewsletter30D = async () => {
        const { count, error } = await supabase
            .from('newsletter_subscriptions')
            .select('*', { count: 'exact', head: true })
            .filter('subscribed_at', 'gte', thirtyDaysAgo.toISOString())

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

    const countTotalStreamersWithLink = async () => {
        const { data, error } = await supabase
            .from('Link')
            .select('user_id')
        if (error) throw error

        const unique = new Set(data?.map(l => l.user_id))
        return unique.size
    }

    const conversionLink = async () => {
        const { data, count, error } = await supabase
            .from('Link')
            .select('user_id', { count: 'exact' })
        if (error) throw error

        // on garde les user_id uniques
        const uniqueUsersWithLink = new Set(data?.map(link => link.user_id))
        const totalVisible = await supabase
            .from('Streamer')
            .select('*', { count: 'exact', head: true })
        const totalVisibleCount = totalVisible.count ?? 0

        if (totalVisibleCount === 0) return 0

        return Math.round((uniqueUsersWithLink.size / totalVisibleCount) * 100)
    }

    const countLinks7D = async () => {
        const { count, error } = await supabase
            .from('Link')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', sevenDaysAgo.toISOString())
        if (error) throw error
        return count ?? 0
    }

    const countLinks30D = async () => {
        const { count, error } = await supabase
            .from('Link')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', thirtyDaysAgo.toISOString())
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

    const countTotalStreamersWithSlot = async () => {
        const { data: slotsData, error: slotsError } = await supabase
            .from('ScheduleSlot')
            .select('schedule_id')
        if (slotsError) throw slotsError

        const { data: scheduleData, error: scheduleError } = await supabase
            .from('Schedule')
            .select('id, user_id')
        if (scheduleError) throw scheduleError

        const scheduleMap = new Map(scheduleData.map(s => [s.id, s.user_id]))
        const unique = new Set(slotsData.map(s => scheduleMap.get(s.schedule_id)).filter(Boolean))
        return unique.size
    }

    const conversionSlots = async () => {
        // Récupère tous les ScheduleSlot
        const { data: slotsData, error: slotsError } = await supabase
            .from('ScheduleSlot')
            .select('schedule_id, created_at')
        if (slotsError) throw slotsError

        // Récupère les user_id via la table Schedule
        const { data: scheduleData, error: scheduleError } = await supabase
            .from('Schedule')
            .select('id, user_id')
        if (scheduleError) throw scheduleError

        // Map schedule_id -> user_id
        const scheduleMap = new Map(scheduleData.map(s => [s.id, s.user_id]))

        // Récupère les user_id uniques ayant au moins un slot
        const uniqueUsersWithSlot = new Set(
            slotsData
                .map(slot => scheduleMap.get(slot.schedule_id))
                .filter(Boolean)
        )

        // Total de streamers visibles ou total global
        const { count: totalStreamersCount } = await supabase
            .from('streamer_visible')
            .select('*', { count: 'exact', head: true })

        if ((totalStreamersCount ?? 0) === 0) return 0

        return Math.round((uniqueUsersWithSlot.size / (totalStreamersCount ?? 1)) * 100)
    }

    const countSlots7D = async () => {
        const { count, error } = await supabase
            .from('ScheduleSlot')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', sevenDaysAgo.toISOString())

        if (error) throw error
        return count ?? 0
    }

    const countSlots30D = async () => {
        const { count, error } = await supabase
            .from('ScheduleSlot')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', thirtyDaysAgo.toISOString())

        if (error) throw error
        return count ?? 0
    }

    return {
        countStreamers, countStreamers7D, countStreamers30D,
        countStreamersVisible, countStreamersVisible7D, countStreamersVisible30D,
        countTotalStreamersVisiblePrev7D, countTotalStreamersWithLink, countNewsletter,
        countNewsletter7D, countNewsletter30D, countNewsletterNotVisible, countLinks,
        countLinks7D, countLinks30D, countSlots, countTotalStreamersWithSlot, countSlots7D,
        countSlots30D, conversionLink, conversionSlots
    }
}