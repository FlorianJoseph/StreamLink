import type { ScheduleSlot, ScheduleSlotInsert, ScheduleSlotUpdate } from '~/modules/schedule/schedule-slot.type'

export const scheduleSlotRepository = {

    async findByScheduleId(
        supabase: any,
        scheduleId: ScheduleSlot['schedule_id']
    ) {
        return await supabase
            .from('ScheduleSlot')
            .select('*')
            .eq('schedule_id', scheduleId)
            .order('start_at', { ascending: true })
    },

    async create(
        supabase: any,
        payload: ScheduleSlotInsert
    ) {
        return await supabase
            .from('ScheduleSlot')
            .insert([payload])
            .select()
            .single()
    },

    async update(
        supabase: any,
        slotId: string,
        payload: ScheduleSlotUpdate
    ) {
        return await supabase
            .from('ScheduleSlot')
            .update(payload)
            .eq('id', slotId)
            .select()
            .single()
    },

    async delete(
        supabase: any,
        slotId: string
    ) {
        return await supabase
            .from('ScheduleSlot')
            .delete()
            .eq('id', slotId)
    },

    async countAll(supabase: any) {
        return await supabase
            .from('ScheduleSlot')
            .select('*', { count: 'exact', head: true })
    }
}
