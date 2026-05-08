const balance = ref<number>(0)
const dailyClaimed = ref<boolean>(false)
const dailyLoading = ref<boolean>(false)
let fetchPromise: Promise<void> | null = null

export const useWallet = () => {
    const streamerStore = useStreamerStore()
    const { streamer } = storeToRefs(streamerStore)

    const fetchBalance = async () => {
        if (!import.meta.client) return
        if (!streamer.value?.id) return
        try {
            if (!fetchPromise) {
                fetchPromise = $fetch('/api/wallet/balance')
                    .then(({ balance: b }) => {
                        balance.value = b
                    }).finally(() => {
                        fetchPromise = null
                    })
            }
            await fetchPromise
        } catch (error) {
            console.error('Erreur chargement solde', error)
        }
    }

    const fetchDailyClaimed = async () => {
        if (!import.meta.client) return
        const { claimed } = await $fetch('/api/quests/daily')
        dailyClaimed.value = claimed
    }

    const claimDaily = async (toast: ReturnType<typeof useToast>) => {
        if (dailyLoading.value || dailyClaimed.value) return
        dailyLoading.value = true
        try {
            const { credited } = await $fetch('/api/quests/daily', { method: 'POST' })
            if (credited) {
                dailyClaimed.value = true
                await fetchBalance()
                toast?.add({
                    severity: 'secondary',
                    group: 'quest',
                    summary: 'Connexion quotidienne',
                    detail: '3',
                    life: 4000,
                })
            } else {
                dailyClaimed.value = true
            }
        } finally {
            dailyLoading.value = false
        }
    }

    return { balance, fetchBalance, dailyClaimed, dailyLoading, fetchDailyClaimed, claimDaily }
}