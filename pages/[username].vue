<template>
    <div v-if="loading" class="flex justify-center items-center w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <Card class="min-h-full w-full sm:w-2xl sm:p-2 fade-in" v-else-if="publicStreamer"
        :style="{ '--p-card-background': wallpaperColor, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }">
        <template #title>
            <div class="flex items-center justify-between">
                <NuxtLink v-ripple :to="'/'">
                    <button class="flex items-center p-3 rounded-full transition-all "
                        :class="[fixedButtonColor, fixedButtonBg]">
                        <Icon name="lucide:home" size="20" />
                    </button>
                </NuxtLink>
                <button @click="copyText" class="flex items-center px-3 py-2.5 rounded-full transition-all gap-2"
                    :class="copied
                        ? 'bg-green-400 text-black'
                        : [fixedButtonBg, fixedButtonColor]
                        ">
                    <Icon v-if="!copied" name="lucide:copy" size="20" />
                    <Icon v-else name="lucide:check" size="20" />
                    <span class="text-sm sm:text-base">{{ copied ? 'Copié !' : 'Copier le StreamLink' }}</span>
                </button>
            </div>

            <div class="flex items-center text-center flex-col mx-auto my-4">
                <img :src="publicStreamer?.avatar_url || defaultAvatar" alt="Avatar"
                    class="w-24 h-24 rounded-full object-cover mb-4 mt-4" />
                <span :class="['font-bold', usernameSizeClass]" :style="{ color: usernameColor }">
                    {{ publicStreamer?.username }}
                </span>
                <span class="text-base font-medium break-words" :style="{ color: descriptionColor }">
                    {{ publicStreamer?.bio }}
                </span>
            </div>

        </template>
        <template #content>
            <!-- Liste de liens -->
            <div class="flex flex-col gap-4 w-full">
                <div class="w-full mx-auto" v-for="link in publicLinks" :key="link.id">
                    <a :href="link.url" target="_blank">
                        <button :class="['relative flex items-center w-full font-semibold transition h-16',
                            link.icon_url ? 'px-3 py-3' : 'px-5 py-5', buttonClass, buttonRadiusClass]" :style="{
                                backgroundColor: buttonBackgroundColor,
                                borderColor: buttonBorderColor
                            }">
                            <!-- Icône ou image à gauche -->
                            <div
                                :class="['absolute flex items-center justify-center', link.icon_url ? 'left-3' : 'left-5']">
                                <template v-if="link.icon_url">
                                    <img :src="link.icon_url" class="w-10 h-10 object-contain rounded flex-shrink-0" />
                                </template>
                                <template v-else>
                                    <Icon :name="link.icon" size="24" class="flex-shrink-0"
                                        :style="{ color: buttonTextColor }" />
                                </template>
                            </div>
                            <!-- Texte centré -->
                            <span class="font-medium break-words flex-1 text-sm sm:text-base text-center mx-8"
                                :style="{ color: buttonTextColor }">{{
                                    link.title
                                }}</span>
                        </button>
                    </a>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-center my-12">
                <NuxtLink :to="'/admin/links'" external>
                    <Button severity="contrast">
                        <span class="font-semibold font-sm">Rejoignez {{ publicStreamer?.username }} sur StreamLink</span>
                    </Button>
                </NuxtLink>
            </div>
            <!-- Footer infos -->
            <div class="flex flex-col items-center gap-3 pb-10 text-xs">
                <div class="flex items-center gap-2" :style="{ color: footerTextColor }">
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
            <NuxtLink :to="'/admin/links'">
                <Button severity="contrast">
                    <Icon name="lucide:plus" size="20" />
                    <span class="font-semibold">Créez votre page StreamLink</span>
                </Button>
            </NuxtLink>
        </div>
    </template>
</template>

<script setup>
definePageMeta({
    layout: 'links'
})

// Stores
const streamerStore = useStreamerStore()
const { publicStreamer, loading } = storeToRefs(streamerStore)
const linkStore = useLinkStore()
const { publicLinks } = storeToRefs(linkStore)
const designStore = useDesignStore()
const { publicDesign } = storeToRefs(designStore)

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

onMounted(async () => {
    const username = route.params.username
    streamerStore.loading = true
    const data = await streamerStore.fetchStreamerByUsername(username)
    await linkStore.fetchLinksByStreamerId(data.id)
    await designStore.fetchPublicDesign(data.id)
    streamerStore.loading = false
})

// Style du pseudo dynamique
const usernameSizeClass = computed(() => {
    const size = publicDesign.value?.username_style?.size ?? 'normal'
    return size === 'medium' ? 'text-3xl' : 'text-2xl'
})
const usernameColor = computed(() => {
    const color = publicDesign.value?.username_style?.textColor ?? 'FFFFFF'
    return color ? `#${color}` : '#FFFFFF'
})

// Style de la description dynamique
const descriptionColor = computed(() => {
    const color = publicDesign.value?.bio_style?.textColor ?? 'D4D4D8'
    return color ? `#${color}` : '#D4D4D8'
})

// Style des boutons dynamique
const buttonVariant = computed(() => publicDesign.value?.button_style?.variant ?? 'filled')

const buttonClass = computed(() => {

    if (buttonVariant.value === 'outlined') {
        return [
            'bg-transparent',
            `border border-2`,
        ]
    }

    // filled
    return [
        'border-none',
        'hover:brightness-90',
    ]
})

const buttonBorderColor = computed(() => {
    const color = publicDesign.value?.button_style?.backgroundColor ?? 'FFFFFF'
    return buttonVariant.value === 'outlined' ? `#${color}` : null
})

const buttonBackgroundColor = computed(() => {
    const color = publicDesign.value?.button_style?.backgroundColor ?? 'FFFFFF'
    return buttonVariant.value === 'filled' ? `#${color}` : 'transparent'
})

const buttonTextColor = computed(() => {
    const color = publicDesign.value?.button_style?.textColor ?? '000000'
    return `#${color}`
})

const buttonRadiusClass = computed(() => {
    return publicDesign.value?.button_style?.borderRadius ?? 'rounded-lg'
})

// Style du fond dynamique
const wallpaperColor = computed(() => {
    const color = publicDesign.value?.wallpaper_style?.backgroundColor ?? '18181B'
    return `#${color}`
})

// Fonction pour déterminer si le texte du footer et les boutons doivent être clairs ou sombres
function isColorDark(hex) {
    if (!hex) return true
    const c = hex.startsWith('#') ? hex.substring(1) : hex
    const r = parseInt(c.substr(0, 2), 16)
    const g = parseInt(c.substr(2, 2), 16)
    const b = parseInt(c.substr(4, 2), 16)
    // Perception de la luminosité
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 128
}

const fixedButtonColor = computed(() => {
    return isColorDark(wallpaperColor.value) ? 'text-white' : 'text-black'
})

const fixedButtonBg = computed(() => {
    return isColorDark(wallpaperColor.value) ? 'bg-zinc-800 hover:bg-zinc-700/70' : 'bg-white hover:bg-zinc-200'
})

const footerTextColor = computed(() => {
    return isColorDark(wallpaperColor.value) ? '#FFFFFF' : '#000000'
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