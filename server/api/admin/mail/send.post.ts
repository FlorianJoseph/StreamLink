import { checkAdmin } from '~/server/utils/checkAdmin'
import { sendSegment } from '~/server/utils/sendSegment'

export default defineEventHandler(async (event) => {
    const client = await checkAdmin(event)

    const { segment } = await readBody(event)

    const result = await sendSegment(client, segment)

    return result
})