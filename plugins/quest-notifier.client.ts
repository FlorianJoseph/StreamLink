import { defineNuxtPlugin } from '#app'
import { useProfileProgress } from '~/composables/useProfileProgress'

export default defineNuxtPlugin((nuxtApp) => {
    // On récupère le composable pour le profil
    const profileProgress = useProfileProgress()

    // Le watch est déjà dans le composable pour notifier les quêtes
    // Il va déclencher les toasts dès que les refs changent
    // Pas besoin de rien d'autre ici
})
