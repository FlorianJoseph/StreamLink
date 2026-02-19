import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'

export type ScheduleSlot = Tables<'ScheduleSlot'>
export type ScheduleSlotInsert = TablesInsert<'ScheduleSlot'>
export type ScheduleSlotUpdate = TablesUpdate<'ScheduleSlot'>