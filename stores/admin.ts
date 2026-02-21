import { useAdminStatsRepository } from '~/modules/admin/admin.stats.repository'

export const useAdminStatsStore = defineStore('adminStats', () => {
    const { safe } = useSupabase()
    const repo = useAdminStatsRepository()

    const fetchTotalStreamers = async () => safe(() => repo.countStreamers())
    const fetchTotalStreamers7D = async () => safe(() => repo.countStreamers7D())
    const fetchTotalStreamers30D = async () => safe(() => repo.countStreamers30D())
    const fetchTotalStreamersVisible = async () => safe(() => repo.countStreamersVisible())
    const fetchTotalStreamersVisible7D = async () => safe(() => repo.countStreamersVisible7D())
    const fetchTotalStreamersVisible30D = async () => safe(() => repo.countStreamersVisible30D())
    const fetchTotalStreamersVisiblePrev7D = async () => safe(() => repo.countTotalStreamersVisiblePrev7D())
    const fetchTotalNewsletter = async () => safe(() => repo.countNewsletter())
    const fetchTotalNewsletter7D = async () => safe(() => repo.countNewsletter7D())
    const fetchTotalNewsletter30D = async () => safe(() => repo.countNewsletter30D())
    const fetchTotalNewsletterNotVisible = async () => safe(() => repo.countNewsletterNotVisible())
    const fetchTotalLinks = async () => safe(() => repo.countLinks())
    const fetchTotalStreamersWithLink = async () => safe(() => repo.countTotalStreamersWithLink())
    const fetchConversionLink = async () => safe(() => repo.conversionLink())
    const fetchTotalLinks7D = async () => safe(() => repo.countLinks7D())
    const fetchTotalLinks30D = async () => safe(() => repo.countLinks30D())
    const fetchTotalSlots = async () => safe(() => repo.countSlots())
    const fetchTotalStreamersWithSlot = async () => safe(() => repo.countTotalStreamersWithSlot())
    const fetchConversionSlots = async () => safe(() => repo.conversionSlots())
    const fetchTotalSlots7D = async () => safe(() => repo.countSlots7D())
    const fetchTotalSlots30D = async () => safe(() => repo.countSlots30D())

    return {
        fetchTotalStreamers, fetchTotalStreamers7D, fetchTotalStreamers30D,
        fetchTotalStreamersVisible, fetchTotalStreamersVisible7D, fetchTotalStreamersVisible30D,
        fetchTotalStreamersVisiblePrev7D, fetchTotalStreamersWithLink, fetchTotalStreamersWithSlot,
        fetchConversionLink, fetchConversionSlots, fetchTotalNewsletter, fetchTotalNewsletter7D,
        fetchTotalNewsletter30D, fetchTotalNewsletterNotVisible, fetchTotalLinks, fetchTotalLinks7D,
        fetchTotalLinks30D, fetchTotalSlots, fetchTotalSlots7D, fetchTotalSlots30D
    }
})
