const balance = ref<number>(0)

export const useWallet = () => {
    const streamerStore = useStreamerStore()
    const { streamer } = storeToRefs(streamerStore)

    const fetchBalance = async () => {
        if (!streamer.value?.id) return

        try {
            const { balance: b } = await $fetch('/api/wallet/balance')
            balance.value = b
        } catch (error) {
            console.error('Erreur chargement solde', error)
        }
    }

    watch(() => streamer.value?.id, (id) => {
        if (id) fetchBalance()
    }, { immediate: true })

    return { balance, fetchBalance }
}