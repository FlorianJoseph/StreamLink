<template>
    <Card class="w-full sm:max-w-md lg:max-w-2xl mx-auto">
        <template #title>
            <div class="py-2 pt-0 sm:py-4 sm:pt-8 lg:pt-4">
                <div class="flex flex-col items-center sm:h-12 justify-end">
                    <!-- Titre -->
                    <h1 class="text-xl sm:text-3xl md:text-3xl font-bold text-center">
                        Conditions d'utilisation
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-xs sm:text-base text-center max-w-xl">
                        Vous devez accepter les conditions d'utilisation pour continuer.
                    </p>
                </div>
            </div>
        </template>
        <template #content>
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-3">
                    <label
                        class="flex items-start gap-3 w-full cursor-pointer hover:bg-gray-400/10 rounded-lg p-3 transition-all "
                        :class="privacy && 'bg-gray-400/5 border-gray-300'">
                        <Checkbox v-model="privacy" binary style="--p-checkbox-checked-background: #f0f0f0;
           --p-checkbox-checked-border-color: #f0f0f0;
           --p-checkbox-checked-hover-border-color: #f0f0f0;
           --p-checkbox-checked-hover-background: #f0f0f0;" />
                        <div class="flex-1 sm:text-sm text-xs">
                            <p class="flex flex-wrap">
                                J'ai lu et j'accepte les&nbsp;
                                <NuxtLink to="/privacy" class="hover:underline text-blue-500">
                                    Conditions d'utilisation
                                </NuxtLink>
                                <span>&nbsp;et la&nbsp;</span>
                                <NuxtLink to="/privacy" class="hover:underline text-blue-500">
                                    Politique de confidentialité
                                </NuxtLink>.
                            </p>
                            <small class="text-gray-400">(Obligatoire)</small>
                            <div v-if="error" class="text-red-500 text-sm mt-1">
                                {{ error }}
                            </div>
                        </div>
                    </label>
                    <label
                        class="flex items-start gap-3 w-full cursor-pointer hover:bg-gray-400/10 rounded-lg p-3 transition-all "
                        :class="newsletter && 'bg-gray-400/5 border-gray-300'">
                        <Checkbox v-model="newsletter" binary style="--p-checkbox-checked-background: #f0f0f0;
           --p-checkbox-checked-border-color: #f0f0f0;
           --p-checkbox-checked-hover-border-color: #f0f0f0;
           --p-checkbox-checked-hover-background: #f0f0f0;" />
                        <div class="flex-1 sm:text-sm text-xs">
                            <p> Je souhaite recevoir les mises à jour importantes et nouveautés liées à StreamLink.</p>
                            <small class="text-gray-400">(Facultatif, vous pouvez modifier à tout moment depuis votre
                                profil de compte)</small>
                        </div>
                    </label>
                </div>
                <Button severity="contrast" class="font-semibold w-full" @click="acceptTerms" :disabled="!privacy">
                    <Icon name="lucide:check" size="20" />
                    <span class="text-sm sm:text-base font-semibold">Accepter</span>
                </Button>
            </div>
        </template>
    </Card>
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

        const streamerId = streamer.value?.id

        // Stocke CGU + Privacy (obligatoire)
        await accept('terms', streamerId)
        await accept('privacy', streamerId)

        // Newsletter (optionnelle)
        if (newsletter.value === true) {
            try {
                await subscribe(streamerId)
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
