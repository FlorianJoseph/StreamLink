import { checkAdmin } from '~/server/utils/checkAdmin'
import { getNotVisibleUsers } from './segments/notVisible'
import { getNotScheduleUsers } from './segments/notSchedule'
import { getUpdateUsers } from './segments/update'

export default defineEventHandler(async (event) => {
    const client = await checkAdmin(event)

    const [notVisible, notSchedule, update] = await Promise.all([
        getNotVisibleUsers(client),
        getNotScheduleUsers(client),
        getUpdateUsers(client),
    ])

    return {
        notVisible: notVisible.length,
        notSchedule: notSchedule.length,
        update: update.length,
    }
})