<template>
    <div v-if="loading" class="flex justify-center items-center w-full py-20">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" fill="transparent" animationDuration=".5s"
            aria-label="Chargement..." />
    </div>
    <Card class="min-h-full w-full sm:w-[580px] sm:p-2" v-else-if="streamer">
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
                <span class="text-base font-medium break-all">
                    {{ streamer?.bio }}
                </span>
            </div>

        </template>
        <template #content>
            <!-- Liste de liens -->
            <div class="flex flex-col gap-4 w-full">
                <div class="w-full mx-auto" v-for="link in visibleLinks" :key="link.id">
                    <a :href="link.url" target="_blank">
                        <button :class="[
                            'flex items-center w-full bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition',
                            link.icon_url ? 'px-3 py-5' : 'px-5 py-5'
                        ]">
                            <!-- Icône ou image à gauche -->
                            <div class="absolute flex items-center">
                                <template v-if="link.icon_url">
                                    <img :src="link.icon_url" class="w-10 h-10 object-contain rounded" />
                                </template>
                                <template v-else>
                                    <Icon :name="link.icon" size="24" />
                                </template>
                            </div>
                            <!-- Texte centré -->
                            <span class="mx-auto font-medium">{{ link.title }}</span>
                        </button>
                    </a>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-center my-12">
                <NuxtLink :to="'/admin'">
                    <Button severity="contrast">
                        <span class="font-semibold">Rejoignez {{ streamer?.username }} sur StreamLink</span>
                        <Icon name="lucide:arrow-right" size="16" />
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
</template>

<script setup>
const route = useRoute()

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Avatar/default/avatar.png";

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
const streamerStore = useStreamerStore()
const { streamer, loading } = storeToRefs(streamerStore)

const visibleLinks = computed(() => links.value.filter(link => link.visible))

onMounted(async () => {
    const username = route.params.username
    const data = await streamerStore.fetchStreamerByUsername(username)
    await linkStore.fetchLinksByStreamerId(data.id)
})
</script>