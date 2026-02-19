import { defineStore } from 'pinia'
import type { ScheduleSlot, ScheduleSlotInsert, ScheduleSlotUpdate } from '~/modules/schedule/schedule-slot.type'
import { useScheduleSlotRepository } from '~/modules/schedule/schedule-slot.repository'

export const useScheduleSlotStore = defineStore('scheduleSlot', () => {
    const { safe } = useSupabase()
    const repo = useScheduleSlotRepository()
    const slots = shallowRef<ScheduleSlot[]>([])

    // Récupère tous les créneaux d'un planning 
    async function fetchSlots(scheduleId: ScheduleSlot['schedule_id']) {

        const result = await safe(() => repo.findByScheduleId(scheduleId))

        if (result.data) slots.value = result.data
        return result
    }

    // Crée un créneau
    async function createSlot(payload: ScheduleSlotInsert) {
        if (!payload.schedule_id) throw new Error('schedule_id requis')

        const result = await safe(() => repo.create(payload))

        if (result.data) slots.value.push(result.data)
        return result
    }

    // Met à jour un créneau
    async function updateSlot(slotId: string, payload: ScheduleSlotUpdate) {

        const result = await safe(() => repo.update(slotId, payload))

        if (result.data) {
            const index = slots.value.findIndex(s => s.id === slotId)
            if (index !== -1) slots.value[index] = result.data
        }
        return result
    }

    // Supprime un créneau
    async function deleteSlot(slotId: string) {

        const result = await safe(() => repo.remove(slotId))

        return result
    }

    return { slots, fetchSlots, createSlot, updateSlot, deleteSlot }
})
