import { Resend } from 'resend'
import { checkAdmin } from '~/server/utils/checkAdmin'

import { getNotVisibleUsers } from './segments/notVisible'
import { getNotScheduleUsers } from './segments/notSchedule'
import { getUpdateUsers } from './segments/update'
import { render } from '@react-email/render'
import { UpdateEmail } from '../mail/templates/Update'
import { NotVisibleEmail } from '../mail/templates/NotVisible'
import { NotScheduleEmail } from '../mail/templates/NotSchedule'

const resend = new Resend(process.env.NUXT_RESEND_API_KEY)

export default defineEventHandler(async (event) => {
    const client = await checkAdmin(event)

    const { segment } = await readBody(event)

    const segmentsConfig: Record<string, { handler: Function }> = {
        update: {
            handler: getUpdateUsers,
        },
        notVisible: {
            handler: getNotVisibleUsers,
        },
        notSchedule: {
            handler: getNotScheduleUsers,
        }
    }

    const subjects: Record<string, string> = {
        update: 'Quoi de neuf sur StreamLink ?',
        notVisible: 'Ton profil est invisible sur StreamLink',
        notSchedule: 'Ton planning StreamLink est vide',
    }

    const segmentTemplates: Record<string, Function> = {
        update: ({ username }: any) => render(UpdateEmail({ username })),
        notVisible: ({ username }: any) => render(NotVisibleEmail({ username })),
        notSchedule: ({ username }: any) => render(NotScheduleEmail({ username })),
    }

    const config = segmentsConfig[segment]
    if (!config) { throw createError({ statusCode: 400, message: 'Segment invalide' }) }

    const users = await config.handler(client)
    if (!users.length) return { sent: 0 }

    const BATCH_SIZE = 100;
    let totalSent = 0;
    let batchErrors: any[] = [];

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        try {
            // Générer le HTML de tous les utilisateurs du batch
            const emails = await Promise.all(
                batch.map(async (u: any) => ({
                    from: 'StreamLink <noreply@mail.stream-link.fr>',
                    to: u.email,
                    subject: subjects[segment],
                    html: await segmentTemplates[segment]({ username: u.username }),
                }))
            )
            // Envoyer le batch d'emails
            const result = await resend.batch.send(emails)
            console.log(`Batch ${i / BATCH_SIZE + 1} : ${batch.length} emails envoyés, exemple : ${batch[0].email}`);
            totalSent += batch.length;
        } catch (err) {
            console.error(`Erreur batch ${i / BATCH_SIZE + 1} : ${err.message || err}`);
            batchErrors.push({ batchStart: i, error: err });
        }
    }

    console.log(`Total envoyé : ${totalSent} emails`);

    return { segment, sent: totalSent, errors: batchErrors }
})