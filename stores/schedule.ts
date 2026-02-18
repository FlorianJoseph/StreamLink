import { defineStore } from 'pinia'
import type { Schedule, ScheduleUpdate } from '~/modules/schedule/schedule.type'
import { useScheduleRepository } from '~/modules/schedule/schedule.repository'

export const useScheduleStore = defineStore('schedule', () => {
    const { safe, uid } = useSupabase()
    const repo = useScheduleRepository()
    const loading = ref(true)
    const schedule = shallowRef<Schedule | null>(null)

    // Récupère le planning de l'utilisateur
    async function fetchSchedule() {
        if (!uid.value) return { data: null, error: 'Aucun utilisateur connecté.' }

        const result = await safe(() => repo.findByUserId(uid.value))

        if (result.data) schedule.value = result.data
        return result
    }

    // Crée un planning si l'utilisateur n'en a pas
    async function createSchedule() {
        if (!uid.value) return { data: null, error: 'Aucun utilisateur connecté.' }

        const result = await safe(() => repo.create(
            {
                user_id: uid.value,
                title: 'Mon planning de stream',
                subtitle: getCurrentWeekSubtitle(),
                style: { bgColor: '18181B', textColor: 'FFFFFF' }
            }
        ))

        if (result.data) schedule.value = result.data
        return result
    }

    // Met à jour le planning existant
    async function updateSchedule(payload: ScheduleUpdate) {
        if (!schedule.value) return { data: null, error: 'Pas de planning à mettre à jour.' }

        const result = await safe(() => repo.update(schedule.value!.id, {
            ...payload,
            style: payload.style
                ? { ...schedule.value!.style as object, ...payload.style as object }
                : schedule.value!.style
        }))

        if (result.data) schedule.value = result.data
        return result
    }

    // Récupère le planning ou en crée un nouveau s'il n'existe pas
    async function getOrCreateSchedule() {
        if (!uid.value) return null
        loading.value = true

        try {
            const { data } = await fetchSchedule()
            if (data) return data

            const { data: newSchedule } = await createSchedule()
            return newSchedule
        }
        finally {
            loading.value = false
        }
    }

    return { loading, fetchSchedule, updateSchedule, createSchedule, getOrCreateSchedule, schedule }
})
