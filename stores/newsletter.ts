import { defineStore } from 'pinia'

export const useNewsletterStore = defineStore('newsletter', () => {
    const { uid } = useSupabase()
    const { isSubscribed, subscribe, unsubscribe } = useNewsletter()
    const toast = useToast()
    const subscribed = ref<boolean | null>(null)
    const loading = ref(true)

    const fetchStatus = async () => {
        loading.value = true
        subscribed.value = await isSubscribed(uid.value)
        loading.value = false
    }

    const toggle = async () => {
        if (subscribed.value === null) return

        if (subscribed.value) {
            await unsubscribe(uid.value)
            subscribed.value = false
            toast.add({
                severity: 'info',
                summary: 'Nouveautés',
                detail: 'Vous ne recevrez plus les nouveautés',
                life: 4000,
            })
        } else {
            await subscribe(uid.value)
            subscribed.value = true
            toast.add({
                severity: 'success',
                summary: 'Nouveautés',
                detail: 'Vous recevrez désormais les nouveautés',
                life: 4000,
            })
        }
    }

    return { subscribed, loading, fetchStatus, toggle }
})