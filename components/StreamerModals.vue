<template>
    <!-- ═══ MODALE PLAYER TWITCH ═══ -->
    <Dialog v-model:visible="playerModal.open" modal
        :style="{ width: '80vw', maxWidth: '80vw', background: '#1e1f22', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: 0, overflow: 'hidden' }"
        :pt="{ header: { style: 'display:none' }, content: { style: 'padding:0; background:#1e1f22; border-radius:16px; overflow:hidden' } }">
        <div class="flex flex-col">

            <!-- Header -->
            <div
                class="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0 gap-3">
                <div class="flex items-center gap-3">
                    <img :src="avatarUrl(playerModal.streamer?.avatar_url, 64)"
                        class="w-9 h-9 rounded-xl object-cover ring-1 ring-white/8" />
                    <div class="flex min-w-0 justify-between w-full">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-semibold text-white">{{ playerModal.streamer?.username
                                    }}</span>
                            </div>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-xs text-muted">{{ playerGameLabel }}{{ !playerIsLive ? ' | ' +
                                    playerWhenLabel : '' }}</span>
                                <span v-if="playerIsLive && playerViewerCount !== null"
                                    class="text-xs text-muted flex items-center gap-1">
                                    <Icon name="lucide:eye" size="12" class="ml-0.5" /> {{ playerViewerCount }}
                                </span>
                            </div>
                        </div>
                        <button @click="closePlayer()"
                            class="flex sm:hidden items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 text-muted">
                            <Icon name="lucide:x" size="22" />
                        </button>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center items-center gap-2">
                    <a :href="`https://twitch.tv/${playerModal.streamer?.username}`" target="_blank"
                        rel="noopener noreferrer"
                        class="w-full sm:w-auto flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-white/5 hover:bg-white/10 text-muted hover:text-white border border-white/8">
                        <Icon name="simple-icons:twitch" size="16" />
                        Voir sur Twitch
                    </a>
                    <button @click="triggerRaidFromPlayer" :disabled="!playerCanRaid"
                        v-tooltip.bottom="{ value: playerRaidTooltip, pt: { text: '!text-sm' } }" :class="[
                            'w-full sm:w-auto flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors',
                            playerCanRaid
                                ? 'bg-white hover:bg-white/90 text-primary cursor-pointer'
                                : 'bg-white/5 text-muted border border-white/8 cursor-not-allowed'
                        ]">
                        <Icon name="lucide:swords" size="16" />
                        Lancer un raid
                        <span class="flex items-center gap-0.5 text-[10px]"
                            :class="playerCanRaid ? 'text-primary' : 'text-muted'">
                            <img v-if="playerCanRaid" src="/images/assets/charmi-monnaie-violet.svg" class="w-2.5 h-2.5"
                                alt="" />
                            +{{ playerRaidCharm }}
                        </span>
                    </button>
                    <button @click="closePlayer()"
                        class="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 text-muted">
                        <Icon name="lucide:x" size="22" />
                    </button>
                </div>
            </div>

            <!-- Player + chat -->
            <div class="flex min-h-0">
                <div class="flex-1 bg-black min-w-0">
                    <div v-if="playerModal.open" id="twitch-embed" class="w-full" style="aspect-ratio: 16/9" />
                </div>
                <div class="hidden lg:block flex-shrink-0 border-l border-white/5"
                    style="aspect-ratio: unset; width: 340px">
                    <iframe v-if="playerModal.open"
                        :src="`https://www.twitch.tv/embed/${playerModal.streamer?.username}/chat?parent=charmi.gg&parent=www.charmi.gg&parent=localhost&darkpopout`"
                        class="w-full h-full" style="min-height: 300px"
                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals" />
                </div>
            </div>
        </div>
    </Dialog>

    <!-- ═══ MODALE RAID ═══ -->
    <Dialog v-model:visible="raidModal.open" modal :draggable="false" :style="{ width: '24rem', margin: '1rem' }">
        <template #container>

            <!-- État countdown -->
            <div v-if="raidModal.confirmed" class="flex flex-col gap-4 p-6">
                <div class="flex items-center gap-3">
                    <img :src="avatarUrl(raidModal.streamer?.avatar_url, 64)"
                        class="w-10 h-10 rounded-xl object-cover ring-1 ring-white/8" />
                    <div>
                        <p class="font-semibold text-white text-sm">Raid en cours vers {{ raidModal.streamer?.username
                        }}</p>
                        <p class="text-xs text-muted">{{ raidModal.countdown }}s restantes</p>
                    </div>
                </div>
                <div class="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div class="h-full bg-accent rounded-full transition-all duration-500"
                        :style="{ width: `${(raidModal.countdown / 15) * 100}%` }" />
                </div>
                <p class="text-xs text-muted text-center">Tes Charm arrivent dans {{ raidModal.countdown }}s</p>
                <button @click="cancelRaid" class="w-full text-xs text-muted hover:text-white transition-colors">
                    Annuler le raid
                </button>
            </div>

            <!-- État confirmation -->
            <div v-else class="flex flex-col gap-5 p-6">
                <div class="flex items-center gap-3">
                    <img :src="avatarUrl(raidModal.streamer?.avatar_url, 64)"
                        class="w-10 h-10 rounded-xl object-cover ring-1 ring-white/8" />
                    <div>
                        <p class="font-semibold text-white text-sm">{{ raidModal.streamer?.username }}</p>
                        <p class="text-xs text-muted">{{ raidGameLabel }}</p>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <p class="text-sm text-white font-medium">Lancer un raid vers {{ raidModal.streamer?.username }} ?
                    </p>
                    <p class="text-xs text-muted">Tes viewers seront redirigés vers sa chaîne Twitch.</p>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
                    <img src="/images/assets/charmi-monnaie-jaune.svg" class="w-4 h-4 flex-shrink-0" alt="" />
                    <span class="text-sm text-accent font-medium">+{{ raidCharm }} Charm</span>
                    <span class="text-xs text-muted ml-auto">{{ raidStatus.remaining }}/{{ raidStatus.total }} raids
                        restants</span>
                </div>
                <div class="flex gap-2">
                    <button @click="closeRaid()"
                        class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md border border-white/8 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm">
                        <Icon name="lucide:x" size="16" class="flex-shrink-0" />
                        Annuler
                    </button>
                    <button @click="confirmRaid" :disabled="raidModal.loading"
                        class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-primary hover:bg-primary/90 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon v-if="!raidModal.loading" name="lucide:swords" size="16" class="flex-shrink-0" />
                        <Icon v-else name="lucide:loader-circle" size="16" class="flex-shrink-0 animate-spin" />
                        Raid
                    </button>
                </div>
            </div>

        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { avatarUrl } from '~/utils/avatar'

const { playerModal, closePlayer } = usePlayerModal()
const { raidModal, openRaidFor, closeRaid } = useRaidModal()
const { raidStatus } = useRaidStatus()
const { fetchBalance } = useWallet()
const toast = useToast()
const user = useSupabaseUser()
const streamerStore = useStreamerStore()
const { streamer: currentStreamer } = storeToRefs(streamerStore)

// ── Player modal ──────────────────────────────────────────────────────────────
const playerIsLive = computed(() => playerModal.value.streamer?.nextSlot?.isLive === true)
const playerViewerCount = computed(() => playerModal.value.streamer?.nextSlot?.twitchViewerCount ?? null)

const playerGameLabel = computed(() => {
    const s = playerModal.value.streamer
    if (!s) return ''
    if (s.nextSlot?.isLive && s.nextSlot?.twitchGameName) return s.nextSlot.twitchGameName
    return s.nextSlot?.game?.label || ''
})

const playerWhenLabel = computed(() => {
    const slot = playerModal.value.streamer?.nextSlot
    if (!slot) return ''
    const parts = (slot.start_at || '').split(':')
    const time = `${parts[0]}h${parts[1]}`
    if (slot.isToday) return `Aujourd'hui · ${time}`
    if (slot.isTomorrow) return `Demain · ${time}`
    return `${slot.day} · ${time}`
})

const playerRaidCharm = computed(() => {
    const v = playerViewerCount.value ?? 0
    if (v < 5) return 7
    if (v < 15) return 6
    if (v < 50) return 5
    if (v < 150) return 4
    return 3
})

const playerCanRaid = computed(() => {
    if (!user.value || !playerModal.value.streamer) return false
    const s = playerModal.value.streamer
    if (!raidStatus.value.canRaidToday) return false
    if (currentStreamer.value?.username?.toLowerCase() === s.username?.toLowerCase()) return false
    if (raidStatus.value.raidedThisWeek?.includes(s.username?.toLowerCase())) return false
    return raidStatus.value.remaining > 0
})

const playerRaidTooltip = computed(() => {
    if (!user.value) return 'Connecte-toi pour raid'
    const s = playerModal.value.streamer
    if (!s) return ''
    if (currentStreamer.value?.username?.toLowerCase() === s.username?.toLowerCase()) return 'Tu ne peux pas te raid toi-même'
    if (!raidStatus.value.canRaidToday) return 'Tu as déjà raid aujourd\'hui'
    if (raidStatus.value.remaining === 0) return 'Plus de raids disponibles cette semaine'
    if (raidStatus.value.raidedThisWeek?.includes(s.username?.toLowerCase())) return 'Tu as déjà raid ce streamer cette semaine'
    return `Raid ${s.username} et gagner ${playerRaidCharm.value} Charm`
})

function triggerRaidFromPlayer() {
    if (!playerCanRaid.value || !playerModal.value.streamer) return
    openRaidFor(playerModal.value.streamer)
}

// Chargement du player Twitch quand la modale s'ouvre
watch(() => playerModal.value.open, (val) => {
    if (val) {
        nextTick(() => {
            const container = document.getElementById('twitch-embed')
            const width = container?.clientWidth || 854
            const height = Math.round(width * 9 / 16)
            const script = document.createElement('script')
            script.src = 'https://embed.twitch.tv/embed/v1.js'
            script.onload = () => {
                new (window as any).Twitch.Embed('twitch-embed', {
                    width, height,
                    channel: playerModal.value.streamer?.username,
                    parent: ['charmi.gg', 'www.charmi.gg', 'localhost'],
                    layout: 'video',
                    autoplay: true,
                    theme: 'dark',
                })
            }
            document.head.appendChild(script)
        })
    }
})

// ── Raid modal ────────────────────────────────────────────────────────────────
const raidGameLabel = computed(() => {
    const s = raidModal.value.streamer
    if (!s) return ''
    if (s.nextSlot?.isLive && s.nextSlot?.twitchGameName) return s.nextSlot.twitchGameName
    return s.nextSlot?.game?.label || ''
})

const raidCoins = computed(() => {
    const v = raidModal.value.streamer?.nextSlot?.twitchViewerCount ?? 0
    if (v < 5) return 7
    if (v < 15) return 6
    if (v < 50) return 5
    if (v < 150) return 4
    return 3
})

let countdownInterval: ReturnType<typeof setInterval> | null = null

async function confirmRaid() {
    if (!raidModal.value.streamer) return
    raidModal.value.loading = true
    try {
        const { coinsEarned } = await $fetch<{ success: boolean; coinsEarned: number; raidedViaApi: boolean }>(
            '/api/raids/create',
            {
                method: 'POST',
                body: { targetUsername: raidModal.value.streamer.username, coinsEarned: raidCoins.value },
            }
        )

        raidStatus.value.remaining--
        raidStatus.value.used++
        raidStatus.value.canRaidToday = false
        raidStatus.value.raidedThisWeek = [
            ...(raidStatus.value.raidedThisWeek ?? []),
            raidModal.value.streamer.username.toLowerCase(),
        ]

        raidModal.value.confirmed = true
        raidModal.value.countdown = 15
        raidModal.value.earnedCoins = coinsEarned

        countdownInterval = setInterval(async () => {
            raidModal.value.countdown--
            if (raidModal.value.countdown <= 0) {
                clearInterval(countdownInterval!)
                const earned = raidModal.value.earnedCoins
                raidModal.value.open = false
                raidModal.value.confirmed = false
                await fetchBalance()
                toast.add({ severity: 'secondary', summary: 'Raid lancé !', detail: `${earned}`, group: 'quest', life: 4000 })
            }
        }, 1000)
    } catch (err: any) {
        toast.add({
            severity: 'warn',
            summary: 'Raid impossible',
            detail: err?.data?.message ?? 'Une erreur est survenue',
            group: 'app',
            life: 4000,
        })
    } finally {
        raidModal.value.loading = false
    }
}

async function cancelRaid() {
    clearInterval(countdownInterval!)
    await $fetch('/api/raids/cancel', { method: 'POST' }).catch(() => { })
    raidStatus.value.remaining++
    raidStatus.value.used--
    raidStatus.value.canRaidToday = true
    if (raidModal.value.streamer) {
        raidStatus.value.raidedThisWeek =
            raidStatus.value.raidedThisWeek?.filter(
                u => u !== raidModal.value.streamer.username.toLowerCase()
            ) ?? []
    }
    raidModal.value.open = false
    raidModal.value.confirmed = false
    raidModal.value.countdown = 15
}

onUnmounted(() => clearInterval(countdownInterval!))
</script>
