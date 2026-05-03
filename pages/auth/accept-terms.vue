<template>
    <div
        class="w-full sm:max-w-md lg:max-w-2xl mx-auto flex flex-col gap-6 p-7 rounded-xl border border-white/8 bg-surface-darker">

        <!-- Header -->
        <div class="flex flex-col items-center gap-1 text-center">
            <h1 class="font-heading text-2xl font-bold text-white">
                Conditions d'utilisation
            </h1>
            <p class="text-sm text-muted">Tu dois accepter les conditions pour continuer</p>
        </div>

        <!-- Checkboxes -->
        <div class="flex flex-col gap-2">

            <!-- CGU + Privacy (obligatoire) -->
            <label class="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                :class="privacy ? 'bg-primary/8 border border-primary/20' : 'border border-white/8 hover:bg-white/3'">
                <Checkbox v-model="privacy" binary
                    style="--p-checkbox-checked-background:#6A5AE0; --p-checkbox-checked-border-color:#6A5AE0; --p-checkbox-checked-hover-background:#5849c4; --p-checkbox-checked-hover-border-color:#5849c4;" />
                <div class="flex flex-col gap-1">
                    <p class="text-sm text-white leading-relaxed">
                        J'ai lu et j'accepte les
                        <NuxtLink to="/privacy" class="text-primary hover:underline">Conditions d'utilisation</NuxtLink>
                        et la
                        <NuxtLink to="/privacy" class="text-primary hover:underline">Politique de confidentialité
                        </NuxtLink>
                    </p>
                    <span class="text-xs text-muted">Obligatoire</span>
                    <p v-if="error" class="text-xs text-red-400 mt-1">{{ error }}</p>
                </div>
            </label>

            <!-- Newsletter (optionnelle) -->
            <label class="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                :class="newsletter ? 'bg-primary/8 border border-primary/20' : 'border border-white/8 hover:bg-white/3'">
                <Checkbox v-model="newsletter" binary
                    style="--p-checkbox-checked-background:#6A5AE0; --p-checkbox-checked-border-color:#6A5AE0; --p-checkbox-checked-hover-background:#5849c4; --p-checkbox-checked-hover-border-color:#5849c4;" />
                <div class="flex flex-col gap-1">
                    <p class="text-sm text-white">Je veux recevoir les nouveautés et mises à jour de Charmi</p>
                    <span class="text-xs text-muted">Facultatif, modifiable à tout moment depuis ton compte</span>
                </div>
            </label>
        </div>

        <!-- CTA -->
        <button @click="acceptTerms" :disabled="!privacy"
            class="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Icon name="lucide:check" size="16" />
            Accepter et continuer
        </button>
    </div>
</template>

<script setup>
const privacy = ref(false)
const newsletter = ref(false)
const error = ref(null)
const router = useRouter()
const route = useRoute()
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)
const { accept } = useConsent()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { subscribe } = useNewsletter()

import { CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION } from '~/constants/legal'

async function acceptTerms() {
    if (!privacy.value) {
        error.value = "Vous devez accepter les conditions pour continuer."
        return
    }

    try {
        // Crée un streamer s'il n'existe pas
        if (!streamer.value) {
            await streamerStore.createStreamer()
        }

        const userId = streamer.value?.id

        // Stocke CGU + Privacy (obligatoire)
        await accept('terms', userId)
        await accept('privacy', userId)

        // Newsletter (optionnelle)
        if (newsletter.value === true) {
            try {
                await subscribe(userId)
            } catch (e) {
                console.warn('Newsletter non enregistrée', e)
            }
        }

        // Met à jour les métadonnées avec la dernière version
        await supabase.auth.updateUser({
            data: {
                terms_version: CURRENT_TERMS_VERSION,
                privacy_version: CURRENT_PRIVACY_VERSION
            }
        })
        if (user.value?.user_metadata) {
            user.value.user_metadata.terms_version = CURRENT_TERMS_VERSION
            user.value.user_metadata.privacy_version = CURRENT_PRIVACY_VERSION
        }
        await supabase.auth.refreshSession()

        const redirect = route.query.redirect ? decodeURIComponent(route.query.redirect) : '/'
        router.replace(redirect)
    } catch (e) {
        console.error('Erreur lors de l’acceptation :', e?.message || e)
        error.value = "Impossible d'enregistrer votre consentement. Réessayez."
    }
}

definePageMeta({
    layout: 'auth'
})
</script>
