export const useNewsletterAdmin = () => {
    const sending = ref(false)
    const result = ref<any>(null)
    const error = ref<string | null>(null)

    const sendNewsletter = async () => {
        sending.value = true
        error.value = null
        try {
            const res = await $fetch('/api/newsletter', { method: 'POST' })
            result.value = res
            return res
        } catch (e: any) {
            error.value = e?.message || 'Erreur inconnue'
        } finally {
            sending.value = false
        }
    }

    return { sending, result, error, sendNewsletter }
}
