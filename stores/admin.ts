import { useAdminStatsRepository } from '~/modules/admin/admin.stats.repository'

export const useAdminStatsStore = defineStore('adminStats', () => {
    const { safe } = useSupabase()
    const repo = useAdminStatsRepository()

    const fetchTotalStreamers = async () => safe(() => repo.countStreamers())
    const fetchTotalStreamersVisible = async () => safe(() => repo.countStreamersVisible())
    const fetchTotalStreamersVisible7D = async () => safe(() => repo.countStreamersVisible7D())
    const fetchTotalNewsletter = async () => safe(() => repo.countNewsletter())
    const fetchTotalNewsletterNotVisible = async () => safe(() => repo.countNewsletterNotVisible())
    const fetchTotalLinks = async () => safe(() => repo.countLinks())
    const fetchTotalSlots = async () => safe(() => repo.countSlots())

    return { fetchTotalStreamers, fetchTotalStreamersVisible, fetchTotalStreamersVisible7D, fetchTotalNewsletter, fetchTotalNewsletterNotVisible, fetchTotalLinks, fetchTotalSlots }
})
