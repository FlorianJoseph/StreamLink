<template>
    <div class="flex flex-col justify-center items-center min-h-full text-center">
        <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="5" fill="transparent" animationDuration=".5s"
            aria-label="Chargement..." />
        <h2 class="text-lg font-medium mt-4">Connexion en cours...</h2>
        <p class="text-gray-400 text-sm">
            Ne fermez pas cette page, vous allez être redirigé automatiquement.
        </p>
    </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient()
const { hasAccepted } = useConsent()
import { CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION } from '~/constants/legal'

onMounted(async () => {
    try {
        // Récupère la session actuelle
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!session?.user) throw new Error('Utilisateur non authentifié')

        const redirect = route.query.redirect ? decodeURIComponent(route.query.redirect) : '/'

        // Vérifie si l'utilisateur a accepté les CGU en base
        const termsOk = await hasAccepted('terms', session.user.id)
        const privacyOk = await hasAccepted('privacy', session.user.id)

        if (termsOk && privacyOk) {
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    terms_version: CURRENT_TERMS_VERSION,
                    privacy_version: CURRENT_PRIVACY_VERSION
                }
            })
            if (updateError) throw updateError
            const user = useSupabaseUser()
            if (user.value?.user_metadata) {
                user.value.user_metadata.terms_version = CURRENT_TERMS_VERSION
                user.value.user_metadata.privacy_version = CURRENT_PRIVACY_VERSION
            }
            await supabase.auth.refreshSession()

            router.replace(redirect)
            return
        }

        // Pas accepté → accept-terms
        router.replace(`/auth/accept-terms?redirect=${encodeURIComponent(redirect)}`)

    } catch (err) {
        console.error(err)
        router.replace('/auth/login')
    }
})

definePageMeta({
    layout: 'auth'
})
</script>
