import { render } from '@react-email/render'
import { Welcome } from '../mail/templates/Welcome'
import { Resend } from 'resend'

const resend = new Resend(process.env.NUXT_RESEND_API_KEY)

export default defineEventHandler(async (event) => {
    const { email, username } = await readBody(event)

    if (!email || !username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing fields',
        })
    }

    const html = await render(Welcome({ username }))

    try {
        await resend.emails.send({
            from: 'StreamLink <noreply@mail.stream-link.fr>',
            to: email,
            subject: 'Bienvenue sur StreamLink',
            html,
        })

        return { success: true }
    } catch (error) {
        console.error('Email error:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Email sending failed',
        })
    }
})
