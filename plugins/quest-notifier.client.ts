import { defineNuxtPlugin } from '#app'
import { useProfileProgress } from '~/composables/useProfileProgress'

export default defineNuxtPlugin((nuxtApp) => {
    // Garder une référence au composable pour qu'il reste actif
    const profileProgress = useProfileProgress()

    // Le rendre disponible globalement si besoin
    nuxtApp.provide('profileProgress', profileProgress)
})
