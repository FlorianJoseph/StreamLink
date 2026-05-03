<template>
    <div class="relative w-full">
        <div class="rounded-xl overflow-hidden border border-white/8 bg-surface-dark">

            <!-- ── Thumbnail 16/9 ── -->
            <div class="relative aspect-video overflow-hidden bg-surface-darker">
                <template v-if="isLive && thumbnailUrl">
                    <img :src="thumbnailUrl" class="absolute inset-0 w-full h-full object-cover" loading="lazy"
                        decoding="async" />
                    <div
                        class="absolute inset-x-0 bottom-0 z-20 px-2.5 pb-2 pt-6 bg-gradient-to-t from-[#18191c] to-transparent">
                        <p class="text-[11px] text-white font-medium leading-tight line-clamp-2">{{
                            streamer.nextSlot?.twitchTitle }}</p>
                    </div>
                </template>
                <template v-else>
                    <img v-if="gameCover" :src="gameCoverTiny"
                        class="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-30" loading="lazy"
                        decoding="async" />
                    <div v-else class="absolute inset-0 bg-surface-darker" />

                    <div class="relative z-10 flex items-center justify-center h-full">
                        <img :src="avatarUrl(streamer.avatar_url, 128)"
                            class="w-16 h-16 rounded-full object-cover shadow-2xl ring-2 ring-white/8" loading="lazy"
                            decoding="async" />
                    </div>

                    <div v-if="gameCover" class="absolute bottom-2 right-2 z-20">
                        <img :src="gameCoverSmall"
                            class="h-14 w-10 rounded-md object-fill shadow-lg ring-1 ring-white/10" loading="lazy"
                            decoding="async" />
                    </div>

                    <div class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#18191c] to-transparent z-10" />
                </template>

                <!-- Badge live -->
                <div v-if="isLive"
                    class="absolute top-2 left-2 z-20 flex items-center bg-red-600 text-white text-xs font-bold px-1.25 py-0.25 rounded uppercase tracking-wide">
                    live
                </div>

                <!-- Viewers + Charm -->
                <div v-if="isLive" class="absolute top-2 right-2 z-20 flex items-center gap-1">
                    <div v-if="twitchViewerCount !== null"
                        class="flex items-center gap-1 text-sm px-1.25 py-0.25 rounded"
                        :style="{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white' }">
                        <Icon name="lucide:eye" size="12" />{{ twitchViewerCount }}
                    </div>
                    <div class="flex items-center gap-1 text-sm font-bold px-1.25 py-0.25 rounded"
                        :style="{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white' }">
                        <img src="/images/assets/charmi-monnaie-jaune.svg" class="w-3 h-3" alt="" />
                        +{{ raidCharm }}
                    </div>
                </div>

                <div v-if="whenLabel"
                    class="absolute top-2 right-2 z-20 flex items-center gap-1 text-sm px-1.25 py-0.25 rounded"
                    :style="{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }">
                    {{ whenLabel }}
                </div>
            </div>

            <!-- ── Infos + CTA ── -->
            <div class="p-3 flex flex-col gap-3">

                <!-- Username + jeu -->
                <div class="flex items-center gap-2.5 min-w-0">
                    <img :src="avatarUrl(streamer.avatar_url, 32)"
                        class="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-white/8" loading="lazy"
                        decoding="async" />
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5 min-w-0">
                            <span class="font-semibold text-white text-sm truncate">{{ streamer.username }}</span>
                            <Icon v-if="streamer.is_sub" name="lucide:badge-check" size="15"
                                class="text-primary shrink-0"
                                v-tooltip.top="{ value: 'Vérifié', pt: { text: '!text-sm' } }" />
                        </div>
                        <p class="text-xs text-muted truncate mt-0.5">{{ gameLabel || '—' }}</p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2">

                    <!-- CTA principal -->
                    <button v-if="isLive" @click="openPlayer(props.streamer)"
                        class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-white hover:bg-white/90 text-[#1e1f22] font-bold text-sm transition-colors">
                        <Icon name="lucide:play" size="20" class="flex-shrink-0 fill-[#1e1f22]" />
                        Regarder
                    </button>
                    <NuxtLink v-else :to="`/${streamer.username}`" target="_blank"
                        class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-white hover:bg-white/90 text-[#1e1f22] font-bold text-sm no-underline transition-colors">
                        <Icon name="lucide:user" size="20" class="flex-shrink-0" />
                        Voir le profil
                    </NuxtLink>

                    <!-- Profil (si live) -->
                    <NuxtLink v-if="isLive" :to="`/${streamer.username}`" target="_blank"
                        v-tooltip.top="{ value: 'Profil', pt: { text: '!text-xs' } }"
                        class="w-10 h-10 flex items-center justify-center rounded-full border border-white/8 bg-white/5 hover:bg-white/10 text-muted hover:text-white no-underline transition-colors">
                        <Icon name="lucide:user" size="20" />
                    </NuxtLink>

                    <!-- Twitch (si offline) -->
                    <a v-if="!isLive" :href="`https://twitch.tv/${streamer.username}`" target="_blank"
                        rel="noopener noreferrer" v-tooltip.top="{ value: 'Voir sur Twitch', pt: { text: '!text-xs' } }"
                        class="w-10 h-10 flex items-center justify-center rounded-full border border-white/8 bg-white/5 hover:bg-white/10 text-muted hover:text-white">
                        <Icon name="simple-icons:twitch" size="20" />
                    </a>

                    <!-- Raid (si live) -->
                    <button v-if="isLive" @click="openRaidFor(props.streamer)" :disabled="!canRaid"
                        v-tooltip.top="{ value: raidTooltip, pt: { text: '!text-xs' } }" :class="['w-10 h-10 flex items-center justify-center rounded-full border',
                            canRaid
                                ? 'bg-primary hover:bg-primary/90 text-white border-primary cursor-pointer'
                                : 'bg-white/5 text-muted border-white/8 cursor-not-allowed']">
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

const raidCharm = computed(() => {
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
    return `Raid ${props.streamer.username} et gagner ${raidCharm.value} Charm`
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
    if (!slot) return ''
    const time = formatTime(slot.start_at)
    if (slot.isToday) return `Aujourd'hui · ${time}`
    if (slot.isTomorrow) return `Demain · ${time}`
    return `${slot.day} · ${time}`
})

function formatTime(time: string) {
    if (!time) return ''
    const [h, m] = time.split(':')
    return `${h}h${m}`
}
</script>
