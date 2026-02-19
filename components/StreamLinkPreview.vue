<template>
    <div class="flex flex-col gap-4">
        <div class="pb-4 lg:py-4">
            <div class="flex flex-col items-center justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                    Aperçu du StreamLink
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center lg:text-left max-w-xl">
                    Voici comment votre page apparaîtra à vos visiteurs
                </p>
            </div>
        </div>
        <StreamLinkShare />
        <Card class="flex flex-col w-full h-160 sm:w-sm overflow-auto"
            :style="{ '--p-card-background': wallpaperColor }">
            <template #title>
                <div class="flex items-center justify-between">
                    <button class="flex items-center p-2 rounded-full transition-all "
                        :class="[fixedButtonColor, fixedButtonBg]">
                        <Icon name="lucide:home" size="18" />
                    </button>
                    <button class="flex items-center px-2 py-1.5 rounded-full transition-all gap-2"
                        :class="[fixedButtonBg, fixedButtonColor]">
                        <Icon name="lucide:copy" size="18" />
                        <span class="text-xs sm:text-sm">Copier le StreamLink</span>
                    </button>
                </div>
                <div class="flex items-center text-center flex-col w-full my-6">
                    <Avatar :image="streamer?.avatar_url || defaultAvatar" shape="circle" size="xlarge" class="mb-2" />
                    <span :class="['font-semibold', usernameSizeClass]" :style="{ color: usernameColor }">
                        {{ streamer?.username }}
                    </span>
                    <span class="text-sm font-medium break-words" :style="{ color: descriptionColor }">
                        {{ streamer?.bio }}
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2 w-full">
                    <div class="w-full mx-auto" v-for="link in links" :key="link.id">
                        <a :href="link.url" target="_blank">
                            <button :class="['relative flex items-center w-full font-semibold transition h-14',
                                link.icon_url ? 'px-3 py-3' : 'px-5 py-5', buttonClass, buttonRadiusClass]" :style="{
                                    backgroundColor: buttonBackgroundColor,
                                    borderColor: buttonBorderColor
                                }">
                                <!-- Icône ou image à gauche -->
                                <div
                                    :class="['absolute flex items-center justify-center', link.icon_url ? 'left-2.5' : 'left-4.5']">
                                    <template v-if="link.icon_url">
                                        <img :src="link.icon_url"
                                            class="w-8.5 h-8.5 object-contain rounded flex-shrink-0" />
                                    </template>
                                    <template v-else>
                                        <Icon :name="link.icon" size="20" class="flex-shrink-0"
                                            :style="{ color: buttonTextColor }" />
                                    </template>
                                </div>
                                <!-- Texte centré -->
                                <span class="font-medium break-words flex-1 text-sm sm:text-base text-center mx-8"
                                    :style="{ color: buttonTextColor }">{{
                                        link.title }}</span>
                            </button>
                        </a>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-center my-10">
                    <Button severity="contrast">
                        <span class="text-sm font-semibold">Rejoignez {{ streamer?.username }} sur StreamLink</span>
                    </Button>
                </div>
                <!-- Footer infos -->
                <div class="flex flex-col items-center gap-3 pb-6 text-xs">
                    <div class="flex items-center gap-2" :style="{ color: footerTextColor }">
                        <p class="hover:underline font-medium">Contact</p>
                        <span>•</span>
                        <p class="hover:underline font-medium">Confidentialité</p>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
const linkStore = useLinkStore()
const streamerStore = useStreamerStore()
const designStore = useDesignStore()
const { links } = storeToRefs(linkStore)
const { streamer } = storeToRefs(streamerStore)
const { design } = storeToRefs(designStore)

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png";

const streamerId = streamer.value?.id

// Charger le design au montage du composant
onMounted(async () => {
    if (streamerId) {
        await linkStore.fetchLinks()
        await designStore.fetchDesign()
    }
})

// Style du pseudo dynamique
const usernameSizeClass = computed(() => {
    const size = design.value?.username_style?.size ?? 'normal'
    return size === 'medium' ? 'text-2xl' : 'text-lg'
})
const usernameColor = computed(() => {
    const color = design.value?.username_style?.textColor ?? 'FFFFFF'
    return color ? `#${color}` : '#FFFFFF'
})

// Style de la description dynamique
const descriptionColor = computed(() => {
    const color = design.value?.bio_style?.textColor ?? 'D4D4D8'
    return color ? `#${color}` : '#D4D4D8'
})

// Style des boutons dynamique
const buttonVariant = computed(() => design.value?.button_style?.variant ?? 'filled')

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
    const color = design.value?.button_style?.backgroundColor ?? 'FFFFFF'
    return buttonVariant.value === 'outlined' ? `#${color}` : null
})

const buttonBackgroundColor = computed(() => {
    const color = design.value?.button_style?.backgroundColor ?? 'FFFFFF'
    return buttonVariant.value === 'filled' ? `#${color}` : 'transparent'
})

const buttonTextColor = computed(() => {
    const color = design.value?.button_style?.textColor ?? '000000'
    return `#${color}`
})

const buttonRadiusClass = computed(() => {
    return design.value?.button_style?.borderRadius ?? 'rounded-lg'
})

// Style du fond dynamique
const wallpaperColor = computed(() => {
    const color = design.value?.wallpaper_style?.backgroundColor ?? '18181B'
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