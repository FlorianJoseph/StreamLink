<template>
    <div v-if="loading" class="flex justify-center items-center w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <Card class="min-h-full w-full sm:w-2xl sm:p-2 fade-in" v-else-if="streamer">
        <template #title>
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <NuxtLink v-ripple :to="'/'">
                        <Button rounded severity="secondary">
                            <Icon name="lucide:home" size="24" />
                        </Button>
                    </NuxtLink>
                    <Button rounded :severity="copied ? 'success' : 'secondary'" @click="copyText"
                        class="transition-all duration-300">
                        <Icon v-if="!copied" name="lucide:files" size="24" />
                        <Icon v-else name="lucide:check" size="24" />
                        <span>{{ copied ? 'Copié !' : 'Copier le Streamlink' }}</span>
                    </Button>
                </div>
            </div>

            <div class="flex items-center text-center flex-col mx-auto my-6">
                <img :src="streamer?.avatar_url || defaultAvatar" alt="Avatar"
                    class="w-24 h-24 rounded-full object-cover mb-4 mt-4" />
                <span class="text-2xl font-bold">{{ streamer?.username }}</span>
                <span class="text-base font-medium break-words">
                    {{ streamer?.bio }}
                </span>
            </div>

        </template>
        <template #content>
            <!-- Liste de liens -->
            <div class="flex flex-col gap-4 w-full">
                <div class="w-full mx-auto" v-for="link in visibleLinks" :key="link.id">
                    <a :href="link.url" target="_blank">
                        <button :class="['relative flex items-center w-full bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition h-16',
                            link.icon_url ? 'px-3 py-3' : 'px-5 py-5']">
                            <!-- Icône ou image à gauche -->
                            <div
                                :class="['absolute flex items-center justify-center', link.icon_url ? 'left-3' : 'left-5']">
                                <template v-if="link.icon_url">
                                    <img :src="link.icon_url" class="w-10 h-10 object-contain rounded flex-shrink-0" />
                                </template>
                                <template v-else>
                                    <Icon :name="link.icon" size="24" class="flex-shrink-0" />
                                </template>
                            </div>
                            <!-- Texte centré -->
                            <span class="font-medium break-words flex-1 text-sm sm:text-base text-center mx-8">{{
                                link.title
                                }}</span>
                        </button>
                    </a>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-center my-12">
                <NuxtLink :to="'/admin'">
                    <Button severity="contrast">
                        <span class="font-semibold font-sm">Rejoignez {{ streamer?.username }} sur StreamLink</span>
                    </Button>
                </NuxtLink>
            </div>
            <!-- Footer infos -->
            <div class="flex flex-col items-center gap-3 pb-10 text-xs">
                <div class="flex items-center gap-2">
                    <NuxtLink to="/contact" class="hover:underline font-medium">
                        Contact
                    </NuxtLink>
                    <span>•</span>
                    <NuxtLink to="/privacy" class="hover:underline font-medium">
                        Confidentialité
                    </NuxtLink>
                </div>
            </div>
        </template>
    </Card>
    <template v-else>
        <div class="flex flex-col items-center text-center gap-6">
            <!-- Icône pour illustrer l'erreur -->
            <Icon name="lucide:info" size="48" />

            <!-- Message principal -->
            <h2 class="text-2xl font-bold">La page que vous cherchez n'existe pas</h2>

            <!-- Message secondaire -->
            <p class="text-gray-500 max-w-md">
                Cette page n'existe pas encore. Créez votre page maintenant et commencez à partager vos liens facilement
                !
            </p>

            <!-- Bouton CTA -->
            <NuxtLink :to="'/admin'">
                <Button severity="contrast">
                    <Icon name="lucide:plus" size="20" />
                    <span class="font-semibold">Créez votre page StreamLink</span>
                </Button>
            </NuxtLink>
        </div>
    </template>
    <Toast />
</template>

<script setup>
definePageMeta({
    layout: 'links'
})

// Stores
const streamerStore = useStreamerStore()
const { streamer, loading } = storeToRefs(streamerStore)

const route = useRoute()

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png";

const copied = ref(false)
const copyText = () => {
    const url = `${window.location.origin}/${route.params.username || ''}`
    navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
}

// Stores
const linkStore = useLinkStore()
const { links } = storeToRefs(linkStore)

const visibleLinks = computed(() => links.value.filter(link => link.visible))

onMounted(async () => {
    const username = route.params.username
    streamerStore.loading = true
    const data = await streamerStore.fetchStreamerByUsername(username)
    await linkStore.fetchLinksByStreamerId(data.id)
    streamerStore.loading = false
})
</script>

<style scoped>
/* Petite animation d’apparition douce du contenu */
.fade-in {
    animation: fadeIn 0.4s ease forwards;
    opacity: 0;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}
</style>