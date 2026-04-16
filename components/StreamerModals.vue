<template>
    <!-- ═══ MODALE PLAYER TWITCH ═══ -->
    <Dialog v-model:visible="playerModal.open" modal
        :style="{ width: '80vw', maxWidth: '80vw', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px', padding: 0, overflow: 'hidden' }"
        :pt="{ header: { style: 'display:none' }, content: { style: 'padding:0; background:#18181b; border-radius:16px; overflow:hidden' } }">
        <div class="flex flex-col">

            <!-- Header -->
            <div
                class="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-zinc-800 flex-shrink-0 gap-3">
                <div class="flex items-center gap-3">
                    <img :src="playerModal.streamer?.avatar_url || defaultAvatar"
                        class="w-9 h-9 rounded-xl object-cover ring-1 ring-zinc-700" />
                    <div class="flex min-w-0 justify-between w-full">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-semibold text-white">{{ playerModal.streamer?.username
                                    }}</span>
                            </div>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-xs text-zinc-400">{{ playerGameLabel }}{{ !playerIsLive ? ' | ' +
                                    playerWhenLabel : '' }}</span>
                                <span v-if="playerIsLive && playerViewerCount !== null"
                                    class="text-xs text-zinc-500 flex items-center gap-1">
                                    <Icon name="lucide:eye" size="12" class="ml-0.5" /> {{ playerViewerCount }}
                                </span>
                            </div>
                        </div>
                        <button @click="closePlayer()"
                            class="flex sm:hidden items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
                            <Icon name="lucide:x" size="22" />
                        </button>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center items-center gap-2">
                    <a :href="`https://twitch.tv/${playerModal.streamer?.username}`" target="_blank"
                        rel="noopener noreferrer"
                        class="w-full sm:w-auto flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700/60 transition-all duration-150">
                        <Icon name="simple-icons:twitch" size="16" />
                        Voir sur Twitch
                    </a>
                    <button @click="triggerRaidFromPlayer" :disabled="!playerCanRaid" :class="[
                        'w-full sm:w-auto flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-150',
                        playerCanRaid
                            ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:border-yellow-500/50 cursor-pointer'
                            : 'bg-zinc-800 text-zinc-600 border-zinc-700/40 cursor-not-allowed'
                    ]">
                        <Icon name="lucide:swords" size="16" />
                        Lancer un raid
                        <span class="flex items-center gap-0.5 text-[10px] ml-1"
                            :class="playerCanRaid ? 'text-yellow-500/70' : 'text-zinc-600'">
                            <Icon name="lucide:coins" size="10" /> +{{ playerRaidCoins }}
                        </span>
                    </button>
                    <button @click="closePlayer()"
                        class="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
                        <Icon name="lucide:x" size="22" />
                    </button>
                </div>
            </div>

            <!-- Player + chat -->
            <div class="flex min-h-0">
                <div class="flex-1 bg-black min-w-0">
                    <div v-if="playerModal.open" id="twitch-embed" class="w-full" style="aspect-ratio: 16/9" />
                </div>
                <div class="hidden lg:block flex-shrink-0 border-l border-zinc-800"
                    style="aspect-ratio: unset; width: 340px">
                    <iframe v-if="playerModal.open"
                        :src="`https://www.twitch.tv/embed/${playerModal.streamer?.username}/chat?parent=stream-link.fr&parent=www.stream-link.fr&parent=localhost&darkpopout`"
                        class="w-full h-full" style="min-height: 300px"
                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals" />
                </div>
            </div>
        </div>
    </Dialog>

    <!-- ═══ MODALE RAID ═══ -->
    <Dialog v-model:visible="raidModal.open" modal :draggable="false" :style="{ width: '24rem', margin: '1rem' }">
        <template #container>

            <!-- État countdown post-raid -->
            <div v-if="raidModal.confirmed" class="flex flex-col gap-4 p-6">
                <div class="flex items-center gap-3">
                    <img :src="raidModal.streamer?.avatar_url || defaultAvatar"
                        class="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700" />
                    <div>
                        <p class="font-semibold text-white text-sm">Raid en cours vers {{ raidModal.streamer?.username
                            }}</p>
                        <p class="text-xs text-zinc-400">{{ raidModal.countdown }}s restantes</p>
                    </div>
                </div>
                <div class="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div class="h-full bg-yellow-500 rounded-full transition-all duration-500"
                        :style="{ width: `${(raidModal.countdown / 15) * 100}%` }" />
                </div>
                <p class="text-xs text-zinc-500 text-center">Tes Coins seront crédités dans {{ raidModal.countdown }}s
                </p>
                <button @click="cancelRaid"
                    class="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    Annuler le raid
                </button>
            </div>

            <!-- État confirmation -->
            <div v-else class="flex flex-col gap-5 p-6">
                <div class="flex items-center gap-3">
                    <img :src="raidModal.streamer?.avatar_url || defaultAvatar"
                        class="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700" />
                    <div>
                        <p class="font-semibold text-white text-sm">{{ raidModal.streamer?.username }}</p>
                        <p class="text-xs text-zinc-400">{{ raidGameLabel }}</p>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <p class="text-sm text-white font-medium">Lancer un raid vers {{ raidModal.streamer?.username }} ?
                    </p>
                    <p class="text-xs text-zinc-400">Tes viewers seront redirigés vers sa chaîne Twitch.</p>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <Icon name="lucide:coins" size="16" class="text-yellow-400 flex-shrink-0" />
                    <span class="text-xs sm:text-sm text-yellow-300 font-medium">+{{ raidCoins }} Coins</span>
                    <span class="text-xs text-zinc-500 ml-auto">{{ raidStatus.remaining }}/{{ raidStatus.total }}
                        raids restants cette semaine</span>
                </div>
                <div class="flex gap-2">
                    <Button severity="secondary" outlined @click="closeRaid()" class="flex-1">
                        <Icon name="lucide:x" size="20" class="shrink-0" />
                        <span class="text-sm sm:text-base shrink-0">Annuler</span>
                    </Button>
                    <Button severity="contrast" @click="confirmRaid" :loading="raidModal.loading" class="flex-1">
                        <Icon name="lucide:swords" size="20" class="shrink-0" />
                        <span class="text-sm sm:text-base shrink-0">Raid</span>
                    </Button>
                </div>
            </div>

        </template>
    </Dialog>
</template>

<script setup lang="ts">
const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png"

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

const playerRaidCoins = computed(() => {
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
                    parent: ['stream-link.fr', 'www.stream-link.fr', 'localhost'],
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
