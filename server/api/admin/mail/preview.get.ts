import { checkAdmin } from '~/server/utils/checkAdmin'

import { getNotVisibleUsers } from './segments/notVisible'
import { getNotScheduleUsers } from './segments/notSchedule'
import { getUpdateUsers } from './segments/update'

export default defineEventHandler(async (event) => {
    const client = await checkAdmin(event)

    const segment = getQuery(event).segment

    if (!segment) {
        throw createError({ statusCode: 400, message: 'Segment requis' })
    }

    const segmentMap: any = {
        notVisible: { handler: getNotVisibleUsers, templateId: 'notVisible' },
        notSchedule: { handler: getNotScheduleUsers, templateId: 'notSchedule' },
        update: { handler: getUpdateUsers, templateId: 'update' }
    }

    const config = segmentMap[segment]
    if (!config) {
        throw createError({ statusCode: 400, message: 'Segment invalide' })
    }

    const users = await config.handler(client)

    return {
        segment,
        templateId: config.templateId,
        count: users.length,
        sample: users.slice(0, 5)
    }
})