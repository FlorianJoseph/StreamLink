<template>
    <div class="flex flex-col gap-4">
        <div class="py-4">
            <div class="flex flex-col items-center justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                    Créer mon StreamLink
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center max-w-xl sm:whitespace-nowrap">
                    Créez votre page de liens personnalisée à partager avec votre audience
                </p>
            </div>
        </div>

        <div v-if="user" class="flex flex-col gap-4">
            <InputGroup>
                <InputGroupAddon>stream-link.fr/</InputGroupAddon>
                <InputText v-model="form.username" placeholder="Nom d'utilisateur" />
            </InputGroup>
            <span v-if="usernameError" class="text-xs text-red-500">
                {{ usernameError }}
            </span>

            <button type="button" @click="createStreamlink"
                class="bg-purple-600 font-medium text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                Créer mon StreamLink
            </button>
        </div>
        <button @click="twitchAuth" v-else
            class="flex flex-row items-center justify-center gap-2 p-3 text-lg bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Icon name="lucide:twitch" size="24" />
            <span class="text-md font-semibold">Se connecter avec Twitch</span>
        </button>
    </div>
</template>

<script setup>

const supabase = useSupabaseClient();
const user = useSupabaseUser()

async function twitchAuth() {
    try {
        const currentPath = window.location.pathname
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(currentPath)}`,
            },
        });
        if (error) {
            return;
        }
    } catch (err) {
        console.error('Erreur lors de la connexion Twitch:', err);
    }
}

// Stores
const streamerStore = useStreamerStore()
const usernameError = ref('')

const form = ref({
    username: user.value?.user_metadata.nickname || '',
});

const createStreamlink = async () => {
    if (!form.value.username) return

    else {
        const { data, error } = await streamerStore.createStreamer({
            username: form.value.username
        })

        // Gestion de l'erreur
        if (error) {
            if (error.code === '23505') {
                // Conflit unique Postgres
                usernameError.value = 'Ce pseudo est déjà utilisé !'
            } else {
                usernameError.value = error.message
            }
            return
        }
        usernameError.value = ''
    }
}

watch(
    () => form.value.username,
    () => {
        usernameError.value = ''
    }
)
</script>
