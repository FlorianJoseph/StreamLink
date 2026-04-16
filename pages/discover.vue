<template>
    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center h-64">
        <ProgressSpinner
            style="width:50px;height:50px;--p-progressspinner-color-one:#FFFFFF;--p-progressspinner-color-two:#F8F9FA;--p-progressspinner-color-three:#E9ECEF;--p-progressspinner-color-four:#DEE2E6"
            strokeWidth="6" fill="transparent" animationDuration=".5s" />
    </div>

    <div v-else class="flex flex-col fade-in">
        <!-- ─── Header sticky ─── -->
        <div
            class="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 py-2 px-4 sm:px-6 flex flex-col gap-2">

            <!-- Row 1 : Recherche + Langue + Raid Assistant -->
            <div class="flex gap-2 w-full">
                <IconField class="flex-1">
                    <InputIcon>
                        <Icon name="lucide:search" size="16" class="text-gray-400" />
                    </InputIcon>
                    <InputText v-model="search" placeholder="Rechercher par nom" fluid size="small"
                        style="--p-inputtext-focus-border-color: #ffffff" />
                </IconField>
                <Select v-model="selectedLanguage" :options="languageOptions" optionLabel="label" optionValue="value"
                    placeholder="Langue" showClear size="small" :highlightOnSelect="false"
                    style="--p-select-focus-border-color: #ffffff; min-width: 130px">
                    <template #option="{ option }">
                        <div class="flex items-center gap-2">
                            <img v-if="option.flag" :src="`https://flagcdn.com/w40/${option.flag}.png`"
                                class="w-4 h-[12px] object-cover rounded-xs shadow-sm" />
                            <Icon v-else name="lucide:globe" size="16" />
                            <span class="text-sm">{{ option.label }}</span>
                        </div>
                    </template>
                    <template #value="{ value }">
                        <div v-if="value" class="flex items-center gap-2">
                            <img v-if="getFlag(value)" :src="`https://flagcdn.com/w40/${getFlag(value)}.png`"
                                class="w-4 h-[12px] object-cover rounded-xs shadow-sm" />
                            <Icon v-else name="lucide:globe" size="16" />
                            <span class="text-sm">{{ getLabel(value) }}</span>
                        </div>
                        <span v-else class="text-sm">Langue</span>
                    </template>
                </Select>
                <button v-if="user" @click="openRaidAssistant"
                    v-tooltip.bottom="{ value: !raidStatus.canRaidToday ? 'Tu as déjà raid aujourd\'hui' : raidStatus.remaining === 0 ? 'Plus de raids disponibles cette semaine' : 'Trouve un streamer compatible à raider', pt: { text: '!text-sm' } }"
                    :disabled="!raidStatus.canRaidToday || raidStatus.remaining === 0" :class="[
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all duration-150 whitespace-nowrap',
                        raidStatus.canRaidToday && raidStatus.remaining > 0
                            ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:border-yellow-500/50 cursor-pointer'
                            : 'bg-zinc-800 text-zinc-600 border-zinc-700/40 cursor-not-allowed'
                    ]">
                    <Icon name="lucide:swords" size="14" />
                    <span class="hidden sm:inline">Raid assistant</span>
                    <span class="flex items-center gap-0.5 text-[10px]"
                        :class="raidStatus.canRaidToday && raidStatus.remaining > 0 ? 'text-yellow-500/70' : 'text-zinc-600'">
                        <Icon name="lucide:coins" size="9" /> {{ raidStatus.remaining }}/{{ raidStatus.total }}
                    </span>
                </button>
            </div>

            <!-- Row 2 : Onglets + Compteur -->
            <div class="flex items-center justify-between gap-2">
                <div class="flex gap-0.5 overflow-x-auto scrollbar-hide">
                    <button v-for="f in filters" :key="f.key" @click="selectedFilter = f.key" :class="[
                        'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 whitespace-nowrap',
                        selectedFilter === f.key
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-purple-500/20'
                    ]">
                        <Icon :name="f.icon" size="14" />
                        {{ f.label }}
                        <span v-if="f.key === 'live' && liveCount > 0"
                            class="flex items-center justify-center w-4 h-4 rounded-full bg-red-500/30 text-red-300 text-[10px] font-bold">
                            {{ liveCount }}
                        </span>
                    </button>
                </div>
                <span class="hidden sm:block text-sm text-purple-300/80 whitespace-nowrap flex-shrink-0">
                    {{ filteredStreamers.length }} streamer{{ filteredStreamers.length > 1 ? 's' : '' }}
                </span>
            </div>

            <!-- Row 3 : Chips jeux -->
            <div v-if="availableGames.length > 0" class="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                <button v-for="game in availableGames" :key="game"
                    @click="selectedGame = selectedGame === game ? null : game" :class="[
                        'flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150',
                        selectedGame === game
                            ? 'bg-purple-500/20 text-purple-200 border-purple-500/40'
                            : 'text-zinc-400 border-zinc-700/60 hover:border-zinc-500 hover:text-zinc-200'
                    ]">
                    {{ game }}
                    <Icon v-if="selectedGame === game" name="lucide:x" size="10" />
                </button>
            </div>
        </div>

        <!-- ─── Content ─── -->
        <div class="py-6 flex flex-col gap-10">

            <!-- ─── Vue catégorie ─── -->
            <div v-if="selectedCategory" class="flex flex-col gap-6">
                <!-- Header -->
                <div class="px-8 sm:px-12 flex items-center gap-4">
                    <button @click="clearCategory"
                        class="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all duration-150 flex-shrink-0">
                        <Icon name="lucide:arrow-left" size="18" />
                    </button>
                    <h2 class="text-2xl font-bold text-white">{{ selectedCategory }}</h2>
                </div>
                <!-- Grille -->
                <div v-if="categoryStreamers.length > 0"
                    class="px-8 sm:px-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    <StreamerCard v-for="s in categoryStreamers" :key="s.username" :streamer="s" />
                </div>
                <div v-else class="flex flex-col items-center justify-center py-24 gap-3">
                    <Icon name="lucide:search-x" size="48" class="text-zinc-700" />
                    <p class="text-sm text-zinc-500">Aucun streamer dans cette catégorie</p>
                </div>
            </div>

            <!-- ─── Vue principale (rangées) ─── -->
            <template v-else>

                <!-- Top Raiders -->
                <section v-if="topRaiders.length > 0" class="flex flex-col gap-3">
                    <div class="flex items-center gap-3 px-8 sm:px-12">
                        <Icon name="lucide:trophy" size="18" class="text-yellow-400" />
                        <h2 class="text-xl font-bold text-white">Top Raiders cette semaine</h2>
                    </div>
                    <div class="flex gap-1 overflow-x-auto scrollbar-hide px-8 sm:px-12 py-2">
                        <NuxtLink v-for="(raider, idx) in topRaiders" :key="raider.username" :to="`/${raider.username}`"
                            target="_blank" class="flex items-end flex-shrink-0 group/raider">
                            <!-- Grand numéro -->
                            <span class="text-[82px] font-black leading-none select-none flex-shrink-0 w-12 text-right"
                                :style="{
                                    WebkitTextStroke: idx === 0 ? '3px rgba(234,179,8,0.55)' : idx === 1 ? '3px rgba(161,161,170,0.45)' : idx === 2 ? '3px rgba(194,120,50,0.45)' : '3px rgba(82,82,91,0.4)',
                                    color: 'transparent'
                                }">
                                {{ idx + 1 }}
                            </span>
                            <!-- Carte qui chevauche le numéro -->
                            <div
                                class="-ml-2 w-[88px] flex-shrink-0 rounded-xl overflow-hidden relative ring-1 ring-zinc-800 group-hover/raider:ring-zinc-500 transition-all duration-150">
                                <img :src="avatarUrl(raider.avatar_url, 128)"
                                    class="w-full aspect-[2/3] object-cover object-top" />
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                                <div class="absolute bottom-0 left-0 right-0 p-2">
                                    <p class="text-[11px] font-bold text-white truncate">{{ raider.username }}</p>
                                    <div class="flex items-center gap-1.5 mt-0.5">
                                        <span class="flex items-center gap-0.5 text-[10px] text-yellow-400">
                                            <Icon name="lucide:swords" size="9" />{{ raider.raidCount }}
                                        </span>
                                        <span class="flex items-center gap-0.5 text-[10px] text-yellow-400">
                                            <Icon name="lucide:coins" size="9" />{{ raider.coinsEarned }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                </section>

                <!-- ─── État vide ─── -->
                <div v-if="rows.length === 0" class="flex flex-col items-center justify-center py-24 gap-4 px-6">
                    <Icon name="lucide:search-x" size="56" class="text-zinc-700" />
                    <div class="text-center">
                        <h3 class="text-xl font-semibold text-white mb-2">Aucun streamer trouvé</h3>
                        <p class="text-sm text-zinc-500">{{ getEmptyStateMessage() }}</p>
                    </div>
                    <div class="flex flex-wrap justify-center gap-2 mt-2">
                        <Button v-if="search" @click="search = ''" severity="contrast" outlined size="small">
                            <Icon name="lucide:x" size="14" />
                            <span class="text-xs">Réinitialiser la recherche</span>
                        </Button>
                        <Button v-if="selectedGame" @click="selectedGame = null" severity="contrast" outlined
                            size="small">
                            <Icon name="lucide:filter-x" size="14" />
                            <span class="text-xs">Retirer le filtre jeu</span>
                        </Button>
                        <Button v-if="selectedFilter !== 'all'" @click="selectedFilter = 'all'" severity="contrast"
                            outlined size="small">
                            <Icon name="lucide:filter-x" size="14" />
                            <span class="text-xs">Retirer le filtre</span>
                        </Button>
                    </div>
                </div>

                <!-- ─── Rangées Netflix ─── -->
                <section v-for="row in displayedRows" :key="row.key" :id="`discover-row-${row.key}`"
                    class="flex flex-col gap-3">

                    <!-- En-tête de rangée -->
                    <div class="flex items-center gap-3 px-8 sm:px-12">
                        <span v-if="row.key === 'live'"
                            class="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                        <h2 class="text-xl font-bold text-white">{{ row.label }}</h2>
                    </div>

                    <!-- Cartes horizontales avec flèches overlay -->
                    <div class="relative group/row">

                        <!-- Flèche gauche -->
                        <Transition name="fade-arrow">
                            <button v-if="rowScrollState[row.key]?.canLeft" @click="scrollRow(row.key, 'left')" class="absolute left-0 top-0 bottom-2 z-30 w-12 sm:w-16 flex items-center justify-center
                                   opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 group/btn">
                                <span
                                    class="flex items-center justify-center w-full h-full rounded-r-md group-hover/btn:bg-zinc-950/45 transition-colors">
                                    <Icon name="lucide:chevron-left" size="52"
                                        class="text-white/80 group-hover/btn:scale-125 transition-transform drop-shadow-lg" />
                                </span>
                            </button>
                        </Transition>

                        <!-- Scroll container -->
                        <div :ref="(el: any) => setRowRef(row.key, el)"
                            class="flex gap-3 overflow-x-auto scrollbar-hide px-8 sm:px-12 pb-2">
                            <div v-for="s in rowStreamers(row)" :key="s.username"
                                v-memo="[s.username, s.nextSlot?.isLive, s.nextSlot?.twitchViewerCount]"
                                class="flex-shrink-0 w-[312px] sm:w-[336px]">
                                <StreamerCard :streamer="s" />
                            </div>

                            <!-- Tile "Voir tout" -->
                            <div v-if="rowHasMore(row)" @click="goToCategory(row.label)"
                                class="flex-shrink-0 w-[312px] sm:w-[336px] rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 group/expand"
                                :style="{ minHeight: '220px' }">
                                <div
                                    class="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-800 group-hover/expand:border-zinc-500 group-hover/expand:bg-zinc-700 flex items-center justify-center transition-all duration-200">
                                    <Icon name="lucide:grid-2x2-plus" size="22"
                                        class="text-zinc-400 group-hover/expand:text-white transition-colors" />
                                </div>
                                <div class="flex flex-row items-center gap-1">
                                    <p class="text-sm font-semibold text-white">Voir tout</p>
                                    <Icon name="lucide:chevron-right" size="16"
                                        class="text-zinc-600 group-hover/expand:text-zinc-400 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <!-- Flèche droite -->
                        <Transition name="fade-arrow">
                            <button v-if="rowScrollState[row.key]?.canRight" @click="scrollRow(row.key, 'right')" class="absolute right-0 top-0 bottom-2 z-30 w-12 sm:w-16 flex items-center justify-center
                                   opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 group/btn">
                                <span
                                    class="flex items-center justify-center w-full h-full rounded-l-md group-hover/btn:bg-zinc-950/65 transition-colors">
                                    <Icon name="lucide:chevron-right" size="52"
                                        class="text-white/80 group-hover/btn:scale-125 transition-transform drop-shadow-lg" />
                                </span>
                            </button>
                        </Transition>

                    </div>

                </section>

                <!-- Sentinel infinite scroll -->
                <div ref="sentinelRef" class="h-4" />

            </template> <!-- fin vue principale -->
        </div>
    </div>

    <!-- ═══ MODALE RAID ASSISTANT ═══ -->
    <Dialog v-model:visible="raidAssistantOpen" modal :draggable="false" :style="{ width: '26rem', margin: '1rem' }"
        :pt="{ header: { style: 'display:none' } }">
        <template #container>

            <div v-if="raidAssistantStep === 'countdown'" class="flex flex-col gap-4 p-6">
                <div class="flex items-center gap-3">
                    <img :src="avatarUrl(selectedSuggestion?.avatar_url, 64)"
                        class="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700" />
                    <div>
                        <p class="font-semibold text-white text-sm">Raid en cours vers {{
                            selectedSuggestion?.username }}</p>
                        <p class="text-xs text-zinc-400">{{ raidAssistantCountdown }}s restantes</p>
                    </div>
                </div>
                <div class="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div class="h-full bg-yellow-500 rounded-full transition-all duration-500"
                        :style="{ width: `${(raidAssistantCountdown / 15) * 100}%` }" />
                </div>
                <p class="text-xs text-zinc-500 text-center">Tes Coins seront crédités dans {{
                    raidAssistantCountdown }}s</p>
                <button @click="cancelRaidAssistant"
                    class="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    Annuler le raid
                </button>
            </div>

            <div v-else-if="raidAssistantStep === 'confirm'" class="flex flex-col gap-5 p-6">
                <button @click="raidAssistantStep = 'list'"
                    class="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors w-fit">
                    <Icon name="lucide:arrow-left" size="14" /> Retour aux suggestions
                </button>
                <div class="flex items-center gap-3">
                    <img :src="avatarUrl(selectedSuggestion?.avatar_url, 64)"
                        class="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700" />
                    <div>
                        <p class="font-semibold text-white text-sm">{{ selectedSuggestion?.username }}</p>
                        <p class="text-xs text-zinc-400">{{ selectedSuggestion?.twitchGameName ||
                            selectedSuggestion?.nextSlot?.game?.label || '—' }}</p>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <p class="text-sm text-white font-medium">Lancer un raid vers {{ selectedSuggestion?.username }}
                        ?</p>
                    <p class="text-xs text-zinc-400">Tes viewers seront redirigés vers sa chaîne Twitch.</p>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <Icon name="lucide:coins" size="16" class="text-yellow-400 flex-shrink-0" />
                    <span class="text-sm text-yellow-300 font-medium">+{{ raidAssistantCoins }} Coins</span>
                    <span class="text-xs text-zinc-500 ml-auto">{{ raidStatus.remaining }}/{{ raidStatus.total }}
                        raids restants</span>
                </div>
                <div class="flex gap-2">
                    <Button severity="secondary" outlined @click="raidAssistantOpen = false" class="flex-1">
                        <Icon name="lucide:x" size="18" class="shrink-0" />
                        <span class="text-sm shrink-0">Annuler</span>
                    </Button>
                    <Button severity="contrast" @click="confirmRaidAssistant" :loading="raidAssistantLoading"
                        class="flex-1">
                        <Icon name="lucide:swords" size="18" class="shrink-0" />
                        <span class="text-sm shrink-0">Raid</span>
                    </Button>
                </div>
            </div>

            <div v-else class="flex flex-col gap-0">
                <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                    <div class="flex items-center gap-2">
                        <Icon name="lucide:swords" size="18" class="text-yellow-400" />
                        <span class="font-semibold text-white text-sm">Raid Assistant</span>
                    </div>
                    <button @click="raidAssistantOpen = false"
                        class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
                        <Icon name="lucide:x" size="16" />
                    </button>
                </div>
                <div class="px-5 py-3 border-b border-zinc-800">
                    <p class="text-xs text-zinc-400">Streamers compatibles avec ton profil en live en ce moment</p>
                </div>
                <div v-if="raidSuggestionsLoading" class="flex justify-center py-10">
                    <ProgressSpinner style="width:36px;height:36px;--p-progressspinner-color-one:#FFFFFF"
                        strokeWidth="6" fill="transparent" animationDuration=".5s" />
                </div>
                <div v-else-if="raidSuggestions.length === 0"
                    class="flex flex-col items-center gap-3 py-10 px-5 text-center">
                    <Icon name="lucide:tv-minimal-play" size="40" class="text-zinc-600" />
                    <p class="text-sm text-zinc-400">Aucun streamer compatible en live en ce moment</p>
                    <Button @click="selectedFilter = 'live'; raidAssistantOpen = false" severity="secondary" outlined
                        size="small">
                        <Icon name="lucide:radio" size="14" />
                        <span class="text-xs">Voir les lives</span>
                    </Button>
                </div>
                <div v-else class="flex flex-col divide-y divide-zinc-800">
                    <div v-for="s in raidSuggestions" :key="s.username"
                        class="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/50 transition-colors">
                        <img :src="avatarUrl(s.avatar_url, 64)"
                            class="w-9 h-9 rounded-xl object-cover ring-1 ring-zinc-700 flex-shrink-0" />
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-1.5">
                                <span class="text-sm font-semibold text-white truncate">{{ s.username }}</span>
                                <span class="flex items-center gap-1 text-[10px] text-zinc-500">
                                    <Icon name="lucide:eye" size="10" />{{ s.twitchViewerCount ?? '—' }}
                                </span>
                            </div>
                            <p class="text-xs text-zinc-400 truncate">{{ s.twitchGameName || '—' }}</p>
                        </div>
                        <button @click="selectSuggestion(s)" :disabled="!canRaidSuggestion(s)"
                            v-tooltip.left="{ value: raidSuggestionTooltip(s), pt: { text: '!text-sm' } }" :class="[
                                'flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all duration-150',
                                canRaidSuggestion(s)
                                    ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30 cursor-pointer'
                                    : 'bg-zinc-800 text-zinc-600 border-zinc-700/40 cursor-not-allowed'
                            ]">
                            <Icon name="lucide:swords" size="12" />
                            Raid
                        </button>
                    </div>
                </div>
                <div class="px-5 py-3 border-t border-zinc-800">
                    <p class="text-xs text-zinc-600 text-center">Basé sur tes jeux et tes horaires de stream</p>
                </div>
            </div>

        </template>
    </Dialog>

</template>

<script setup lang="ts">
import { getGameCategory } from '~/utils/categories'
import { languageOptions, getFlag, getLabel } from '~/utils/language'
import { avatarUrl } from '~/utils/avatar'

definePageMeta({ layout: 'discover' })

const defaultAvatar = "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png"

// ─── Core state ───────────────────────────────────────────────────────────────
const search = ref('')
const loading = ref(true)
const { streamers, fetchStreamersWithNextSlot } = useDiscoverStreamers()
const selectedFilter = ref('all')
const selectedLanguage = ref(null)
const selectedGame = ref<string | null>(null)

const filters = [
    { key: 'all', label: 'Tous', icon: 'lucide:layout-grid' },
    { key: 'live', label: 'En live', icon: 'lucide:radio' },
    { key: 'today', label: 'Aujourd\'hui', icon: 'lucide:calendar' },
    { key: 'future', label: 'À venir', icon: 'lucide:clock' },
]

// ─── Catégorie d'un streamer (IGDB en priorité, regex en fallback) ────────────
function streamerCategory(s: any): string | null {
    // 1. Catégorie IGDB enrichie côté serveur (live uniquement)
    if (s.nextSlot?.twitchGameCategory) return s.nextSlot.twitchGameCategory
    // 2. Catégorie dérivée du jeu planifié (non-live)
    const gameName = s.nextSlot?.twitchGameName ?? s.nextSlot?.game?.label ?? null
    return getGameCategory(gameName)
}

// ─── Jeux disponibles ─────────────────────────────────────────────────────────
const availableGames = computed(() => {
    const games = new Set<string>()
    for (const s of streamers.value) {
        if (s.nextSlot?.isLive && s.nextSlot?.twitchGameName) games.add(s.nextSlot.twitchGameName)
        else if (s.nextSlot?.game?.label) games.add(s.nextSlot.game.label)
    }
    return [...games].sort()
})

// ─── Filtrage ─────────────────────────────────────────────────────────────────
function matchesGame(s: any, game: string) {
    const liveGame = s.nextSlot?.twitchGameName?.toLowerCase()
    const schedGame = s.nextSlot?.game?.label?.toLowerCase()
    return liveGame === game.toLowerCase() || schedGame === game.toLowerCase()
}

const filteredStreamers = computed(() => {
    const today = new Date().getDay()
    return streamers.value.filter(s => {
        if (selectedFilter.value === 'live' && !s.nextSlot?.isLive) return false
        if (selectedFilter.value === 'today' && (!s.nextSlot || s.nextSlot.slotDate?.getDay() !== today || s.nextSlot.isLive)) return false
        if (selectedFilter.value === 'future' && (!s.nextSlot || s.nextSlot.isLive || s.nextSlot.slotDate?.getDay() === today)) return false
        if (selectedLanguage.value && s.language !== selectedLanguage.value) return false
        if (selectedGame.value && !matchesGame(s, selectedGame.value)) return false
        if (search.value && !s.username.toLowerCase().includes(search.value.toLowerCase())) return false
        return true
    })
})

const liveCount = computed(() => streamers.value.filter(s => s.nextSlot?.isLive).length)

// Catégories affichées sur la page d'accueil (dans cet ordre)
const HOME_CATEGORIES = ['Aventure', 'Battle Royale', 'FPS', 'Horreur', 'MMO', 'RPG', 'Simulation', 'Survie'] as const

// ─── Rangées Netflix ──────────────────────────────────────────────────────────
const rows = computed(() => {
    const result: { key: string; label: string; streamers: any[] }[] = []
    const all = filteredStreamers.value

    // Rangée live en premier
    const live = all.filter(s => s.nextSlot?.isLive)
    if (live.length > 0) result.push({ key: 'live', label: 'En live', streamers: live })

    // Rangées par catégories fixes (hors filtre live)
    if (selectedFilter.value !== 'live') {
        const nonLive = all.filter(s => !s.nextSlot?.isLive)
        for (const cat of HOME_CATEGORIES) {
            const catStreamers = nonLive.filter(s => streamerCategory(s) === cat)
            if (catStreamers.length > 0) result.push({ key: cat, label: cat, streamers: catStreamers })
        }
    }

    return result
})

// ─── Chargement progressif des rangées ───────────────────────────────────────
const ROWS_PER_PAGE = 3
const ROW_PREVIEW = 6
const visibleRowCount = ref(ROWS_PER_PAGE)
const displayedRows = computed(() => rows.value.slice(0, visibleRowCount.value))
const hasMoreRows = computed(() => visibleRowCount.value < rows.value.length)

// Reset au changement de filtre
watch([selectedFilter, selectedLanguage, selectedGame, search], () => {
    visibleRowCount.value = ROWS_PER_PAGE
})

// Sentinel infinite scroll (root = <main> pour que ça marche avec overflow-y-auto)
const sentinelRef = ref<HTMLElement | null>(null)

onMounted(() => {
    const mainEl = document.querySelector('main')
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && hasMoreRows.value) {
                visibleRowCount.value += ROWS_PER_PAGE
            }
        },
        { root: mainEl, rootMargin: '300px' }
    )
    watch(sentinelRef, (el) => {
        if (el) observer.observe(el)
    }, { immediate: true })
    onUnmounted(() => observer.disconnect())
})

// ─── Preview par rangée + navigation catégorie ────────────────────────────────
const route = useRoute()
const router = useRouter()

const selectedCategory = computed(() => route.query.category as string || null)

const categoryStreamers = computed(() => {
    if (!selectedCategory.value) return []
    return filteredStreamers.value.filter(s => {
        const cat = streamerCategory(s)
        if (selectedCategory.value === 'Autres') return !cat
        return cat === selectedCategory.value
    })
})

function goToCategory(label: string) {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' })
    router.push({ query: { ...route.query, category: label } })
}

function clearCategory() {
    const q = { ...route.query }
    delete q.category
    router.push({ query: q })
}

function rowStreamers(row: any) {
    const limit = row.key === 'live' ? ROW_PREVIEW + 2 : ROW_PREVIEW
    return row.streamers.slice(0, limit)
}

function rowHasMore(row: any) {
    const limit = row.key === 'live' ? ROW_PREVIEW + 2 : ROW_PREVIEW
    return row.streamers.length > limit
}

// ─── Scroll horizontal par rangée ─────────────────────────────────────────────
const rowScrollRefs: Record<string, HTMLElement> = {}

const rowScrollState = ref<Record<string, { canLeft: boolean; canRight: boolean }>>({})

function updateScrollState(key: string) {
    const el = rowScrollRefs[key]
    if (!el) return
    rowScrollState.value[key] = {
        canLeft: el.scrollLeft > 1,
        canRight: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    }
}

function setRowRef(key: string, el: any) {
    if (!el) return
    rowScrollRefs[key] = el
    el.addEventListener('scroll', () => updateScrollState(key), { passive: true })
    nextTick(() => updateScrollState(key))
}

function scrollRow(key: string, dir: 'left' | 'right') {
    const el = rowScrollRefs[key]
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 420 : -420, behavior: 'smooth' })
}

// ─── Top Raiders ──────────────────────────────────────────────────────────────
const topRaiders = ref<any[]>([])
const topRaidersLoading = ref(false)

async function fetchTopRaiders() {
    topRaidersLoading.value = true
    try { topRaiders.value = await $fetch<any[]>('/api/raids/top-weekly') }
    finally { topRaidersLoading.value = false }
}

// ─── Raid Assistant ───────────────────────────────────────────────────────────
const user = useSupabaseUser()
const streamerStore = useStreamerStore()
const { streamer: currentStreamer } = storeToRefs(streamerStore)
const { raidStatus, fetchStatus } = useRaidStatus()
const { fetchBalance } = useWallet()
const toast = useToast()

const raidAssistantOpen = ref(false)
const raidSuggestions = ref<any[]>([])
const raidSuggestionsLoading = ref(false)
const selectedSuggestion = ref<any | null>(null)
const raidAssistantStep = ref<'list' | 'confirm' | 'countdown'>('list')
const raidAssistantLoading = ref(false)
const raidAssistantCountdown = ref(15)
const raidAssistantEarnedCoins = ref(0)
let raidAssistantInterval: ReturnType<typeof setInterval> | null = null

const raidAssistantCoins = computed(() => {
    const v = selectedSuggestion.value?.twitchViewerCount ?? 0
    if (v < 5) return 7
    if (v < 15) return 6
    if (v < 50) return 5
    if (v < 150) return 4
    return 3
})

function canRaidSuggestion(s: any) {
    if (!user.value) return false
    if (!raidStatus.value.canRaidToday) return false
    if (currentStreamer.value?.username?.toLowerCase() === s.username?.toLowerCase()) return false
    if (raidStatus.value.raidedThisWeek?.includes(s.username?.toLowerCase())) return false
    return raidStatus.value.remaining > 0
}

function raidSuggestionTooltip(s: any) {
    if (!user.value) return 'Connecte-toi pour raid'
    if (currentStreamer.value?.username?.toLowerCase() === s.username?.toLowerCase()) return 'Tu ne peux pas te raid toi-même'
    if (!raidStatus.value.canRaidToday) return 'Tu as déjà raid aujourd\'hui'
    if (raidStatus.value.remaining === 0) return 'Limite de raids atteinte cette semaine'
    if (raidStatus.value.raidedThisWeek?.includes(s.username?.toLowerCase())) return 'Tu as déjà raid ce streamer cette semaine'
    return `Raider ${s.username}`
}

async function openRaidAssistant() {
    raidAssistantOpen.value = true
    raidAssistantStep.value = 'list'
    selectedSuggestion.value = null
    raidSuggestions.value = []
    raidSuggestionsLoading.value = true
    try {
        const username = currentStreamer.value?.username
        if (!username) { raidSuggestionsLoading.value = false; return }
        const results = await $fetch<any[]>(`/api/streamers/similar/${username}`, {
            method: 'POST',
            body: { exclude: [] }
        })
        raidSuggestions.value = results.filter((s: any) => s.isLive)
    } finally {
        raidSuggestionsLoading.value = false
    }
}

function selectSuggestion(s: any) {
    selectedSuggestion.value = s
    raidAssistantStep.value = 'confirm'
}

async function confirmRaidAssistant() {
    if (!selectedSuggestion.value) return
    raidAssistantLoading.value = true
    try {
        const { coinsEarned } = await $fetch<{ success: boolean; coinsEarned: number; raidedViaApi: boolean }>('/api/raids/create', {
            method: 'POST',
            body: { targetUsername: selectedSuggestion.value.username, coinsEarned: raidAssistantCoins.value }
        })
        raidStatus.value.remaining--
        raidStatus.value.used++
        raidStatus.value.canRaidToday = false
        raidStatus.value.raidedThisWeek = [...(raidStatus.value.raidedThisWeek ?? []), selectedSuggestion.value.username.toLowerCase()]
        raidAssistantStep.value = 'countdown'
        raidAssistantCountdown.value = 15
        raidAssistantEarnedCoins.value = coinsEarned
        raidAssistantInterval = setInterval(async () => {
            raidAssistantCountdown.value--
            if (raidAssistantCountdown.value <= 0) {
                clearInterval(raidAssistantInterval!)
                raidAssistantOpen.value = false
                await fetchBalance()
                toast.add({ severity: 'secondary', summary: 'Raid lancé !', detail: `${raidAssistantEarnedCoins.value}`, group: 'quest', life: 4000 })
            }
        }, 1000)
    } catch (err: any) {
        toast.add({ severity: 'warn', summary: 'Raid impossible', detail: err?.data?.message ?? 'Une erreur est survenue', group: 'app', life: 4000 })
    } finally {
        raidAssistantLoading.value = false
    }
}

async function cancelRaidAssistant() {
    clearInterval(raidAssistantInterval!)
    await $fetch('/api/raids/cancel', { method: 'POST' }).catch(() => { })
    raidStatus.value.remaining++
    raidStatus.value.used--
    raidStatus.value.canRaidToday = true
    if (selectedSuggestion.value) {
        raidStatus.value.raidedThisWeek = raidStatus.value.raidedThisWeek?.filter(
            (u: string) => u !== selectedSuggestion.value.username.toLowerCase()
        ) ?? []
    }
    raidAssistantStep.value = 'list'
    raidAssistantCountdown.value = 15
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function getEmptyStateMessage() {
    if (search.value) return `Aucun résultat pour "${search.value}"`
    if (selectedGame.value) return `Aucun streamer ne joue à ${selectedGame.value} en ce moment`
    if (selectedFilter.value === 'live') return 'Aucun stream en direct pour le moment'
    if (selectedFilter.value === 'today') return 'Aucun stream prévu aujourd\'hui'
    if (selectedFilter.value === 'future') return 'Aucun stream à venir pour le moment'
    return 'Aucun streamer disponible pour le moment'
}

// ─── Init ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
    loading.value = true
    try {
        await fetchStreamersWithNextSlot()
    } finally {
        loading.value = false
    }
    await Promise.all([
        fetchTopRaiders(),
        user.value ? fetchStatus() : Promise.resolve(),
    ])
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.fade-in {
    animation: fadeIn 0.3s ease forwards;
    opacity: 0;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}

.fade-arrow-enter-active,
.fade-arrow-leave-active {
    transition: opacity 0.15s ease;
}

.fade-arrow-enter-from,
.fade-arrow-leave-to {
    opacity: 0;
}
</style>