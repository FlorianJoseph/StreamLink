import { until } from '@vueuse/core'
import { PROFILE_QUESTS } from '~/config/profileQuests'
import { PROFILE_LEVELS } from '~/config/profileLevels'
import type { Quest } from '~/config/profileQuests'

// Singleton — refs partagées entre toutes les instances
const quests = ref<Quest[]>([])
const stats = ref({
    completedRequired: 0,
    completedOptional: 0,
    completedTotal: 0,
    total: 0,
    completionPercentage: 0,
    profileVisible: false,
    level: PROFILE_LEVELS[0]
})

const completedQuestIds = ref<Set<string>>(new Set())
const dbQuests = ref<any[]>([])
const dbQuestsLoading = ref(false)
const isInitialized = ref(false)
const isReady = ref(false)
let watchHandle: (() => void) | null = null

export const useProfileProgress = () => {
    const toast = useToast()
    const streamerStore = useStreamerStore()
    const linkStore = useLinkStore()
    const { isLoaded: linksLoaded } = storeToRefs(linkStore)
    const scheduleSlotStore = useScheduleSlotStore()

    const { streamer } = storeToRefs(streamerStore)
    const { links } = storeToRefs(linkStore)
    const { slots } = storeToRefs(scheduleSlotStore)

    const { fetchBalance } = useWallet()


    const loadCompletions = async () => {
        if (!streamer.value?.id) {
            // Attendre que le streamer soit chargé
            await until(streamer).toMatch(s => !!s?.id)
        }
        const ids = await $fetch('/api/quests/completions')
        completedQuestIds.value = new Set(ids)
    }

    const loadDbQuests = async () => {
        if (dbQuests.value.length > 0) return // déjà chargé
        dbQuestsLoading.value = true
        dbQuests.value = await $fetch('/api/quests')
        dbQuestsLoading.value = false
    }

    // Fonction pour calculer les quêtes et stats
    const recalc = async () => {
        const hasLinks = links.value.length > 0
        const hasSlots = slots.value.length > 0
        const hasMultipleLinks = links.value.length >= 3
        await loadDbQuests()

        // Calcul des quêtes
        const newQuests = PROFILE_QUESTS.map((quest) => {
            const dbQuest = dbQuests.value.find(q => q.key === quest.id)
            return {
                ...quest,
                dbId: dbQuest?.id,
                reward: dbQuest?.reward ?? 0,
                completed: quest.condition({ streamer: streamer.value, hasLinks, hasSlots, hasMultipleLinks })
            }
        })

        // Notification uniquement après l'initialisation
        if (isInitialized.value) {
            newQuests.forEach((quest) => {
                if (quest.completed && !completedQuestIds.value.has(quest.dbId)) {
                    notifyQuestCompleted(quest)
                    completedQuestIds.value.add(quest.dbId)
                }
            })
        }

        quests.value = newQuests

        // Séparer essentielles et optionnelles
        const required = quests.value.filter(q => q.type === 'required')
        const optional = quests.value.filter(q => q.type === 'optional')

        // Calcul stats
        const completedRequired = required.filter(q => q.completed).length
        const completedOptional = optional.filter(q => q.completed).length
        const total = quests.value.length
        const completedTotal = completedRequired + completedOptional
        const completionPercentage = total === 0 ? 0 : Math.round((completedTotal / total) * 100)
        const profileVisible = completedRequired === required.length
        const level = PROFILE_LEVELS.slice().reverse().find(l => completionPercentage >= l.min) || PROFILE_LEVELS[0]

        stats.value = {
            completedRequired,
            completedOptional,
            completedTotal,
            total,
            completionPercentage,
            profileVisible,
            level
        }
    }

    const notifyQuestCompleted = async (quest: Quest) => {
        // Toast immédiat, peu importe ce qui se passe après
        toast.add({
            severity: 'secondary',
            summary: quest.label,
            detail: quest.reward,
            group: 'quest',
            life: 4000
        })

        try {
            await $fetch('/api/quests/check', { method: 'POST' })
            await loadCompletions()
            await fetchBalance()
        } catch (error) {
            console.error('Erreur crédit quête', quest.id, error)
        }
    }

    // calculer dès que streamer / links / slots changent
    const startWatch = () => {
        watchHandle = watch(
            [streamer, links, slots],
            () => {
                if (!isInitialized.value) return
                recalc()
            },
            { deep: true, immediate: false }
        )
    }

    const stopWatch = () => {
        watchHandle?.()
        watchHandle = null
    }

    const getQuests = () => quests.value
    const getStats = () => stats.value
    const getProfileMessage = () => {
        const s = stats.value
        if (s.completionPercentage === 100) return 'Ton profil est parfait !'
        if (s.completionPercentage >= 75) return 'Ton profil est optimisé !'
        if (s.profileVisible) return 'Ton profil est maintenant visible !'
        return 'Complète les quêtes essentielles pour apparaître sur la page Découverte'
    }

    const init = async () => {
        stopWatch()
        // Attendre que le streamer ET les links soient prêts
        await until(streamer).toMatch(s => !!s?.id)
        await new Promise<void>((resolve) => {
            if (linksLoaded.value) return resolve()
            const stop = watch(linksLoaded, (val) => {
                if (val) {
                    stop()
                    resolve()
                }
            })
            setTimeout(() => { stop(); resolve() }, 3000)
        })
        await loadCompletions()
        await recalc()
        isInitialized.value = true
        isReady.value = true
        startWatch()
    }

    return {
        getQuests,
        getStats,
        getProfileMessage,
        isReady,
        init,
        fetchBalance
    }
}