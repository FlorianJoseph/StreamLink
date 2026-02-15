import { PROFILE_QUESTS } from '~/config/profileQuests'
import { PROFILE_LEVELS } from '~/config/profileLevels'
import type { Quest } from '~/config/profileQuests'

export const useProfileProgress = () => {
    const toast = useToast()
    const streamerStore = useStreamerStore()
    const linkStore = useLinkStore()
    const scheduleSlotStore = useScheduleSlotStore()

    const { streamer } = storeToRefs(streamerStore)
    const { links } = storeToRefs(linkStore)
    const { slots } = storeToRefs(scheduleSlotStore)

    // Refs réactives pour stats et quêtes
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

    // Ensemble des quêtes déjà notifiées
    const notifiedQuests = ref<Set<string>>(new Set())

    // Fonction pour calculer les quêtes et stats
    const recalc = () => {
        const hasLinks = links.value.length > 0
        const hasSlots = slots.value.length > 0

        // Calcul des quêtes
        const newQuests = PROFILE_QUESTS.map((quest: Quest) => ({
            ...quest,
            completed: quest.condition({ streamer: streamer.value, hasLinks, hasSlots })
        }))

        // Notification pour nouvelles quêtes complétées
        newQuests.forEach((quest) => {
            if (quest.completed && !notifiedQuests.value.has(quest.id)) {
                notifyQuestCompleted(quest)
                notifiedQuests.value.add(quest.id)
            }
        })

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

    const notifyQuestCompleted = (quest: Quest) => {
        toast.add({
            severity: 'contrast',
            summary: 'Quête complétée !',
            detail: quest.label,
            life: 3000
        })
    }

    // Recalculer dès que streamer / links / slots changent
    watch([streamer, links, slots], recalc)

    const getQuests = () => quests.value
    const getStats = () => stats.value
    const getProfileMessage = () => {
        const s = stats.value
        if (s.completionPercentage === 100) return 'Ton profil est au top !'
        if (s.completionPercentage >= 75) return 'Ton profil est optimisé ! Plus que quelques détails...'
        if (s.profileVisible) return 'Ton profil est maintenant visible !'
        return 'Complète les quêtes essentielles pour apparaître sur la page Découverte'
    }

    return {
        getQuests,
        getStats,
        getProfileMessage
    }
}