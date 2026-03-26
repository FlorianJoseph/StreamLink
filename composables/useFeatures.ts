const featureAccess = ref<{ feature_key: string, expires_at: string | null }[]>([])
const subscription = ref<{ status: string, current_period_end: string | null } | null>(null)

export const useFeatures = () => {
    const { fetchBalance } = useWallet()

    const fetchSubscription = async () => {
        try {
            subscription.value = await $fetch('/api/features/subscription')
        } catch {
            subscription.value = null
        }
    }

    const isSub = computed(() => {
        if (!subscription.value) return false
        if (subscription.value.status === 'active') return true
        if (subscription.value.status === 'canceled' && subscription.value.current_period_end) {
            return new Date(subscription.value.current_period_end) > new Date()
        }
        return false
    })

    const fetchAccess = async () => {
        try {
            featureAccess.value = await $fetch('/api/features/access')
        } catch (error) {
            console.error('Erreur chargement features', error)
        }
    }

    const hasFeature = (key: string) => {
        if (isSub.value) return true
        return featureAccess.value.some(f => f.feature_key === key)
    }

    const getExpiryLabel = (key: string) => {
        const date = featureAccess.value.find(f => f.feature_key === key)?.expires_at
        if (!date) return ''

        const diffMs = new Date(date).getTime() - Date.now()
        const diffHours = Math.ceil(diffMs / 3600000)
        const diffDays = Math.ceil(diffMs / 86400000)

        if (diffHours <= 24) return `Expire dans ${diffHours}h`
        if (diffDays <= 7) return `Expire dans ${diffDays} jours`

        return `Actif jusqu'au ${new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
    }

    const spend = async (featureKey: string, priceId: string) => {
        const { success, expiresAt } = await $fetch('/api/features/spend', {
            method: 'POST',
            body: { featureKey, priceId }
        })
        if (success) {
            await fetchAccess()
            await fetchBalance()
        }
        return { success, expiresAt }
    }

    return { featureAccess, fetchAccess, hasFeature, getExpiryLabel, spend, isSub, fetchSubscription }
}