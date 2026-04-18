<template>
    <div class="relative w-full">
        <div
            class="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors duration-200">

            <!-- ── Thumbnail 16/9 ── -->
            <div class="relative aspect-video overflow-hidden bg-zinc-800">
                <template v-if="isLive && thumbnailUrl">
                    <!-- Vrai thumbnail Twitch en live (redimensionné) -->
                    <img :src="thumbnailUrl" class="absolute inset-0 w-full h-full object-cover" loading="lazy"
                        decoding="async" />
                    <!-- Titre du stream en overlay bas -->
                    <div
                        class="absolute inset-x-0 bottom-0 z-20 px-2.5 pb-2 pt-6 bg-gradient-to-t from-zinc-950 to-transparent">
                        <p class="text-[11px] text-white font-medium leading-tight line-clamp-2">{{
                            streamer.nextSlot?.twitchTitle }}</p>
                    </div>
                </template>
                <template v-else>
                    <!-- Fond : jaquette flouée ou dégradé -->
                    <img v-if="gameCover" :src="gameCoverTiny"
                        class="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-30" loading="lazy"
                        decoding="async" />
                    <div v-else class="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />

                    <!-- Avatar centré -->
                    <div class="relative z-10 flex items-center justify-center h-full">
                        <img :src="avatarUrl(streamer.avatar_url, 128)"
                            class="w-16 h-16 rounded-full object-cover shadow-2xl ring-2 ring-white/15" loading="lazy"
                            decoding="async" />
                    </div>

                    <!-- Jaquette bas droite -->
                    <div v-if="gameCover" class="absolute bottom-2 right-2 z-20">
                        <img :src="gameCoverSmall"
                            class="h-14 w-10 rounded-md object-fill shadow-lg ring-1 ring-white/10" loading="lazy"
                            decoding="async" />
                    </div>

                    <!-- Dégradé bas -->
                    <div class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                </template>

                <!-- Badge live -->
                <div v-if="isLive"
                    class="absolute top-2 left-2 z-20 flex items-center bg-red-600 text-white text-xs font-bold px-1.25 py-0.25 rounded uppercase tracking-wide">
                    live
                </div>
                <!-- Viewers + Coins -->
                <div v-if="isLive" class="absolute top-2 right-2 z-20 flex items-center gap-1">
                    <div v-if="twitchViewerCount !== null"
                        class="flex items-center gap-1 text-sm px-1.25 py-0.25 rounded"
                        :style="{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }">
                        <Icon name="lucide:eye" size="12" />{{ twitchViewerCount }}
                    </div>
                    <div
                        class="flex items-center gap-1 bg-yellow-500 text-zinc-900 text-sm font-bold px-1.25 py-0.25 rounded">
                        <Icon name="lucide:coins" size="12" />+{{ raidCoins }}
                    </div>
                </div>
                <div v-if="whenLabel"
                    class="absolute top-2 right-2 z-20 flex items-center gap-1 text-sm px-1.25 py-0.25 rounded"
                    :style="{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }">
                    {{ whenLabel }}
                </div>
                <!-- Badge catégorie (offline) -->
                <span v-if="categoryBadge && !isLive"
                    class="absolute top-2 left-2 z-20 flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md font-medium border"
                    :class="categoryBadgeClass">
                    <Icon :name="categoryBadgeIcon" size="10" /> {{ categoryBadge }}
                </span>
            </div>

            <!-- ── Infos + CTA ── -->
            <div class="p-3 flex flex-col gap-3">

                <!-- Username + jeu -->
                <div class="flex items-center gap-2.5 min-w-0">
                    <img :src="avatarUrl(streamer.avatar_url, 32)"
                        class="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-zinc-700/80" loading="lazy"
                        decoding="async" />
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5 min-w-0">
                            <span class="font-semibold text-white text-sm truncate">{{ streamer.username }}</span>
                        </div>
                        <p class="text-xs text-zinc-500 truncate mt-0.5">
                            {{ gameLabel || '—' }}
                        </p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2">

                    <!-- CTA principal -->
                    <button v-if="isLive" @click="openPlayer(props.streamer)"
                        class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white hover:bg-zinc-200 text-zinc-900 font-bold text-sm transition-all duration-150">
                        <Icon name="lucide:play" size="20" class="flex-shrink-0 fill-zinc-900" />
                        Regarder
                    </button>
                    <NuxtLink v-else :to="`/${streamer.username}`" target="_blank"
                        class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white hover:bg-zinc-200 text-zinc-900 font-bold text-sm transition-all duration-150 no-underline">
                        <Icon name="lucide:user" size="20" class="flex-shrink-0" />
                        Voir le profil
                    </NuxtLink>

                    <!-- Profil (si live) -->
                    <NuxtLink v-if="isLive" :to="`/${streamer.username}`" target="_blank"
                        v-tooltip.top="{ value: 'Profil', pt: { text: '!text-xs' } }"
                        class="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all duration-150 no-underline">
                        <Icon name="lucide:user" size="20" />
                    </NuxtLink>

                    <!-- Twitch (si offline) -->
                    <a v-if="!isLive" :href="`https://twitch.tv/${streamer.username}`" target="_blank"
                        rel="noopener noreferrer" v-tooltip.top="{ value: 'Voir sur Twitch', pt: { text: '!text-xs' } }"
                        class="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all duration-150">
                        <Icon name="simple-icons:twitch" size="20" />
                    </a>

                    <!-- Raid (si live) -->
                    <button v-if="isLive" @click="openRaidFor(props.streamer)" :disabled="!canRaid"
                        v-tooltip.top="{ value: raidTooltip, pt: { text: '!text-xs' } }" :class="['w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-150',
                            canRaid
                                ? 'bg-white hover:bg-zinc-200 text-zinc-900 border-white cursor-pointer'
                                : 'bg-zinc-800 text-zinc-600 border-zinc-700/40 cursor-not-allowed']">
                        <Icon name="lucide:swords" size="20" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { avatarUrl } from '~/utils/avatar'

const streamerStore = useStreamerStore()
const { streamer: currentStreamer } = storeToRefs(streamerStore)

const props = defineProps({
    streamer: { type: Object, required: true }
})

const user = useSupabaseUser()
const { raidStatus } = useRaidStatus()
const { openPlayer } = usePlayerModal()
const { openRaidFor } = useRaidModal()

// ── Raid ──────────────────────────────────────────────────────────────────────
const canRaid = computed(() => {
    if (!user.value) return false
    if (!isLive.value) return false
    if (!raidStatus.value.canRaidToday) return false
    if (currentStreamer.value?.username?.toLowerCase() === props.streamer.username?.toLowerCase()) return false
    if (raidStatus.value.raidedThisWeek?.includes(props.streamer.username?.toLowerCase())) return false
    return raidStatus.value.remaining > 0
})

const raidCoins = computed(() => {
    const v = twitchViewerCount.value ?? 0
    if (v < 5) return 7
    if (v < 15) return 6
    if (v < 50) return 5
    if (v < 150) return 4
    return 3
})

const raidTooltip = computed(() => {
    if (!user.value) return 'Connecte-toi pour raid'
    if (!isLive.value) return 'Le streamer doit être en live'
    if (currentStreamer.value?.username?.toLowerCase() === props.streamer.username?.toLowerCase()) return 'Tu ne peux pas te raid toi-même'
    if (!raidStatus.value.canRaidToday) return 'Tu as déjà raid aujourd\'hui'
    if (raidStatus.value.remaining === 0) return 'Limite de raids atteinte cette semaine'
    if (raidStatus.value.raidedThisWeek?.includes(props.streamer.username?.toLowerCase())) return 'Tu as déjà raid ce streamer cette semaine'
    return `Raid ${props.streamer.username} et gagner ${raidCoins.value} Coins`
})

// ── Stream infos ──────────────────────────────────────────────────────────────
const isLive = computed(() => props.streamer.nextSlot?.isLive === true)

const thumbnailUrl = computed(() => {
    const url = props.streamer.nextSlot?.twitchThumbnailUrl ?? null
    if (!url) return null
    return url.replace(/\d+x\d+/, '480x270')
})

const gameCover = computed(() => {
    if (isLive.value) return props.streamer.nextSlot?.twitchGameCover || null
    return props.streamer.nextSlot?.game?.cover || null
})

// Fond flouté : minuscule (blur cache tout artifact), chargement quasi-instantané
const gameCoverTiny = computed(() => {
    const url = gameCover.value
    if (!url) return null
    return url.replace(/\d+x\d+/, '40x55')
})

// Mini pochette bas-droite : un peu plus grande pour rester lisible
const gameCoverSmall = computed(() => {
    const url = gameCover.value
    if (!url) return null
    return url.replace(/\d+x\d+/, '148x200')
})

const gameLabel = computed(() => {
    if (isLive.value && props.streamer.nextSlot?.twitchGameName) return props.streamer.nextSlot.twitchGameName
    return props.streamer.nextSlot?.game?.label || ''
})

const twitchViewerCount = computed(() => props.streamer.nextSlot?.twitchViewerCount ?? null)

const whenLabel = computed(() => {
    if (isLive.value) return ''
    const slot = props.streamer.nextSlot
    if (!slot) return 'Aucun planning'
    const time = formatTime(slot.start_at)
    if (slot.isToday) return `Aujourd'hui · ${time}`
    if (slot.isTomorrow) return `Demain · ${time}`
    return `${slot.day} · ${time}`
})

// ── Badges ────────────────────────────────────────────────────────────────────
const categoryBadge = computed(() => {
    const v = twitchViewerCount.value
    if (v === null) return null
    if (v < 10) return 'À découvrir'
    if (v < 50) return 'En montée'
    return 'Populaire'
})

const categoryBadgeClass = computed(() => {
    const v = twitchViewerCount.value
    if (v === null) return ''
    if (v < 10) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
    if (v < 50) return 'bg-blue-500/20 text-blue-300 border-blue-500/20'
    return 'bg-orange-500/20 text-orange-300 border-orange-500/20'
})

const categoryBadgeIcon = computed(() => {
    const v = twitchViewerCount.value
    if (v === null) return 'lucide:sprout'
    if (v < 10) return 'lucide:sprout'
    if (v < 50) return 'lucide:trending-up'
    return 'lucide:flame'
})

function formatTime(time: string) {
    if (!time) return ''
    const [h, m] = time.split(':')
    return `${h}h${m}`
}
</script>
