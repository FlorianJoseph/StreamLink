const balance = ref<number>(0)
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

    return { balance, fetchBalance }
}