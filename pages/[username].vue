<template>
    <div v-if="pending" class="flex justify-center items-center w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div class="min-h-full w-full fade-in sm:rounded-t-xl shadow-xl relative" v-else-if="user"
        :style="{ background: wallpaperColor }">

        <!-- Bouton de copie du lien -->
        <button @click="copyText"
            class="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 px-3 py-1.5 rounded-md transition-all"
            :class="copied ? 'text-green-400' : ''" :style="copied ? {} : {
                color: isColorDark(wallpaperColor) ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                backgroundColor: hoveredCopy ? (isColorDark(wallpaperColor) ? buttonBackgroundColor + '22' : buttonBackgroundColor + '44') : 'transparent'
            }" @mouseenter="hoveredCopy = true" @mouseleave="hoveredCopy = false">
            <Icon v-if="!copied" name="lucide:copy" size="14" class="shrink-0" />
            <Icon v-else name="lucide:check" size="14" class="shrink-0" />
            <span class="text-xs sm:text-sm">{{ copied ? 'Copié !' : 'Copier le lien' }}</span>
        </button>

        <!-- En-tête avec avatar, pseudo, description et statut live -->
        <div>
            <div class="flex items-center gap-3 sm:gap-4 px-5 py-8 sm:py-10 sm:px-7">
                <!-- Avatar -->
                <div class="relative flex-shrink-0">
                    <div class="avatar-ring"
                        :style="{ '--ring-color': isColorDark(wallpaperColor) ? buttonBackgroundColor + '88' : buttonBackgroundColor }">
                        <img :src="user?.avatar_url || defaultAvatar" alt="Avatar"
                            class="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover" />
                    </div>
                </div>
                <!-- Pseudo et description -->
                <div class="flex flex-col flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <span :class="['font-bold tracking-wide', usernameSizeClass]"
                            :style="{ color: usernameColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                            {{ user?.username }}
                        </span>
                    </div>
                    <span class="text-xs sm:text-sm mt-1 break-words line-clamp-5"
                        :style="{ color: descriptionColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                        {{ user?.bio }}
                    </span>
                </div>
            </div>

            <!-- Prochain stream -->
            <div v-if="nextSlot && !isLive" class="flex items-center gap-2 px-4 py-2.5 border-t border-b"
                :style="{ borderColor: isColorDark(wallpaperColor) ? buttonBackgroundColor + '22' : buttonBackgroundColor }">
                <div class="flex flex-row items-center gap-1.5">
                    <Icon name="lucide:calendar-clock" size="14" class="flex-shrink-0" :style="{ color: textColor }" />
                    <span class="text-xs sm:text-sm font-semibold flex-shrink-0"
                        :style="{ color: textColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                        Prochain stream
                    </span>
                </div>
                <div class="w-px h-8 sm:h-4 flex-shrink-0"
                    :style="{ backgroundColor: isColorDark(wallpaperColor) ? buttonBackgroundColor + '44' : buttonBackgroundColor }" />
                <div class="flex flex-col sm:flex-row sm:items-center min-w-0 flex-1">
                    <span class="text-xs sm:text-sm font-semibold truncate"
                        :style="{ color: textColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                        {{ nextSlot.game?.label }}
                    </span>
                    <span class="text-xs sm:text-sm sm:ml-auto sm:flex-shrink-0"
                        :style="{ color: textColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                        {{ nextSlot.isToday ? 'Auj.' : formatDay(nextSlot.day) }} {{ formatTime(nextSlot.start_at) }}
                    </span>
                </div>
            </div>

            <!-- En live -->
            <div v-if="isLive" class="flex items-center gap-2 px-4 sm:px-5 py-2.5 border-t border-b"
                :style="{ borderColor: isColorDark(wallpaperColor) ? buttonBackgroundColor + '22' : buttonBackgroundColor }">
                <span class="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 animate-pulse" />
                <span class="text-xs sm:text-sm font-semibold"
                    :style="{ color: textColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                    En live sur {{ liveGameLabel }}
                </span>
            </div>
            <!-- Aucun stream prévu -->
            <div v-else-if="!nextSlot && !isLive" class="flex items-center gap-2 px-4 sm:px-5 py-2.5 border-t border-b"
                :style="{ borderColor: isColorDark(wallpaperColor) ? buttonBackgroundColor + '22' : buttonBackgroundColor }">
                <div class="flex items-center gap-1.5">
                    <Icon name="lucide:calendar-x" size="14" class="flex-shrink-0" :style="{ color: textColor }" />
                    <span class="text-xs sm:text-sm font-semibold flex-shrink-0"
                        :style="{ color: textColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                        Aucun stream prévu ici cette semaine
                    </span>
                </div>
            </div>
        </div>

        <!-- Contenu principal avec switcher Liens / Planning -->
        <div class="flex flex-col space-y-8 px-5 sm:px-7 items-center mt-7">

            <!-- Switcher -->
            <div class="flex gap-1">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" @mouseenter="hoveredTab = tab.id"
                    @mouseleave="hoveredTab = null"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm sm:text-base font-medium transition-all"
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
            <div v-if="activeTab === 'liens'" class="w-full">
                <div v-if="links.length > 0" class="flex flex-col gap-4 w-full">
                    <div class="w-full mx-auto" v-for="link in links" :key="link.id">
                        <a :href="link.url" target="_blank" @click="trackLinkClick(link.id)" :class="['relative flex items-center w-full font-semibold transition h-16',
                            link.icon_url ? 'px-3 py-3' : 'px-5 py-5', buttonClass, buttonRadiusClass]" :style="{
                                backgroundColor: buttonVariant === 'outlined'
                                    ? hoveredLink === link.id ? buttonBorderColor + '18' : 'transparent'
                                    : buttonBackgroundColor,
                                borderColor: buttonBorderColor,
                                fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit'
                            }" @mouseenter="hoveredLink = link.id" @mouseleave="hoveredLink = null">
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
                        </a>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center gap-3 py-10 text-center">
                    <Icon name="lucide:link-2-off" size="36" :style="{ color: textColor }" />
                    <p class="text-sm" :style="{ color: textColor }">
                        Aucun lien partagé pour l'instant</p>
                </div>
            </div>

            <!-- Planning des streams -->
            <div v-if="activeTab === 'planning'" class="w-full">
                <div v-if="groupedSlots.length > 0" class="flex flex-col gap-2">
                    <template v-for="group in groupedSlots" :key="group.day">
                        <div class="flex items-start gap-2">
                            <!-- Jour -->
                            <span class="text-xs font-bold tracking-wide flex-shrink-0 w-8 text-center mt-2"
                                :style="{ color: textColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                                {{ group.isToday ? 'Auj.' : formatDay(group.day) }}
                            </span>
                            <div class="w-px self-stretch"
                                :style="{ backgroundColor: isColorDark(wallpaperColor) ? buttonBackgroundColor + '44' : buttonBackgroundColor }" />
                            <!-- Grid auto -->
                            <div class="flex-1 flex flex-col gap-1.5 min-w-0">
                                <div v-for="slot in group.slots" :key="slot.id"
                                    class="flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 rounded-lg"
                                    :style="{ backgroundColor: bgColorAuto }">
                                    <img v-if="slot.game?.cover" :src="slot.game.cover"
                                        class="w-5 h-7 sm:w-7 sm:h-10 rounded object-fill flex-shrink-0" />
                                    <span class="text-xs sm:text-sm font-semibold truncate flex-1"
                                        :style="{ color: textColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                                        {{ slot.game?.label }}
                                    </span>
                                    <span class="text-xs sm:text-sm flex-shrink-0"
                                        :style="{ color: textColor, fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : 'inherit' }">
                                        {{ formatTime(slot.start_at) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <div v-else class="flex flex-col items-center gap-3 py-10 text-center">
                    <Icon name="lucide:calendar-x" size="36" :style="{ color: textColor }" />
                    <p class="text-sm" :style="{ color: textColor }">
                        Aucun stream prévu ici cette semaine
                    </p>
                </div>
            </div>

            <!-- Footer CTA -->
            <div v-if="!noBranding" class="flex flex-col items-center gap-2">
                <p class="text-sm sm:text-base text-center font-semibold tracking-wide"
                    :style="{ color: textColor + 'CC' }">
                    Ton univers, en une page.
                </p>
                <NuxtLink :to="'/admin/links'">
                    <button :class="['py-2.5 px-5 rounded-lg font-semibold tracking-wide transition-all shadow-md text-sm sm:text-base group',
                        isColorDark(buttonBackgroundColor) ? 'hover:brightness-110' : 'hover:brightness-90']"
                        :style="{ backgroundColor: buttonBackgroundColor, color: isColorDark(buttonBackgroundColor) ? '#fff' : '#000' }">
                        Créer ma page comme
                        <span class="font-extrabold group-hover:underline">{{ user.username }}</span>
                    </button>
                </NuxtLink>
            </div>

            <!-- Footer infos -->
            <div class="flex flex-col items-center gap-3 pb-10 text-xs">
                <div class="flex items-center gap-2" :style="{ color: textColor }">
                    <a href="https://discord.gg/fVFguWc76b" class="hover:underline font-medium">
                        Contact
                    </a>
                    <span>•</span>
                    <NuxtLink to="/privacy" class="hover:underline font-medium">
                        Confidentialité
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Streamers similaires — fixed bas droite -->
        <div v-if="user && similarStreamers.length > 0"
            class="hidden sm:flex fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
            <div class="flex gap-2">
                <NuxtLink v-for="(s, i) in similarStreamers" :key="s.username" :to="`/${s.username}`" target="_blank"
                    class="relative group avatar-reveal" :style="{ animationDelay: `${i * 80}ms` }" v-tooltip.top="{
                        value: s.isLive
                            ? `<span class='font-semibold'>${s.username}</span><br><span class='opacity-70'>En live sur ${s.twitchGameName ?? s.nextSlot?.game?.label ?? ''}</span>`
                            : s.nextSlot?.isToday
                                ? `<span class='font-semibold'>${s.username}</span><br><span class='opacity-70'>Auj. ${s.nextSlot.start_at?.slice(0, 5).replace(':', 'h')} · ${s.nextSlot.game?.label ?? ''}</span>`
                                : s.nextSlot?.isTomorrow
                                    ? `<span class='font-semibold'>${s.username}</span><br><span class='opacity-70'>Demain · ${s.nextSlot.game?.label ?? ''}</span>`
                                    : s.nextSlot
                                        ? `<span class='font-semibold'>${s.username}</span><br><span class='opacity-70'>${s.nextSlot.day?.slice(0, 3)} · ${s.nextSlot.game?.label ?? ''}</span>`
                                        : `<span class='font-semibold'>${s.username}</span>`,
                        escape: false,
                        pt: { text: '!text-xs' }
                    }">
                    <img :src="s.avatar_url || defaultAvatar" :alt="s.username"
                        class="w-12 h-12 rounded-full object-cover border-2 transition-all duration-200 group-hover:scale-110"
                        :style="{ borderColor: textColor + '30', '--hover-color': textColor + '80' }" />
                    <span v-if="s.isLive"
                        class="absolute bottom-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"
                        :style="{ boxShadow: `0 0 0 2px ${wallpaperColor}` }" />
                </NuxtLink>
            </div>
            <span :style="{ color: textColor, animationDelay: '360ms' }"
                class="text-[12px] avatar-reveal similar-label">
                Streamers similaires
            </span>
        </div>
    </div>

    <!-- Page d’erreur si le user n’existe pas -->
    <template v-else>
        <div class="flex flex-col items-center text-center gap-6">
            <!-- Icône pour illustrer l'erreur -->
            <Icon name="lucide:info" size="48" />

            <!-- Message principal -->
            <h2 class="text-2xl font-bold">La page que vous cherchez n'existe pas</h2>

            <!-- Message secondaire -->
            <p class="text-gray-500 max-w-md">
                Cette page n'existe pas encore. Créez votre page maintenant et commencez à partager vos liens
                facilement
                !
            </p>

            <!-- Bouton CTA -->
            <NuxtLink :to="'/admin/links'">
                <button
                    class="py-2.5 px-5 rounded-lg font-semibold tracking-wide transition-all shadow-md text-sm sm:text-base group hover:brightness-90 bg-white text-black flex items-center gap-2">
                    <Icon name="lucide:plus" size="20" />
                    Créer ma page<span class="font-extrabold group-hover:underline">StreamLink</span>
                </button>
            </NuxtLink>
        </div>
    </template>
</template>

<script setup lang="ts">

definePageMeta({
    layout: 'public-page'
})

// Récupération des données du user public
const route = useRoute()
const { data: publicUser, pending } = await useFetch(`/api/streamers/${route.params.username}`)

// Données extraites pour faciliter l’accès dans le template
const user_id = publicUser.value?.user_id || null
const user = publicUser.value?.user || null
const design = publicUser.value?.design || null
const links = publicUser.value?.links ?? []
const slots = publicUser.value?.slots ?? []
const noBranding = computed(() => publicUser.value?.noBranding ?? false)

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

// Style du pseudo dynamique
const usernameSizeClass = computed(() => {
    const size = design.username_style?.size ?? 'normal'
    return size === 'medium' ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl'
})
const usernameColor = computed(() => {
    const color = design.username_style?.textColor ?? 'FFFFFF'
    return color ? `#${color}` : '#FFFFFF'
})

// Style de la description dynamique
const descriptionColor = computed(() => {
    const color = design.bio_style?.textColor ?? 'D4D4D8'
    return color ? `#${color}` : '#D4D4D8'
})

// Style des boutons dynamique
const buttonVariant = computed(() => design.button_style?.variant ?? 'filled')

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

// Couleur de bordure pour les boutons outlined
const buttonBorderColor = computed(() => {
    const color = design.button_style?.backgroundColor ?? 'FFFFFF'
    return buttonVariant.value === 'outlined' ? `#${color}` : null
})

// Couleur de fond pour les boutons filled
const buttonBackgroundColor = computed(() => {
    const color = design.button_style?.backgroundColor ?? 'FFFFFF'
    return `#${color}`
})

// Couleur du texte des boutons
const buttonTextColor = computed(() => {
    const color = design.button_style?.textColor ?? '000000'
    return `#${color}`
})

// Style de la bordure des boutons dynamique
const buttonRadiusClass = computed(() => {
    return design.button_style?.borderRadius ?? 'rounded-lg'
})

// Style du fond dynamique
const wallpaperColor = computed(() => {
    const color = design.wallpaper_style?.backgroundColor ?? '18181B'
    return `#${color}`
})

const fontFamily = computed(() => design.font_family ?? null)

// Fonction pour déterminer si le texte du footer et les boutons doivent être clairs ou sombres
function isColorDark(hex: string) {
    if (!hex) return true
    const c = hex.startsWith('#') ? hex.substring(1) : hex
    const r = parseInt(c.substr(0, 2), 16)
    const g = parseInt(c.substr(2, 2), 16)
    const b = parseInt(c.substr(4, 2), 16)
    // Perception de la luminosité
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 128
}

// Couleur de fond des éléments auto (prochain stream, planning) basée sur la luminosité du wallpaper
const bgColorAuto = computed(() => isColorDark(wallpaperColor.value) ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
// Couleur du texte basée sur la luminosité du wallpaper
const textColor = computed(() => isColorDark(wallpaperColor.value) ? '#FFFFFF' : '#000000')

// Logique de calcul du prochain stream et du statut live
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

// Regroupement des créneaux par jour à venir, en filtrant les créneaux déjà passés aujourd'hui
const groupedSlots = computed(() => {
    const today = new Date()
    const todayIndex = today.getDay()
    const now = new Date()
    const groupsMap: Record<string, any> = {}

    for (const slot of slots) {
        const normalizedDay = slot.day?.toLowerCase()
        if (!normalizedDay || !slot.start_at || !slot.end_at) continue

        const targetIndex = DAY_INDEX[normalizedDay]
        if (targetIndex === undefined) continue

        const rebase = (d: number) => d === 0 ? 7 : d
        const targetIndexRebased = rebase(targetIndex)
        const todayIndexRebased = rebase(todayIndex)
        if (targetIndexRebased < todayIndexRebased) continue

        const diff = targetIndexRebased - todayIndexRebased
        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + diff)

        // filtre des streams déjà terminés aujourd'hui
        if (diff === 0) {
            const [startH, startM] = slot.start_at.split(':').map(Number)
            const startDateTime = new Date(today)
            startDateTime.setHours(startH, startM, 0, 0)

            if (now >= startDateTime) continue
        }

        const dateKey = targetDate.toDateString()
        if (!groupsMap[dateKey]) {
            groupsMap[dateKey] = { day: slot.day, date: targetDate, slots: [], isToday: diff === 0 }
        }

        groupsMap[dateKey].slots.push(slot)
    }

    return Object.values(groupsMap).sort((a, b) => a.date.getTime() - b.date.getTime())
})

// Formatage du jour pour l’affichage (ex: lundi -> Lun.)
const formatDay = (day?: string) => day ? DAY_LABELS[day.toLowerCase()] ?? day.slice(0, 3) + '.' : ''

// Formatage de l’heure pour l’affichage (ex: 20:30 -> 20h30)
function formatTime(time: string) {
    if (!time) return ''
    const [h, m] = time.split(':')
    return `${h}h${m}`
}

// Recherche du prochain créneau à venir (le premier créneau du groupe le plus proche)
const nextSlot = computed(() => {
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    for (const group of groupedSlots.value) {
        for (const slot of group.slots) {
            if (group.isToday) {
                const [endH, endM] = slot.end_at.split(':').map(Number)
                if (endH * 60 + endM <= nowMinutes) continue
            }
            return { ...slot, isToday: group.isToday, day: group.day }
        }
    }
    return null
})

// Statut live Twitch
const twitchIsLive = ref(publicUser.value?.twitchLive?.isLive ?? false)
const twitchGameName = ref(publicUser.value?.twitchLive?.gameName ?? null)
const isLive = computed(() => twitchIsLive.value)
const liveGameLabel = computed(() => twitchGameName.value ?? '')

// Récupération de l’utilisateur courant pour le tracking (si connecté et différent du user de la page)
const supabase = useSupabaseClient()
const { data: { user: currentUser } } = await supabase.auth.getUser()

// Tracking des clics sur les liens
const trackLinkClick = async (linkId: string) => {
    if (user_id && currentUser?.id !== user_id) {
        await $fetch('/api/trackingStats/track', {
            method: 'POST',
            body: { userId: user_id, type: 'LINK_CLICK', linkId }
        })
    }
}

const similarStreamers = ref<any[]>([])
const STORAGE_KEY = `seen_similar_${user?.username}`
const MAX_SEEN = 20

onMounted(async () => {
    // Tracking de la visite de la page
    if (user_id && currentUser?.id !== user_id) {
        await $fetch('/api/trackingStats/track', {
            method: 'POST',
            body: { userId: user_id, type: 'PAGE_VIEW' }
        })
    }

    if (user?.username) {
        try {
            // Récupère les déjà vus
            const seen: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')

            // Passe les seen au serveur
            const data = await $fetch(`/api/streamers/similar/${user.username}`, {
                method: 'POST',
                body: { exclude: seen }
            }) as any[]

            similarStreamers.value = data

            // Mémorise les nouveaux affichés
            const newSeen = [...new Set([...seen, ...data.map((s: any) => s.username)])]
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSeen.slice(-MAX_SEEN)))
        } catch { }
    }
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
    border: 2px solid var(--ring-color, rgba(255, 255, 255, 0.15));
}

@media (min-width: 640px) {

    /* sm */
    .avatar-ring {
        border-width: 3px;
    }
}

.avatar-reveal {
    animation: avatarReveal 0.3s ease forwards;
    opacity: 0;
}

.similar-label {
    animation: similarLabelReveal 0.3s ease forwards;
    animation-delay: 360ms;
    opacity: 0;
}

@keyframes similarLabelReveal {
    from {
        opacity: 0;
        transform: translateY(4px);
    }

    to {
        opacity: 0.6;
        transform: translateY(0);
    }
}

@keyframes avatarReveal {
    from {
        opacity: 0;
        transform: scale(0.8);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>