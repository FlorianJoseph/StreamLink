<template>
    <div v-if="loading" class="flex justify-center items-center w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div class="min-h-full w-full sm:w-2xl p-5 sm:p-7 fade-in sm:rounded-t-xl sm:border-t sm:border-r sm:border-l shadow-xl"
        v-else-if="publicStreamer" :style="{ background: wallpaperColor, borderColor: accentColorAuto + '44' }">

        <!-- Top bar -->
        <div class="flex items-center justify-between">
            <NuxtLink v-ripple :to="'/'">
                <button class="flex items-center p-3 rounded-full transition-all shadow-xs"
                    :class="[fixedButtonColor, fixedButtonBg]">
                    <Icon name="lucide:home" size="20" />
                </button>
            </NuxtLink>
            <button @click="copyText" class="flex items-center px-3 py-2.5 rounded-full transition-all gap-2 shadow-xs"
                :class="copied
                    ? 'bg-green-400 text-black'
                    : [fixedButtonBg, fixedButtonColor]
                    ">
                <Icon v-if="!copied" name="lucide:copy" size="20" />
                <Icon v-else name="lucide:check" size="20" />
                <span class="text-sm sm:text-base font-medium">{{ copied ? 'Copié !' : 'Copier le lien' }}</span>
            </button>
        </div>

        <div class="flex flex-col space-y-2 mt-4">
            <div class="relative rounded-2xl my-4 border shadow-xs"
                :style="{ backgroundColor: bgColorAuto, borderColor: accentColorAuto + '44' }">
                <!-- En-tête -->
                <div class="relative z-10 flex items-center gap-4 px-5 py-4">
                    <!-- Avatar -->
                    <div class="relative flex-shrink-0">
                        <div class="avatar-ring" :style="{ '--ring-color': accentColorAuto + '88' }">
                            <img :src="publicStreamer?.avatar_url || defaultAvatar" alt="Avatar"
                                class="w-20 h-20 rounded-full object-cover" />
                        </div>
                        <!-- Badge statut -->
                        <span v-if="!isLive"
                            class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap shadow-sm"
                            :style="{ backgroundColor: accentColorAuto + '88', color: isColorDark(accentColorAuto) ? '#fff' : '#000' }">
                            Offline
                        </span>
                    </div>
                    <div class="flex flex-col flex-1 min-w-0">
                        <span :class="['font-bold ', usernameSizeClass]" :style="{ color: usernameColor }">
                            {{ publicStreamer?.username }}
                        </span>
                        <span class="text-sm mt-1 break-words line-clamp-3" :style="{ color: descriptionColor }">
                            {{ publicStreamer?.bio }}
                        </span>
                    </div>
                </div>
                <!-- Prochain stream -->
                <div v-if="nextSlot && !isLive" class="flex items-center justify-between gap-3 px-4 py-2.5 border-t"
                    :style="{ borderColor: accentColorAuto + '22' }">
                    <span class="text-xs font-semibold flex-shrink-0" :style="{ color: buttonBackgroundColor }">
                        Prochain stream
                    </span>
                    <div class="flex items-center gap-2 min-w-0">
                        <div class="flex flex-col items-end min-w-0">
                            <span class="text-xs font-semibold truncate"
                                :style="{ color: isColorDark(wallpaperColor) ? '#fff' : '#000' }">
                                {{ nextSlot.game?.label ?? nextSlot.title }}
                            </span>
                            <span class="text-xs" :style="{ color: buttonBackgroundColor }">
                                {{ nextSlot.isToday ? 'Aujourd\'hui' : nextSlot.day }} - {{
                                    formatTime(nextSlot.start_at) }}
                            </span>
                        </div>
                        <img v-if="nextSlot.game?.cover" :src="nextSlot.game.cover"
                            class="w-6 h-8 rounded object-cover flex-shrink-0" />
                    </div>
                </div>

                <!-- En live -->
                <div v-if="isLive" class="relative z-10 flex items-center gap-3 px-5 py-3 border-t"
                    :style="{ borderColor: accentColorAuto + '22' }">
                    <span class="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 animate-pulse" />
                    <span class="text-sm font-semibold"
                        :style="{ color: isColorDark(wallpaperColor) ? '#fff' : '#000' }">En live</span>
                </div>
            </div>

            <!-- Switcher -->
            <div class="flex rounded-xl p-1 gap-1" :style="{ backgroundColor: bgColorAuto }">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" @mouseenter="hoveredTab = tab.id"
                    @mouseleave="hoveredTab = null"
                    class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
                    :style="activeTab === tab.id
                        ? { backgroundColor: accentColorAuto, color: isColorDark(accentColorAuto) ? '#fff' : '#000' }
                        : {
                            backgroundColor: hoveredTab === tab.id ? accentColorAuto + '18' : 'transparent',
                            color: isColorDark(wallpaperColor) ? '#fff' : '#000'
                        }">
                    <Icon :name="tab.icon" size="16" />
                    {{ tab.label }}
                </button>
            </div>

            <!-- Liste de liens -->
            <div v-if="activeTab === 'liens'" class="mt-2">
                <div v-if="publicLinks.length > 0" class="flex flex-col gap-4 w-full">
                    <div class="w-full mx-auto" v-for="link in publicLinks" :key="link.id">
                        <a :href="link.url" target="_blank">
                            <button :class="['relative flex items-center w-full font-semibold transition h-16',
                                link.icon_url ? 'px-3 py-3' : 'px-5 py-5', buttonClass, buttonRadiusClass]" :style="{
                                    backgroundColor: buttonVariant === 'outlined'
                                        ? hoveredLink === link.id ? buttonBorderColor + '18' : 'transparent'
                                        : buttonBackgroundColor,
                                    borderColor: buttonBorderColor
                                }" @mouseenter="hoveredLink = link.id" @mouseleave="hoveredLink = null">
                                <!-- Icône ou image à gauche -->
                                <div
                                    :class="['absolute flex items-center justify-center', link.icon_url ? 'left-3' : 'left-5']">
                                    <template v-if="link.icon_url">
                                        <img :src="link.icon_url"
                                            class="w-10 h-10 object-contain rounded flex-shrink-0" />
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
                <div v-else class="flex flex-col items-center gap-3 py-10 text-center">
                    <Icon name="lucide:link-2-off" size="36" :style="{ color: descriptionColor }" />
                    <p class="text-sm" :style="{ color: descriptionColor }">Aucun lien partagé pour l'instant.</p>
                </div>
            </div>

            <div v-if="activeTab === 'planning'" class="mt-2">
                <div v-if="groupedSlots.length > 0" class="flex flex-col gap-2">
                    <template v-for="(group, index) in groupedSlots" :key="group.day">
                        <!-- Séparateur de jour -->
                        <div class="flex items-center gap-3" :class="index === 0 ? 'mt-0' : 'mt-3'">
                            <span class="text-xs font-bold uppercase" :style="{ color: accentColorAuto }">
                                {{ formatDay(group.day) }} {{ formatDayNum(group.day) }}
                            </span>
                            <div class="flex-1 h-px" :style="{ backgroundColor: accentColorAuto + '33' }" />
                            <span v-if="group.isToday" class="text-xs font-bold px-2 py-0.5 rounded-full"
                                :style="{ backgroundColor: accentColorAuto + '22', color: accentColorAuto }">
                                Aujourd'hui
                            </span>
                        </div>

                        <!-- Slots — style fixe, indépendant du style bouton -->
                        <div v-for="slot in group.slots" :key="slot.id"
                            class="flex items-center gap-3 px-3 py-2 rounded-xl"
                            :style="{ backgroundColor: bgColorAuto }">
                            <img v-if="slot.game?.cover" :src="slot.game.cover"
                                class="w-10 h-14 rounded object-fill shadow-xs flex-shrink-0" />
                            <div class="flex flex-col flex-1 min-w-0 justify-center">
                                <span class="font-semibold text-sm truncate"
                                    :style="{ color: isColorDark(wallpaperColor) ? '#fff' : '#000' }">
                                    {{ slot.game?.label ?? slot.title }}
                                </span>
                                <span class="text-xs mt-1 flex items-center gap-1" :style="{ color: descriptionColor }">
                                    <Icon name="lucide:clock" size="12" />
                                    {{ formatTime(slot.start_at) }}
                                    <template v-if="slot.title">
                                        <span class="mx-1">·</span>
                                        {{ slot.title }}
                                    </template>
                                </span>
                            </div>
                        </div>
                    </template>
                </div>
                <div v-else class="flex flex-col items-center gap-3 py-10 text-center">
                    <Icon name="lucide:calendar-x" size="36" :style="{ color: descriptionColor }" />
                    <p class="text-sm" :style="{ color: descriptionColor }">Pas de stream prévu cette semaine.</p>
                </div>
            </div>

            <!-- Footer CTA -->
            <div class="flex justify-center my-12">
                <NuxtLink :to="'/admin/links'" external>
                    <button :class="['py-2.5 px-3 rounded-md font-semibold transition-all shadow-sm',
                        isColorDark(accentColorAuto) ? 'hover:brightness-110' : 'hover:brightness-90']" :style="{
                            backgroundColor: buttonBackgroundColor ? accentColorAuto : buttonBackgroundColor,
                            color: isColorDark(accentColorAuto) ? '#fff' : '#000'
                        }">
                        Rejoignez {{ publicStreamer?.username }} sur
                        StreamLink
                    </button>
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
        </div>
    </div>

    <!-- Page d’erreur si le streamer n’existe pas -->
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

const streamerStore = useStreamerStore()
const linkStore = useLinkStore()
const designStore = useDesignStore()
const scheduleStore = useScheduleStore()
const scheduleSlotStore = useScheduleSlotStore()
const { publicStreamer, loading } = storeToRefs(streamerStore)
const { publicLinks } = storeToRefs(linkStore)
const { publicDesign } = storeToRefs(designStore)
const { publicSchedule } = storeToRefs(scheduleStore)
const { publicSlots } = storeToRefs(scheduleSlotStore)
const route = useRoute()
const isLive = ref(false)

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png";

// Tabs
const tabs = [
    { id: 'liens', label: 'Liens', icon: 'lucide:link' },
    { id: 'planning', label: 'Planning', icon: 'lucide:calendar-days' },
]
const activeTab = ref('liens')

// Fonction de copie du lien
const copied = ref(false)
const copyText = () => {
    const url = `${window.location.origin}/${route.params.username || ''}`
    navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
}


onMounted(async () => {
    const username = route.params.username
    loading.value = true
    try {
        await streamerStore.fetchStreamerByUsername(username)
        await linkStore.fetchPublicLinks(publicStreamer.value.id)
        await designStore.fetchPublicDesign(publicStreamer.value.id)
        await scheduleStore.fetchPublicSchedule(publicStreamer.value.id)
        await scheduleSlotStore.fetchPublicSlots(publicSchedule.value.id)
    } finally {
        loading.value = false
    }
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
            `border border`,
        ]
    }

    // filled
    return [
        'border-none',
        isColorDark(buttonBackgroundColor.value) ? 'hover:brightness-105' : 'hover:brightness-95',
    ]
})

const hoveredLink = ref(null)
const hoveredTab = ref(null)

// Couleur de bordure pour les boutons outlined
const buttonBorderColor = computed(() => {
    const color = publicDesign.value?.button_style?.backgroundColor ?? 'FFFFFF'
    return buttonVariant.value === 'outlined' ? `#${color}` : null
})

// Couleur de fond pour les boutons filled
const buttonBackgroundColor = computed(() => {
    const color = publicDesign.value?.button_style?.backgroundColor ?? 'FFFFFF'
    return `#${color}`
})

// Couleur du texte des boutons
const buttonTextColor = computed(() => {
    const color = publicDesign.value?.button_style?.textColor ?? '000000'
    return `#${color}`
})

// Style de la bordure des boutons dynamique
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

// Couleur des boutons et du texte en fonction de la luminosité du fond
const fixedButtonColor = computed(() => {
    return isColorDark(wallpaperColor.value) ? 'text-white' : 'text-black'
})

// Couleur de fond des boutons en fonction de la luminosité du fond
const fixedButtonBg = computed(() => {
    return isColorDark(wallpaperColor.value) ? 'bg-zinc-800 hover:brightness-115' : 'bg-white hover:brightness-95'
})

// Couleur du texte du footer en fonction de la luminosité du fond
const footerTextColor = computed(() => {
    return isColorDark(wallpaperColor.value) ? '#FFFFFF' : '#000000'
})

const bgColorAuto = computed(() => isColorDark(wallpaperColor.value) ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
const accentColorAuto = computed(() => {
    const color = publicDesign.value?.button_style?.backgroundColor
    return `#${color}`
})

const DAY_LABELS = { lundi: 'Lun', mardi: 'Mar', mercredi: 'Mer', jeudi: 'Jeu', vendredi: 'Ven', samedi: 'Sam', dimanche: 'Dim' }
const DAY_INDEX = {
    dimanche: 0,
    lundi: 1,
    mardi: 2,
    mercredi: 3,
    jeudi: 4,
    vendredi: 5,
    samedi: 6
}
const groupedSlots = computed(() => {
    const today = new Date()
    const todayIndex = today.getDay()

    const groupsMap = {}

    for (const slot of publicSlots.value) {
        const normalizedDay = slot.day.toLowerCase()
        const targetIndex = DAY_INDEX[normalizedDay]

        const diff = (targetIndex - todayIndex + 7) % 7

        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + diff)

        const dateKey = targetDate.toISOString()

        if (!groupsMap[dateKey]) {
            groupsMap[dateKey] = {
                day: slot.day,
                date: targetDate,
                slots: [],
                isToday: diff === 0
            }
        }

        groupsMap[dateKey].slots.push(slot)
    }

    return Object.values(groupsMap).sort(
        (a, b) => a.date - b.date
    )
})

const formatDay = (day) => DAY_LABELS[day] ?? day.slice(0, 3).toUpperCase()
const formatDayNum = (day) => {
    const normalizedDay = day.toLowerCase()

    const today = new Date()
    const todayIndex = today.getDay()
    const targetIndex = DAY_INDEX[normalizedDay]

    if (targetIndex === undefined) return ''

    const diff = (targetIndex - todayIndex + 7) % 7

    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + diff)

    return targetDate.getDate()
}

function formatTime(time) {
    if (!time) return ''
    const [h, m] = time.split(':')
    return `${h}h${m}`
}

const nextSlot = computed(() => {
    const group = groupedSlots.value[0]
    if (!group) return null
    return { ...group.slots[0], isToday: group.isToday, day: group.day }
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

/* Ring avatar */
.avatar-ring {
    border-radius: 9999px;
    border: 3px solid var(--ring-color, rgba(255, 255, 255, 0.15));
}

.live-ring {
    border-color: rgba(255, 0, 0, 0.8);
}
</style>