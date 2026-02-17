import type { TablesInsert, TablesUpdate } from '~/types/database.types'

type ScheduleInsert = TablesInsert<'Schedule'>
type ScheduleInsertPayload = Omit<ScheduleInsert, 'user_id'>
type ScheduleUpdate = TablesUpdate<'Schedule'>

export const useScheduleRepository = () => {
    const { supabase } = useSupabase()

    const findByUserId = async (userId: string) => {
        const { data, error } = await supabase
            .from('Schedule')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle()
        return { data, error }
    }

    const create = async (userId: string, payload: ScheduleInsertPayload) => {
        const { data, error } = await supabase
            .from('Schedule')
            .insert([{ user_id: userId, ...payload }])
            .select()
            .single()
        return { data, error }
    }

    const update = async (scheduleId: string, payload: ScheduleUpdate) => {
        const { data, error } = await supabase
            .from('Schedule')
            .update(payload)
            .eq('id', scheduleId)
            .select()
            .single()
        return { data, error }
    }

    return { findByUserId, create, update }
}
