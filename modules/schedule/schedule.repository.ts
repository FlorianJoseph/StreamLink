import type { ScheduleUpdate, ScheduleInsert } from '~/modules/schedule/schedule.type'

export const useScheduleRepository = () => {
    const { supabase } = useSupabase()

    const findByUserId = async (userId: string) => {
        const { data, error } = await supabase
            .from('Schedule')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle()

        if (error) throw error
        return data
    }

    const create = async (payload: ScheduleInsert) => {
        const { data, error } = await supabase
            .from('Schedule')
            .insert([payload])
            .select()
            .single()

        if (error) throw error
        return data
    }

    const update = async (scheduleId: string, payload: ScheduleUpdate) => {
        const { data, error } = await supabase
            .from('Schedule')
            .update(payload)
            .eq('id', scheduleId)
            .select()
            .single()

        if (error) throw error
        return data
    }

    return { findByUserId, create, update }
}
