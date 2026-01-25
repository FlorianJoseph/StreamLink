import { defineStore } from 'pinia'

export interface GameInfo {
    id: string | number
    name: string
    cover?: string
    color?: string
}

export interface ScheduleSlot {
    id?: string
    schedule_id: string
    title: string
    game: GameInfo
    day: string // 'Lundi' à 'Dimanche'
    start_at: string
    end_at: string
    created_at?: string
    updated_at?: string
}

export const useScheduleSlotStore = defineStore('scheduleSlot', () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const loading = ref(false)
    const slots = ref<ScheduleSlot[]>([])

    /** Récupère tous les créneaux d'un planning */
    async function fetchSlots(scheduleId: string) {
        loading.value = true
        try {
            const { data, error } = await supabase
                .from('ScheduleSlot')
                .select('*')
                .eq('schedule_id', scheduleId)
                .order('start_at', { ascending: true })

            if (error) {
                console.error('Erreur fetchSlots:', error)
                return { data: null, error }
            }

            slots.value = data || []
            return { data: slots.value, error: null }
        } catch (error) {
            console.error('Erreur fetchSlots:', error)
            return { data: null, error }
        } finally {
            loading.value = false
        }
    }

    /** Crée un créneau */
    async function createSlot(payload: Partial<ScheduleSlot>) {
        if (!payload.schedule_id) throw new Error('schedule_id requis')
        loading.value = true

        try {
            const { data, error } = await supabase
                .from('ScheduleSlot')
                .insert([payload])
                .select()
                .single()

            if (error) {
                console.error('Erreur createSlot:', error)
                return { data: null, error }
            }

            slots.value.push(data)
            return { data, error: null }
        } catch (error) {
            console.error('Erreur createSlot:', error)
            return { data: null, error }
        } finally {
            loading.value = false
        }
    }

    /** Met à jour un créneau */
    async function updateSlot(slotId: string, payload: Partial<ScheduleSlot>) {
        loading.value = true
        try {
            const { data, error } = await supabase
                .from('ScheduleSlot')
                .update(payload)
                .eq('id', slotId)
                .select()
                .single()

            if (error) {
                console.error('Erreur updateSlot:', error)
                return { data: null, error }
            }

            const index = slots.value.findIndex(s => s.id === slotId)
            if (index !== -1 && data) slots.value[index] = data

            return { data, error: null }
        } catch (error) {
            console.error('Erreur updateSlot:', error)
            return { data: null, error }
        } finally {
            loading.value = false
        }
    }

    /** Supprime un créneau */
    async function deleteSlot(slotId: string) {
        loading.value = true
        try {
            const { error } = await supabase
                .from('ScheduleSlot')
                .delete()
                .eq('id', slotId)

            if (error) {
                console.error('Erreur deleteSlot:', error)
                return { error }
            }

            slots.value = slots.value.filter(s => s.id !== slotId)
            return { error: null }
        } catch (error) {
            console.error('Erreur deleteSlot:', error)
            return { error }
        } finally {
            loading.value = false
        }
    }

    return { slots, loading, fetchSlots, createSlot, updateSlot, deleteSlot }
})
