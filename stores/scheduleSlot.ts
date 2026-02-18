import { defineStore } from 'pinia'
import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'

type ScheduleSlot = Tables<'ScheduleSlot'>
type ScheduleSlotInsert = TablesInsert<'ScheduleSlot'>
type ScheduleSlotUpdate = TablesUpdate<'ScheduleSlot'>

export const useScheduleSlotStore = defineStore('scheduleSlot', () => {
    const { supabase, safe } = useSupabase()
    const loading = ref(false)
    const slots = shallowRef<ScheduleSlot[]>([])

    // Récupère tous les créneaux d'un planning 
    async function fetchSlots(scheduleId: ScheduleSlot['schedule_id']): Promise<Result<ScheduleSlot[]>> {
        loading.value = true

        const result = await safe(async () => {
            const { data, error } = await supabase
                .from('ScheduleSlot')
                .select('*')
                .eq('schedule_id', scheduleId)
                .order('start_at', { ascending: true })
            return data || []
        })

        if (result.data) slots.value = result.data
        loading.value = false

        return result
    }

    // Crée un créneau
    async function createSlot(payload: ScheduleSlotInsert): Promise<Result<ScheduleSlot>> {
        if (!payload.schedule_id) throw new Error('schedule_id requis')

        const result = await safe(async () => {
            const { data, error } = await supabase
                .from('ScheduleSlot')
                .insert([payload])
                .select()
                .single()
            return { data, error }
        })

        if (result.data) slots.value.push(result.data)
        return result
    }

    // Met à jour un créneau
    async function updateSlot(slotId: string, payload: ScheduleSlotUpdate): Promise<Result<ScheduleSlot>> {

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
        return result
    }

    // Supprime un créneau
    async function deleteSlot(slotId: string): Promise<Result<null>> {

        const result = await safe(async () => {
            const { error } = await supabase
                .from('ScheduleSlot')
                .delete()
                .eq('id', slotId)
            if (error) throw error
            slots.value = slots.value.filter(s => s.id !== slotId)
            return { data: null, error: null }
        })

        return result
    }

    // Récupère le nombre total de créneaux de la table (pour stats)
    const fetchTotalSlots = async (): Promise<Result<number>> => {
        const result = await safe(async () => {
            const { count, error } = await supabase
                .from('ScheduleSlot')
                .select('*', { count: 'exact', head: true })
            return { data: count ?? 0, error }
        })
        return result
    }

    return { slots, loading, fetchSlots, createSlot, updateSlot, deleteSlot, fetchTotalSlots }
})
