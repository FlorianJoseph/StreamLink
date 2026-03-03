import { Resend } from 'resend'
import { checkAdmin } from '~/server/utils/checkAdmin'

import { getNotVisibleUsers } from './segments/notVisible'
import { getNotScheduleUsers } from './segments/notSchedule'
import { getUpdateUsers } from './segments/update'

const resend = new Resend(process.env.NUXT_RESEND_API_KEY)

export default defineEventHandler(async (event) => {
    const client = await checkAdmin(event)

    const { segment } = await readBody(event)

    const segmentsConfig: Record<string, { handler: Function; templateId: string }> = {
        update: {
            handler: getUpdateUsers,
            templateId: 'update'
        },
        notVisible: {
            handler: getNotVisibleUsers,
            templateId: 'notVisible'
        },
        notSchedule: {
            handler: getNotScheduleUsers,
            templateId: 'notSchedule'
        }
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
            const result = await resend.batch.send(
                batch.map((u: any) => ({
                    from: 'StreamLink <noreply@mail.stream-link.fr>',
                    to: u.email,
                    subject: '',
                    template: {
                        id: config.templateId,
                        variables: { username: u.username }
                    }
                }))
            )
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