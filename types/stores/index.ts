import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'

// ScheduleSlot
export type ScheduleSlot = Tables<'ScheduleSlot'>
export type ScheduleSlotInsert = TablesInsert<'ScheduleSlot'>
export type ScheduleSlotUpdate = TablesUpdate<'ScheduleSlot'>

// Schedule
export type Schedule = Tables<'Schedule'>
export type ScheduleInsert = TablesInsert<'Schedule'>
export type ScheduleUpdate = TablesUpdate<'Schedule'>
