import { useStatsRepository } from '~/modules/stats/stats.repository'

export const useStatsStore = defineStore('stats', () => {
    const { safe } = useSupabase()
    const repo = useStatsRepository()

    const fetchTotalStreamers = async () => safe(() => repo.countStreamers())
    const fetchTotalLinks = async () => safe(() => repo.countLinks())
    const fetchTotalSlots = async () => safe(() => repo.countSlots())

    return { fetchTotalStreamers, fetchTotalLinks, fetchTotalSlots }
})
