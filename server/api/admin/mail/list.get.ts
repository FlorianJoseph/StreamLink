import { Resend } from 'resend'
import { checkAdmin } from '~/server/utils/checkAdmin'

const resend = new Resend(process.env.NUXT_RESEND_API_KEY)

export default defineEventHandler(async (event) => {
    await checkAdmin(event)

    const query = getQuery(event)
    const limit = query.limit ? Number(query.limit) : 15
    const after = query.after ? String(query.after) : undefined

    const { data, error } = await resend.emails.list({
        limit,
        after
    })

    if (error || !data) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur récupération emails'
        })
    }

    return {
        emails: data.data,
        nextCursor: data.has_more
            ? data.data[data.data.length - 1]?.id
            : null,
        hasMore: data.has_more
    }
})