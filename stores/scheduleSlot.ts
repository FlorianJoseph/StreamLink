import { defineStore } from 'pinia'
import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'

type ScheduleSlot = Tables<'ScheduleSlot'>
type ScheduleSlotInsert = TablesInsert<'ScheduleSlot'>
type ScheduleSlotUpdate = TablesUpdate<'ScheduleSlot'>
type Result<T> = { data: T | null; error: string | null }

export const useScheduleSlotStore = defineStore('scheduleSlot', () => {
    const supabase = useSupabaseClient()
    const loading = ref(false)
    const slots = shallowRef<ScheduleSlot[]>([])

    // Helper pour exécuter une action Supabase avec gestion d'erreur uniforme 
    async function safe<T>(fn: () => Promise<{ data: T | null; error: any }>): Promise<Result<T>> {
        try {
            const { data, error } = await fn()
            if (error) throw error
            return { data, error: null }
        } catch (err: any) {
            console.error(err)
            return { data: null, error: err.message ?? String(err) }
        }
    }

    // Récupère tous les créneaux d'un planning 
    async function fetchSlots(scheduleId: ScheduleSlot['schedule_id']): Promise<Result<ScheduleSlot[]>> {
        loading.value = true

        const result = await safe(async () => {
            const { data, error } = await supabase
                .from('ScheduleSlot')
                .select('*')
                .eq('schedule_id', scheduleId)
                .order('start_at', { ascending: true })
            return { data: data || [], error }
        })

        if (result.data) slots.value = result.data
        loading.value = false

        return result
    }

    // Crée un créneau
    async function createSlot(payload: ScheduleSlotInsert): Promise<Result<ScheduleSlot>> {
        if (!payload.schedule_id) throw new Error('schedule_id requis')
        loading.value = true

        const result = await safe(async () => {
            const { data, error } = await supabase
                .from('ScheduleSlot')
                .insert([payload])
                .select()
                .single()
            return { data, error }
        })

        if (result.data) slots.value.push(result.data)
        loading.value = false

        return result
    }

    // Met à jour un créneau
    async function updateSlot(slotId: string, payload: ScheduleSlotUpdate): Promise<Result<ScheduleSlot>> {
        loading.value = true

        const result = await safe(async () => {
            const { data, error } = await supabase
                .from('ScheduleSlot')
                .update(payload)
                .eq('id', slotId)
                .select()
                .single()
            return { data, error }
        })

        if (result.data) {
            const index = slots.value.findIndex(s => s.id === slotId)
            if (index !== -1) slots.value[index] = result.data
        }
        loading.value = false
        return result
    }

    // Supprime un créneau
    async function deleteSlot(slotId: string): Promise<Result<null>> {
        loading.value = true
        const result = await safe(async () => {
            const { error } = await supabase
                .from('ScheduleSlot')
                .delete()
                .eq('id', slotId)
            if (error) throw error
            slots.value = slots.value.filter(s => s.id !== slotId)
            return { data: null, error: null }
        })
        loading.value = false
        return result
    }

    return { slots, loading, fetchSlots, createSlot, updateSlot, deleteSlot }
})
