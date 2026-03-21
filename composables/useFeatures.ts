const featureAccess = ref<{ feature_key: string, expires_at: string | null }[]>([])

export const useFeatures = () => {
    const { fetchBalance } = useWallet()
    const fetchAccess = async () => {
        try {
            featureAccess.value = await $fetch('/api/features/access')
        } catch (error) {
            console.error('Erreur chargement features', error)
        }
    }

    const hasFeature = (key: string) => {
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

        return `Jusqu'au ${new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
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

    return { featureAccess, fetchAccess, hasFeature, getExpiryLabel, spend }
}