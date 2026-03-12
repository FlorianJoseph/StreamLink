import { Resend } from 'resend'
import { render } from '@react-email/render'
import { UpdateEmail } from '../api/admin/mail/templates/Update'
import { NotVisibleEmail } from '../api/admin/mail/templates/NotVisible'
import { NotScheduleEmail } from '../api/admin/mail/templates/NotSchedule'
import { getNotVisibleUsers } from '../api/admin/mail/segments/notVisible'
import { getNotScheduleUsers } from '../api/admin/mail/segments/notSchedule'
import { getUpdateUsers } from '../api/admin/mail/segments/update'

const resend = new Resend(process.env.NUXT_RESEND_API_KEY)

const subjects: Record<string, string> = {
    update: 'Quoi de neuf sur StreamLink ?',
    notVisible: 'Ton profil StreamLink est encore invisible',
    notSchedule: 'Ton planning est vide',
}

const segmentTemplates: Record<string, Function> = {
    update: ({ username }: any) => render(UpdateEmail({ username })),
    notVisible: ({ username }: any) => render(NotVisibleEmail({ username })),
    notSchedule: ({ username }: any) => render(NotScheduleEmail({ username })),
}

const segmentHandlers: Record<string, Function> = {
    update: getUpdateUsers,
    notVisible: getNotVisibleUsers,
    notSchedule: getNotScheduleUsers,
}

export async function sendSegment(client: any, segment: string) {
    const handler = segmentHandlers[segment]
    if (!handler) throw new Error(`Segment invalide : ${segment}`)

    const users = await handler(client)
    if (!users.length) return { sent: 0, errors: [] }

    const BATCH_SIZE = 100
    let totalSent = 0
    const batchErrors: any[] = []

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE)
        try {
            const emails = await Promise.all(
                batch.map(async (u: any) => ({
                    from: 'StreamLink <noreply@mail.stream-link.fr>',
                    to: u.email,
                    subject: subjects[segment],
                    html: await segmentTemplates[segment]({ username: u.username }),
                }))
            )
            await resend.batch.send(emails)
            totalSent += batch.length
        } catch (err) {
            batchErrors.push({ batchStart: i, error: err })
        }
    }

    await client.from('mail_logs').insert({
        segment,
        count: totalSent,
    })

    return { sent: totalSent, errors: batchErrors }
}