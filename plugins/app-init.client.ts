import { defineNuxtPlugin } from '#app'
import { useProfileProgress } from '~/composables/useProfileProgress'

export default defineNuxtPlugin((nuxtApp) => {
    const profileProgress = useProfileProgress()
    const { fetchAccess } = useFeatures()
    const { uid } = useSupabase()

    nuxtApp.hook('app:mounted', async () => {
        if (!uid.value) return
        const streamerStore = useStreamerStore()
        const linkStore = useLinkStore()
        const scheduleStore = useScheduleStore()
        const scheduleSlotStore = useScheduleSlotStore()

        await Promise.all([
            streamerStore.fetchStreamer(),
            linkStore.fetchLinks(),
            scheduleStore.fetchSchedule(),
            fetchAccess(),
        ])

        const scheduleId = scheduleStore.schedule?.id
        if (scheduleId) await scheduleSlotStore.fetchSlots(scheduleId)

        await $fetch('/api/quests/check', { method: 'POST' })
        await profileProgress.init()
        await profileProgress.fetchBalance()
    })

    nuxtApp.provide('profileProgress', profileProgress)
})
