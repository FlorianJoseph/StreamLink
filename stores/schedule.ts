import { defineStore } from 'pinia'

export interface Schedule {
    id?: string
    user_id: string
    title: string
    subtitle?: string
    style?: Record<string, any>
    created_at?: string
    updated_at?: string
}

export const useScheduleStore = defineStore('schedule', () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const loading = ref(false)
    const schedule = ref<Schedule | null>(null)

    // Récupère le planning de l'utilisateur
    async function fetchSchedule(): Promise<{ data: Schedule | null; error: any | null }> {
        if (!user.value) return { data: null, error: 'No user' }
        loading.value = true

        const { data, error } = await supabase
            .from('Schedule')
            .select('*')
            .eq('user_id', user.value.sub)
            .maybeSingle()

        loading.value = false

        if (error) {
            console.error('Erreur de récupération du planning:', error)
            return { data: null, error: error.message }
        }

        schedule.value = data ?? null
        return { data: schedule.value, error: null }
    }

    // Crée un planning si l'utilisateur n'en a pas
    async function createSchedule(payload: Partial<Schedule>): Promise<{ data: Schedule | null; error: any | null }> {
        if (!user.value) return { data: null, error: 'No user' }
        loading.value = true

        const { data, error } = await supabase
            .from('Schedule')
            .insert([{ user_id: user.value.sub, ...payload }])
            .select()
            .single()

        loading.value = false

        if (error) {
            console.error('Erreur de création du planning:', error)
            return { data: null, error: error.message }
        }

        schedule.value = data
        return { data: schedule.value, error: null }
    }

    // Met à jour le planning existant
    async function updateSchedule(payload: Partial<Schedule>): Promise<{ data: Schedule | null; error: any | null }> {
        if (!schedule.value) return { data: null, error: 'Pas de planning' }

        const { data, error } = await supabase
            .from('Schedule')
            .update(payload)
            .eq('id', schedule.value.id)
            .select()
            .single()


        if (error) {
            console.error('Erreur de mise à jour du planning:', error)
            return { data: null, error: error.message }
        }

        schedule.value = data
        return { data: schedule.value, error: null }
    }

    // Génère le sous-titre pour la semaine en cours
    function getCurrentWeekSubtitle(): string {
        const today = new Date()

        // Jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
        const day = today.getDay()

        // Calcul du lundi et vendredi de la semaine en cours
        const monday = new Date(today)
        monday.setDate(today.getDate() - ((day + 6) % 7)) // si aujourd'hui dimanche, lundi = -6

        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)

        // Format de date (ex: 23/01/2026)
        const options = { day: '2-digit', month: 'long' } as const
        const mondayStr = monday.toLocaleDateString('fr-FR', options)
        const sundayStr = sunday.toLocaleDateString('fr-FR', options)

        return `Du ${mondayStr} au ${sundayStr}`
    }

    // Récupère le planning ou en crée un nouveau s'il n'existe pas
    async function getOrCreateSchedule() {
        if (!user.value) return null

        loading.value = true
        const { data } = await fetchSchedule()
        if (data) {
            loading.value = false
            return data
        } else {
            const { data: newSchedule } = await createSchedule({
                title: 'Mon planning de stream',
                subtitle: getCurrentWeekSubtitle(),
                style: {}
            })
            loading.value = false
            return newSchedule
        }
    }

    return { loading, fetchSchedule, updateSchedule, createSchedule, getOrCreateSchedule, schedule }
})
