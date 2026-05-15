<template>
    <div class="flex flex-col justify-center items-center min-h-full text-center gap-4">
        <ProgressSpinner
            style="width: 40px; height: 40px; --p-progressspinner-color-one:#6A5AE0; --p-progressspinner-color-two:#8B7FF0; --p-progressspinner-color-three:#6A5AE0; --p-progressspinner-color-four:#4A3AC0"
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Chargement..." />
        <div class="flex flex-col gap-1">
            <h2 class="font-heading text-lg font-bold text-white">Connexion en cours…</h2>
            <p class="text-sm text-muted">Ne ferme pas cette page, tu vas être redirigé automatiquement.</p>
        </div>
    </div>
</template>

<script setup>

useSeoMeta({ title: 'Connexion en cours…' })

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

        const rawRedirect = (() => {
            try { return localStorage.getItem('post_auth_redirect'); } catch (e) { return null; }
        })();
        const validateRedirect = (r) => {
            if (!r) return '/';
            try {
                const url = new URL(r, window.location.origin);
                if (url.origin !== window.location.origin) return '/';
                return (url.pathname + url.search + url.hash) || '/';
            }
            catch (e) {
                return '/';
            }
        };

        const redirect = validateRedirect(rawRedirect);
        try { localStorage.removeItem('post_auth_redirect'); } catch (e) { /* ignore */ }

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
