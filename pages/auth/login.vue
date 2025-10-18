<template>
    <div class="flex flex-col gap-4 mt-8">
        <div class="py-4">
            <div class="flex flex-col items-center h-12 justify-end">
                <h1 class="text-3xl font-bold">Connectez vous</h1>
                <p class="text-center lg:text-left">
                    Vous devez être connecté pour accéder à cette page
                </p>
            </div>
        </div>
        <button @click="twitchAuth"
            class="flex flex-row items-center justify-center gap-2 p-3 text-lg bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Icon name="lucide:twitch" size="24" />
            <span class="text-md font-semibold">Se connecter avec Twitch</span>
        </button>
        <div v-if="error" class="text-red-500 text-sm mt-4">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const error = ref(null)
const redirect = route.query.redirect || '/'

async function twitchAuth() {
    try {
        error.value = null
        const { data, error: authError } = await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`
            }
        })
        if (authError) throw authError
    } catch (err) {
        console.error(err)
        error.value = "Une erreur est survenue lors de la connexion."
    }
}
</script>
