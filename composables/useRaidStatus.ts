const raidStatus = ref({ remaining: 0, used: 0, total: 4 })

export function useRaidStatus() {
    const user = useSupabaseUser()

    async function fetchStatus() {
        if (!user.value) return
        try {
            const data = await $fetch<{ remaining: number; used: number; total: number }>('/api/raids/status')
            raidStatus.value = data
        } catch { }
    }

    return { raidStatus, fetchStatus }
}