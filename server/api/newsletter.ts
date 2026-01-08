import { serverSupabaseClient } from '#supabase/server'
import { newsletterTemplate } from '~/server/templates/newsletter'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { emails } = useResend();

  // Récupère les abonnés
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscriptions_with_email')
    .select('email')
    .eq('subscribed', true)
  console.log(subscribers);

  if (error) throw createError({ statusCode: 500, message: error.message })

  if (!subscribers || subscribers.length === 0) {
    return { sent: 0 }
  }

  // Sujet & contenu définis côté serveur
  const subject = '✨ Nouveau : personnalise ton StreamLink !'
  const content = ''

  // Envoi des emails

  const result = await emails.send({
    from: 'StreamLink <newsletter@mail.stream-link.fr>',
    // to: subscribers.map(s => s.email),
    to: ['flocamj@gmail.com'],
    subject,
    html: newsletterTemplate(content),
  })

  if (result.error) {
    console.error('Erreur Resend:', result.error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de l’envoi de la newsletter',
    })
  }

  return { sent: subscribers.length }
})

