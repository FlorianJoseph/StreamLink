import { serverSupabaseClient } from '#supabase/server'
import { Resend } from 'resend';

const resend = new Resend(process.env.NUXT_RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  // Récupère les abonnés
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscriptions')
    .select('email, username')
    .eq('subscribed', true)
  console.log(subscribers);

  if (error) throw createError({ statusCode: 500, message: error.message });
  if (!subscribers || subscribers.length === 0) return { sent: 0 };

  // Envoi des emails
  const result = await resend.batch.send(
    subscribers.map(s => ({
      from: 'StreamLink <newsletter@mail.stream-link.fr>',
      to: s.email,
      // to: ['flocamj@gmail.com'],
      subject: '',
      template: {
        id: 'update',
        variables: {
          username: s.username,
        },
      },
    }))
  );

  if (result.error) {
    throw createError({ statusCode: 500, message: 'Erreur lors de l\'envoi' });
  }

  return { sent: subscribers.length }
})

