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

    // Flag pour savoir si c'est initialisé
    const isInitialized = ref(false)

    // Initialiser depuis localStorage uniquement côté client
    if (import.meta.client) {
        const stored = localStorage.getItem('notifiedQuests')
        if (stored) {
            try {
                notifiedQuests.value = new Set(JSON.parse(stored))
            } catch (e) {
                console.error('Erreur lors du chargement des quêtes notifiées', e)
            }
        }
    }

    // Fonction pour sauvegarder les quêtes notifiées
    const saveNotifiedQuests = () => {
        if (import.meta.client) {
            localStorage.setItem(
                'notifiedQuests',
                JSON.stringify(Array.from(notifiedQuests.value))
            )
        }
    }

    // Fonction pour calculer les quêtes et stats
    const recalc = () => {
        const hasLinks = links.value.length > 0
        const hasSlots = slots.value.length > 0 
        const hasMultipleLinks = links.value.length >= 3

        // Calcul des quêtes
        const newQuests = PROFILE_QUESTS.map((quest: Quest) => ({
            ...quest,
            completed: quest.condition({ streamer: streamer.value, hasLinks, hasSlots, hasMultipleLinks })
        }))

        // Notification uniquement après l'initialisation
        if (isInitialized.value) {
            newQuests.forEach((quest) => {
                if (quest.completed && !notifiedQuests.value.has(quest.id)) {
                    notifyQuestCompleted(quest)
                    notifiedQuests.value.add(quest.id)
                    saveNotifiedQuests()
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

    // Marquer comme initialisé après le premier calcul
    if (!isInitialized.value) {
        isInitialized.value = true
    }

    const notifyQuestCompleted = (quest: Quest) => {
        toast.add({
            severity: 'success',
            summary: 'Quête complétée !',
            detail: quest.label,
            life: 6500
        })
    }

    // Calcul initial
    recalc()

    // calculer dès que streamer / links / slots changent
    watch([streamer, links, slots], () => {
        recalc()
    }, { deep: true })

    const getQuests = () => quests.value
    const getStats = () => stats.value
    const getProfileMessage = () => {
        const s = stats.value
        if (s.completionPercentage === 100) return 'Ton profil est absolument parfait !'
        if (s.completionPercentage >= 75) return 'Ton profil est optimisé ! Plus que quelques détails...'
        if (s.profileVisible) return 'Ton profil est maintenant visible !'
        return 'Complète les quêtes essentielles pour apparaître sur la page Découverte'
    }

    // Fonction utile pour debug/reset
    const resetNotifications = () => {
        notifiedQuests.value.clear()
        saveNotifiedQuests()
    }

    return {
        getQuests,
        getStats,
        getProfileMessage,
        resetNotifications
    }
}