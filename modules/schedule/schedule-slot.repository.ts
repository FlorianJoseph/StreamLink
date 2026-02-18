import type { ScheduleSlotInsert, ScheduleSlotUpdate } from '~/modules/schedule/schedule-slot.type'

export const useScheduleSlotRepository = () => {
    const { supabase } = useSupabase()

    const findByScheduleId = async (scheduleId: string) => {
        const { data, error } = await supabase
            .from('ScheduleSlot')
            .select('*')
            .eq('schedule_id', scheduleId)
            .order('start_at', { ascending: true })

        if (error) throw error
        return data
    }

    const create = async (payload: ScheduleSlotInsert) => {
        if (!payload.schedule_id) throw new Error('schedule_id requis')
        const { data, error } = await supabase
            .from('ScheduleSlot')
            .insert([payload])
            .select()
            .single()

        if (error) throw error
        return data
    }

    const update = async (slotId: string, payload: ScheduleSlotUpdate) => {
        const { data, error } = await supabase
            .from('ScheduleSlot')
            .update(payload)
            .eq('id', slotId)
            .select()
            .single()

        if (error) throw error
        return data
    }

    const deleteSlot = async (slotId: string) => {
        const { error } = await supabase
            .from('ScheduleSlot')
            .delete()
            .eq('id', slotId)

        if (error) throw error
        return null
    }

    return { findByScheduleId, create, update, deleteSlot }
}
