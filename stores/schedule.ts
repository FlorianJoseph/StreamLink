import { defineStore } from 'pinia'
import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'

type Schedule = Tables<'Schedule'>
type ScheduleInsert = TablesInsert<'Schedule'>
type ScheduleInsertPayload = Omit<ScheduleInsert, 'user_id'>
type ScheduleUpdate = TablesUpdate<'Schedule'>
type Result<T> = { data: T | null; error: string | null }

export const useScheduleStore = defineStore('schedule', () => {
    const supabase = useSupabaseClient()

    const user = useSupabaseUser()
    const uid = computed(() => user.value?.sub ?? user.value?.id ?? null)
    const loading = ref(true)
    const schedule = shallowRef<Schedule | null>(null)

    // Récupère le planning de l'utilisateur
    async function fetchSchedule(): Promise<Result<Schedule>> {
        if (!uid.value) return { data: null, error: 'Aucun utilisateur connecté.' }

        const { data, error } = await supabase
            .from('Schedule')
            .select('*')
            .eq('user_id', uid.value)
            .maybeSingle()

        if (error) {
            console.error('Erreur de récupération du planning:', error)
            return { data: null, error: error.message ?? String(error) }
        }

        schedule.value = data ?? null
        return { data: schedule.value, error: null }
    }

    // Crée un planning si l'utilisateur n'en a pas
    async function createSchedule(payload: ScheduleInsertPayload): Promise<Result<Schedule>> {
        if (!uid.value) return { data: null, error: 'Aucun utilisateur connecté.' }

        const { data, error } = await supabase
            .from('Schedule')
            .insert([{ user_id: uid.value, ...payload }])
            .select()
            .single()

        if (error) {
            console.error('Erreur de création du planning:', error)
            return { data: null, error: error.message ?? String(error) }
        }

        schedule.value = data
        return { data: schedule.value, error: null }
    }

    // Met à jour le planning existant
    async function updateSchedule(payload: ScheduleUpdate): Promise<Result<Schedule>> {
        if (!schedule.value) return { data: null, error: 'Pas de planning à mettre à jour.' }

        const { data, error } = await supabase
            .from('Schedule')
            .update(payload)
            .eq('id', schedule.value.id)
            .select()
            .single()

        if (error) {
            console.error('Erreur de mise à jour du planning:', error)
            return { data: null, error: error.message ?? String(error) }
        }

        schedule.value = data
        return { data: schedule.value, error: null }
    }

    // Génère le sous-titre pour la semaine en cours
    function getCurrentWeekSubtitle() {
        const today = new Date()

        // Jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
        const day = today.getDay()

        // Calcul du lundi et dimanche de la semaine en cours
        const monday = new Date(today)
        monday.setDate(today.getDate() - ((day + 6) % 7))

        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)

        // Format de date (ex: 23/01/2026)
        const options = { day: '2-digit', month: 'long' } as const
        const mondayStr = monday.toLocaleDateString('fr-FR', options)
        const sundayStr = sunday.toLocaleDateString('fr-FR', options)

        return `Du ${mondayStr} au ${sundayStr}`
    }

    // Récupère le planning ou en crée un nouveau s'il n'existe pas
    async function getOrCreateSchedule(): Promise<Schedule | null> {
        if (!uid.value) return null
        loading.value = true
        try {
            const { data } = await fetchSchedule()
            if (data) return data

            const { data: newSchedule } = await createSchedule({
                title: 'Mon planning de stream',
                subtitle: getCurrentWeekSubtitle(),
                style: { bgColor: '18181B', textColor: 'FFFFFF' }
            })
            return newSchedule
        }
        finally {
            loading.value = false
        }
    }

    return { loading, fetchSchedule, updateSchedule, createSchedule, getOrCreateSchedule, schedule }
})
