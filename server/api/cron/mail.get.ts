import { serverSupabaseServiceRole } from '#supabase/server'
import { sendSegment } from '~/server/utils/sendSegment'

export default defineEventHandler(async (event) => {
    // Auth
    const auth = getHeader(event, 'authorization')
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const today = new Date()
    if (today.getDay() !== 2) return { skipped: true } // sécurité, mardi uniquement

    // Cycle A/B/C/D
    const d = new Date(today)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
    const week1 = new Date(d.getFullYear(), 0, 4)
    const isoWeek = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
    const cycleIndex = ((isoWeek - 1) % 4) + 1

    const scheduleMatrix: Record<number, string | null> = {
        1: 'notVisible',
        2: 'notSchedule',
        3: 'notVisible',
        4: 'notSchedule',
    }

    const segment = scheduleMatrix[cycleIndex]
    if (!segment) return { skipped: true }

    const client = serverSupabaseServiceRole(event)

    // Vérifie si déjà envoyé aujourd'hui
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    const { data: existing } = await client
        .from('mail_logs')
        .select('id')
        .eq('segment', segment)
        .gte('sent_at', startOfDay.toISOString())
        .lte('sent_at', endOfDay.toISOString())
        .maybeSingle()

    if (existing) return { skipped: true, reason: 'already sent today' }

    const result = await sendSegment(client, segment)

    return { ...result, segment }
})