<template>
    <Card class="w-full sm:max-w-sm lg:max-w-md mx-auto">
        <template #title>
            <div class="pt-4">
                <div class="flex flex-col items-center h-12 justify-end">
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                        Connectez vous
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center max-w-xl">
                        Rejoignez les créateurs sur StreamLink
                    </p>
                </div>
            </div>
        </template>
        <template #content>
            <div class="text-gray-500 text-sm py-2 space-y-4">
                <p class="font-medium">
                    En vous connectant avec <strong>Twitch</strong>, vous autorisez <strong>StreamLink</strong> à
                    accéder à vos
                    informations publiques :
                </p>

                <ul class="text-left text-gray-600 list-disc text-sm pl-8">
                    <li>Obtenir votre identifiant, nom d'utilisateur, image de profil et date de mise à jour du profil
                    </li>
                    <li>Lire votre adresse e-mail et son statut de vérification</li>
                </ul>
                <Divider />
                <p class="text-xs lg:whitespace-nowrap text-gray-600">
                    Vous pouvez révoquer cette autorisation depuis votre page
                    <a href="https://www.twitch.tv/settings/connections" target="_blank"
                        class="text-blue-500 hover:underline">Connexions</a>.
                </p>
            </div>
        </template>
        <template #footer>
            <div class="flex flex-col gap-3 sm:gap-4">
                <div class="flex flex-col gap-2 justify-center items-center">
                    <button @click="twitchAuth" class="flex flex-row items-center justify-center gap-2 p-3 text-lg bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors 
               w-full">
                        <span class="text-sm sm:text-base font-semibold">Autoriser</span>
                    </button>
                    <Button severity="contrast" variant="outlined" @click="goBack" class="w-full">
                        <span>Retour</span>
                    </Button>
                    <div v-if="error" class="text-red-500 text-sm mt-4">
                        {{ error }}
                    </div>
                </div>
                <p class="text-xs text-gray-600 text-center">En cliquant sur Autoriser, vous
                    autorisez le partage
                    d'informations et
                    l'accès au compte répertoriés
                    ci-dessus avec StreamLink et autorisez StreamLink et Twitch à utiliser vos informations conformément
                    à
                    leurs
                    conditions de service et avis de confidentialité respectifs.</p>
                <div class="flex flex-row justify-center text-xs gap-6">
                    <a href="https://legal.twitch.com/legal/privacy-notice/" target="_blank"
                        class="hover:underline">Avis de confidentialité
                    </a>
                    <a href="https://legal.twitch.com/legal/terms-of-service/" target="_blank"
                        class="hover:underline">Conditions d'utilisation
                    </a>
                    <a href="https://help.twitch.tv/s/?language=en_US" target="_blank" class="hover:underline">Aide</a>

                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const error = ref(null)

function goBack() {
    if (window.history.length > 1) router.back()
    else router.push('/')
}

async function twitchAuth() {
    try {
        error.value = null
        const { data, error: authError } = await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo: route.query.redirect
                    ? `${window.location.origin}/auth/callback?redirect=${route.query.redirect}`
                    : `${window.location.origin}/auth/callback`
            }
        })
        if (authError) throw authError
    } catch (err) {
        console.error(err)
        error.value = "Une erreur est survenue lors de la connexion."
    }
}

definePageMeta({
    layout: 'auth'
})
</script>
