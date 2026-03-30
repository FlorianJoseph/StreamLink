import { fetchLiveStatuses } from '~/server/utils/twitchLive'

// Twitch user_login : lettres, chiffres, underscores uniquement, 4-25 caractères
const TWITCH_LOGIN_REGEX = /^[a-zA-Z0-9_]{1,25}$/

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const usernames: string[] = body?.usernames ?? []

    if (!Array.isArray(usernames) || usernames.length === 0) {
        throw createError({ statusCode: 400, message: 'usernames requis' })
    }

    if (usernames.length > 500) {
        throw createError({ statusCode: 400, message: 'Maximum 500 usernames par appel' })
    }

    // On ne transmet à Twitch que les usernames valides
    const valid = usernames.filter(u => typeof u === 'string' && TWITCH_LOGIN_REGEX.test(u.trim()))

    return fetchLiveStatuses(valid)
})