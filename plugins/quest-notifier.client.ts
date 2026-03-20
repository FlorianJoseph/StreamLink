import { defineNuxtPlugin } from '#app'
import { useProfileProgress } from '~/composables/useProfileProgress'

export default defineNuxtPlugin((nuxtApp) => {
    // const { uid } = useSupabase()
    // Garder une référence au composable pour qu'il reste actif
    const profileProgress = useProfileProgress()

    nuxtApp.hook('app:mounted', async () => {
        // if (uid.value) {
        //     await $fetch('/api/quests/check', { method: 'POST' })
        // }
        await profileProgress.init()
    })

    // Le rendre disponible globalement si besoin
    nuxtApp.provide('profileProgress', profileProgress)
})
