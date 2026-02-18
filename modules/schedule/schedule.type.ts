import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'

export type Schedule = Tables<'Schedule'>
export type ScheduleInsert = TablesInsert<'Schedule'>
export type ScheduleUpdate = TablesUpdate<'Schedule'>