import { defineStore } from 'pinia'

export const useNewsletterStore = defineStore('newsletter', () => {
    const user = useSupabaseUser()
    const { isSubscribed, subscribe, unsubscribe } = useNewsletter()

    const subscribed = ref<boolean | null>(null)
    const loading = ref(true)

    const fetchStatus = async () => {
        loading.value = true
        subscribed.value = await isSubscribed(user.value?.sub)
        loading.value = false
    }

    const toggle = async () => {
        if (subscribed.value === null) return

        if (subscribed.value) {
            await unsubscribe(user.value?.sub)
            subscribed.value = false
        } else {
            await subscribe(user.value?.sub)
            subscribed.value = true
        }
    }

    return { subscribed, loading, fetchStatus, toggle }
})