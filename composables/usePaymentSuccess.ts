export const usePaymentSuccess = () => {
    const { fetchBalance } = useWallet()
    const { fetchSubscription, isSub } = useFeatures()
    const toast = useToast()

    const onMessage = async (e: MessageEvent) => {
        if (e.data.type !== 'payment_success') return
        const { coins, mode } = await $fetch('/api/stripe/session', {
            query: { session_id: e.data.session_id }
        })
        if (mode === 'subscription') {
            let attempts = 0
            while (attempts < 10) {
                await fetchSubscription()
                if (isSub.value) break
                await new Promise(resolve => setTimeout(resolve, 1000))
                attempts++
            }
        } else {
            await fetchBalance()
        }
        toast.add({
            severity: 'secondary',
            group: 'payment',
            summary: mode === 'subscription' ? 'Charmi+ activé !' : 'Charm ajoutés à ton solde',
            detail: mode === 'subscription' ? 'Toutes les fonctionnalités sont débloquées' : String(coins),
            life: 4000,
        })
    }

    if (import.meta.client) {
        window.addEventListener('message', onMessage)
    }
}