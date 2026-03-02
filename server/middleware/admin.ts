import { checkAdmin } from '~/server/utils/checkAdmin'

export default defineEventHandler(async (event) => {

    const url = getRequestURL(event)

    // On protège uniquement la zone admin
    if (!url.pathname.startsWith('/_secret-admin')) {
        return
    }

    try {
        await checkAdmin(event)
    } catch (error: any) {

        if (error.statusCode === 401) {
            return sendRedirect(event, '/auth/login', 302)
        }

        if (error.statusCode === 403) {
            return sendRedirect(event, '/', 302)
        }

        return sendRedirect(event, '/', 302)
    }
})