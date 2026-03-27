<template>
    <div class="flex flex-col gap-4">
        <div class="pb-4 lg:py-4">
            <div class="flex flex-col items-center justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                    Aperçu de ma page
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center lg:text-left max-w-xl text-gray-400">
                    Voici comment ta page apparaîtra à tes visiteurs
                </p>
            </div>
        </div>
        <StreamLinkShare />
        <div class="flex flex-col w-full h-160 sm:w-sm rounded-xl relative overflow-auto preview-scroll"
            :style="{ backgroundColor: wallpaperColor }">

            <!-- Bouton de copie du lien -->
            <button class="absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 rounded-md transition-all" :style="{
                color: isColorDark(wallpaperColor) ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                backgroundColor: hoveredCopy ? (isColorDark(wallpaperColor) ? buttonBackgroundColor + '22' : buttonBackgroundColor + '44') : 'transparent'
            }" @mouseenter="hoveredCopy = true" @mouseleave="hoveredCopy = false">
                <Icon name="lucide:copy" size="14" class="shrink-0" />
                <span class="text-xs">Copier le lien</span>
            </button>

            <!-- En-tête avec avatar, pseudo, description et statut live -->
            <div>
                <div class="flex items-center gap-3 px-5 py-8">
                    <!-- Avatar -->
                    <div class="relative flex-shrink-0">
                        <div class="avatar-ring"
                            :style="{ '--ring-color': isColorDark(wallpaperColor) ? buttonBackgroundColor + '88' : buttonBackgroundColor }">
                            <img :src="streamer?.avatar_url || defaultAvatar" alt="Avatar"
                                class="w-14 h-14 rounded-full object-cover" />
                        </div>
                    </div>
                    <!-- Pseudo et description -->
                    <div class="flex flex-col flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span :class="['font-bold tracking-wide', usernameSizeClass]"
                                :style="{ color: usernameColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                                {{ streamer?.username }}
                            </span>
                        </div>
                        <span class="text-xs mt-1 break-words line-clamp-5"
                            :style="{ color: descriptionColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                            {{ streamer?.bio }}
                        </span>
                    </div>
                </div>

                <!-- Prochain stream -->
                <div class="flex items-center gap-2 px-4 py-2.5 border-t border-b"
                    :style="{ borderColor: isColorDark(wallpaperColor) ? buttonBackgroundColor + '22' : buttonBackgroundColor }">
                    <div class="flex flex-row items-center gap-1.5">
                        <Icon name="lucide:calendar-days" size="14" class="flex-shrink-0"
                            :style="{ color: textColor }" />
                        <span class="text-xs font-semibold flex-shrink-0"
                            :style="{ color: textColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                            Affiche ton stream grâce au planning
                        </span>
                    </div>
                </div>
            </div>

            <!-- Contenu principal avec switcher Liens / Planning -->
            <div class="flex flex-col space-y-6 px-5 items-center mt-5">

                <!-- Switcher -->
                <div class="flex gap-1">
                    <button v-for="tab in tabs" :key="tab.id" @mouseenter="hoveredTab = tab.id"
                        @mouseleave="hoveredTab = null"
                        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                        :style="activeTab === tab.id
                            ? { backgroundColor: buttonBackgroundColor, color: isColorDark(buttonBackgroundColor) ? '#fff' : '#000', fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }
                            : {
                                backgroundColor: hoveredTab === tab.id ?
                                    (isColorDark(wallpaperColor) ? buttonBackgroundColor + '22' : buttonBackgroundColor + '44') : 'transparent',
                                color: textColor,
                                fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit'
                            }">
                        <Icon :name="tab.icon" size="14" />
                        {{ tab.label }}
                    </button>
                </div>

                <!-- Liste de liens -->
                <div v-if="links.length > 0" class="flex flex-col gap-2 w-full">
                    <div class="w-full mx-auto" v-for="link in visibleLinks" :key="link.id">
                        <a :href="link.url" target="_blank">
                            <button :class="['relative flex items-center w-full font-semibold transition h-14',
                                link.icon_url ? 'px-3 py-3' : 'px-5 py-5', buttonClass, buttonRadiusClass]" :style="{
                                    backgroundColor: buttonVariant === 'outlined'
                                        ? hoveredLink === link.id ? buttonBorderColor + '18' : 'transparent'
                                        : buttonBackgroundColor,
                                    borderColor: buttonBorderColor,
                                    fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit'
                                }" @mouseenter="hoveredLink = link.id" @mouseleave="hoveredLink = null">
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
                                <span class="font-medium break-words flex-1 text-sm text-center mx-8"
                                    :style="{ color: buttonTextColor }">{{
                                        link.title }}</span>
                            </button>
                        </a>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center gap-3 py-10 text-center">
                    <Icon name="lucide:link-2-off" size="28" :style="{ color: textColor }" />
                    <p class="text-sm" :style="{ color: textColor }">
                        Aucun lien partagé pour l'instant</p>
                </div>

                <!-- Footer CTA -->
                <div v-if="!noBranding" class="flex flex-col items-center gap-2 text-center">
                    <p class="text-sm text-center font-semibold tracking-wide" :style="{ color: textColor + 'CC' }">
                        Ton univers, en une page.
                    </p>
                    <div :class="['py-2.5 px-5 rounded-lg font-semibold tracking-wide transition-all shadow-md text-sm group cursor-pointer',
                        isColorDark(buttonBackgroundColor) ? 'hover:brightness-110' : 'hover:brightness-90']"
                        :style="{ backgroundColor: buttonBackgroundColor, color: isColorDark(buttonBackgroundColor) ? '#fff' : '#000' }">
                        Créer ma page comme
                        <span class="font-extrabold group-hover:underline">{{ streamer?.username }}</span>
                    </div>
                </div>

                <!-- Footer infos -->
                <div class="flex flex-col items-center gap-3 pb-6 text-xs">
                    <div class="flex items-center gap-2" :style="{ color: textColor }">
                        <p class="hover:underline font-medium">Contact</p>
                        <span>•</span>
                        <p class="hover:underline font-medium">Confidentialité</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const linkStore = useLinkStore()
const streamerStore = useStreamerStore()
const designStore = useDesignStore()
const { links } = storeToRefs(linkStore)
const { streamer } = storeToRefs(streamerStore)
const { design } = storeToRefs(designStore)

const visibleLinks = computed(() => links.value.filter(link => link.visible))

// Tabs
const tabs = [
    { id: 'liens', label: 'Liens', icon: 'lucide:link' },
    { id: 'planning', label: 'Planning', icon: 'lucide:calendar-days' },
]
const activeTab = ref('liens')

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png";

// Style du pseudo dynamique
const usernameSizeClass = computed(() => {
    const size = design.value?.username_style?.size ?? 'normal'
    return size === 'medium' ? 'text-xl' : 'text-lg'
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
            `border`,
        ]
    }

    // filled
    return [
        'border-none',
        isColorDark(buttonBackgroundColor.value) ? 'hover:brightness-105' : 'hover:brightness-95',
    ]
})

// États de survol pour les liens, les tabs et le bouton de copie
const hoveredLink = ref(null)
const hoveredTab = ref(null)
const hoveredCopy = ref(false)

const buttonBorderColor = computed(() => {
    const color = design.value?.button_style?.backgroundColor ?? 'FFFFFF'
    return buttonVariant.value === 'outlined' ? `#${color}` : null
})

// Couleur de fond pour les boutons filled
const buttonBackgroundColor = computed(() => {
    const color = design.value?.button_style?.backgroundColor ?? 'FFFFFF'
    return `#${color}`
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

const fontFamily = computed(() => design.value?.font_family ?? null)

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
// Couleur du texte basée sur la luminosité du wallpaper
const textColor = computed(() => isColorDark(wallpaperColor.value) ? '#FFFFFF' : '#000000')

const { hasFeature } = useFeatures()
const noBranding = computed(() => hasFeature('no_branding'))
</script>

<style scoped>
.preview-scroll {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #9F9F9F transparent;
}
</style>