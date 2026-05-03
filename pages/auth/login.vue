<template>
    <div class="min-h-screen flex items-center justify-center relative overflow-hidden">

        <!-- Card -->
        <div
            class="relative w-full sm:max-w-sm lg:max-w-md mx-auto flex flex-col gap-6 p-7 rounded-xl border border-white/8 bg-surface-darker">

            <!-- Logo + headline -->
            <div class="flex flex-col items-center gap-4 text-center">
                <div class="flex flex-col gap-1">
                    <h1 class="font-heading text-2xl font-bold text-white" style="font-variation-settings: 'wght' 900">
                        Bienvenue sur Charmi
                    </h1>
                    <p class="text-sm text-muted">Connecte-toi avec Twitch pour commencer</p>
                </div>
            </div>

            <!-- Mascotte + bulle -->
            <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/8 border border-primary/20">
                <img src="/images/mascotte/charmi-happy-violet.svg" alt="Charmi" class="w-12 h-12 shrink-0" />
                <p class="text-xs text-[#a89ff0] leading-relaxed">
                    <span class="font-semibold">Salut, moi c'est Charmi !</span><br />
                    Ton assistant de stream, toujours là pour toi
                </p>
            </div>

            <!-- Permissions -->
            <div class="flex flex-col gap-2">
                <p class="text-xs text-muted">Ce dont Charmi a besoin :</p>
                <div class="flex flex-col gap-1.5">
                    <div class="flex items-center gap-2 text-xs text-muted/80">
                        <Icon name="lucide:check" size="13" class="text-primary shrink-0" />
                        Ton nom d'utilisateur, image de profil
                    </div>
                    <div class="flex items-center gap-2 text-xs text-muted/80">
                        <Icon name="lucide:check" size="13" class="text-primary shrink-0" />
                        Ton adresse e-mail (lecture seule)
                    </div>
                    <div class="flex items-center gap-2 text-xs text-muted/80">
                        <Icon name="lucide:check" size="13" class="text-primary shrink-0" />
                        Gestion des raids sur ta chaîne
                    </div>
                </div>
            </div>

            <div class="h-px bg-white/8" />

            <!-- CTA -->
            <div class="flex flex-col gap-2">
                <button @click="twitchAuth"
                    class="flex items-center hover:brightness-90 justify-center gap-2.5 w-full py-3 rounded-md font-semibold text-sm text-white transition-all"
                    style="background: #9147FF;">
                    <Icon name="simple-icons:twitch" size="17" />
                    Continuer avec Twitch
                </button>
                <button @click="goBack"
                    class="flex items-center justify-center w-full py-2.5 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-sm font-medium text-muted hover:text-white transition-colors">
                    Retour
                </button>
                <p v-if="error" class="text-xs text-red-400 text-center mt-1">{{ error }}</p>
            </div>

            <!-- Legal -->
            <div class="flex flex-col gap-2">
                <p class="text-[10px] text-muted/50 text-center leading-relaxed">
                    En cliquant sur Continuer, tu acceptes les
                    <a href="https://legal.twitch.com/legal/terms-of-service/" target="_blank"
                        class="hover:text-muted/80 underline transition-colors">CGU Twitch</a>
                    et la
                    <a href="https://legal.twitch.com/legal/privacy-notice/" target="_blank"
                        class="hover:text-muted/80 underline transition-colors">politique de confidentialité</a>.
                    Tu peux révoquer l'accès depuis tes
                    <a href="https://www.twitch.tv/settings/connections" target="_blank"
                        class="hover:text-muted/80 underline transition-colors">connexions Twitch</a>.
                </p>
            </div>
        </div>
    </div>
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
        const target = route.query.redirect ? route.query.redirect : '/dashboard';
        localStorage.setItem('post_auth_redirect', target);
        const callback = `${window.location.origin}/auth/callback`;
        const { data, error: authError } = await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo: callback,
                scopes: 'channel:manage:raids'
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
