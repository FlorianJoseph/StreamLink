<template>
    <div class="relative w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col">

        <!-- Thumbnail hero -->
        <div class="relative w-full" style="aspect-ratio: 16/9">
            <img v-if="thumbnailUrl" :src="thumbnailUrl" class="w-full h-full object-cover" :alt="streamer.username" />
            <div v-else class="w-full h-full bg-zinc-800 flex items-center justify-center">
                <Icon name="simple-icons:twitch" size="32" class="text-zinc-600" />
            </div>
            <!-- Gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/10 to-transparent" />
            <!-- Live badge -->
            <span
                class="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                live
            </span>
            <!-- Viewer count -->
            <span v-if="twitchViewerCount !== null"
                class="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                <Icon name="lucide:eye" size="12" /> {{ twitchViewerCount }}
            </span>
            <!-- Stream info overlay bottom -->
            <div class="absolute bottom-0 left-0 right-0 px-3 pb-3">
                <p v-if="streamer.nextSlot?.twitchTitle"
                    class="text-white text-sm font-medium truncate leading-tight drop-shadow">
                    {{ streamer.nextSlot.twitchTitle }}
                </p>
                <p class="text-zinc-300 text-xs truncate mt-0.5 drop-shadow">{{ gameLabel }}</p>
            </div>
        </div>

        <!-- Info row -->
        <div class="flex items-center gap-3 px-3 pt-3 pb-1">
            <img :src="streamer.avatar_url || defaultAvatar"
                class="w-9 h-9 rounded-xl object-cover ring-2 ring-red-500/60 flex-shrink-0" />
            <div class="flex items-center gap-2 min-w-0 flex-1">
                <span class="font-semibold text-white text-sm truncate">{{ streamer.username }}</span>
                <img v-if="flagCode" :src="`https://flagcdn.com/w80/${flagCode}.png`"
                    class="w-4 h-[11px] object-cover rounded-xs opacity-90 flex-shrink-0" />
            </div>
        </div>

        <!-- CTAs -->
        <div class="flex gap-2 px-3 pb-3 pt-2">
            <NuxtLink :to="`/${streamer.username}`" target="_blank"
                class="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-700/60 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-medium transition-all duration-150">
                <Icon name="lucide:user" size="14" />
                <span>Profil</span>
            </NuxtLink>
            <button @click="showModal = true"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-700/60 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-medium transition-all duration-150">
                <Icon name="simple-icons:twitch" size="14" />
                <span>Regarder</span>
            </button>
            <button @click="openRaidModal" :disabled="!canRaid || raidLoading"
                v-tooltip.bottom="{ value: raidTooltip, pt: { text: '!text-sm' } }" :class="[
                    'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all duration-150',
                    canRaid && !raidLoading
                        ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:border-yellow-500/50 cursor-pointer'
                        : 'bg-zinc-800 text-zinc-600 border-zinc-700/40 cursor-not-allowed'
                ]">
                <Icon name="lucide:swords" size="14" />
                <span>Raid</span>
                <span class="flex items-center gap-0.5 text-[10px]" :class="canRaid ? 'text-yellow-500/70' : 'text-zinc-600'">
                    <Icon name="lucide:coins" size="9" /> +{{ raidCoins }}
                </span>
            </button>
        </div>

        <!-- Twitch embed modal -->
        <Dialog v-model:visible="showModal" modal
            :style="{ width: '80vw', maxWidth: '80vw', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px', padding: 0, overflow: 'hidden' }"
            :pt="{ header: { style: 'display:none' }, content: { style: 'padding:0; background:#18181b; border-radius:16px; overflow:hidden' } }">
            <div class="flex flex-col">
                <div
                    class="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-zinc-800 flex-shrink-0 gap-3">
                    <div class="flex items-center gap-3">
                        <img :src="streamer.avatar_url || defaultAvatar"
                            class="w-9 h-9 rounded-xl object-cover ring-1 ring-zinc-700" />
                        <div class="flex min-w-0 justify-between w-full">
                            <div>
                                <span class="text-sm font-semibold text-white">{{ streamer.username }}</span>
                                <div class="flex items-center gap-2 mt-0.5">
                                    <span class="text-xs text-zinc-400">{{ gameLabel }}</span>
                                    <span v-if="twitchViewerCount !== null"
                                        class="text-xs text-zinc-500 flex items-center gap-1">
                                        <Icon name="lucide:eye" size="12" class="ml-0.5" /> {{ twitchViewerCount }}
                                    </span>
                                </div>
                            </div>
                            <button @click="showModal = false"
                                class="flex sm:hidden items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
                                <Icon name="lucide:x" size="22" />
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center items-center gap-2">
                        <a :href="`https://twitch.tv/${streamer.username}`" target="_blank" rel="noopener noreferrer"
                            class="w-full sm:w-auto flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700/60 transition-all duration-150">
                            <Icon name="simple-icons:twitch" size="16" /> Voir sur Twitch
                        </a>
                        <button @click="openRaidModal" :disabled="!canRaid || raidLoading" :class="[
                            'w-full sm:w-auto flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-150',
                            canRaid && !raidLoading
                                ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:border-yellow-500/50 cursor-pointer'
                                : 'bg-zinc-800 text-zinc-600 border-zinc-700/40 cursor-not-allowed'
                        ]" v-tooltip.bottom="{ value: raidTooltip, pt: { text: '!text-sm' } }">
                            <Icon name="lucide:swords" size="16" />
                            Lancer un raid
                            <span class="flex items-center gap-0.5 text-[10px] ml-1"
                                :class="canRaid ? 'text-yellow-500/70' : 'text-zinc-600'">
                                <Icon name="lucide:coins" size="10" /> +{{ raidCoins }}
                            </span>
                        </button>
                        <button @click="showModal = false"
                            class="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
                            <Icon name="lucide:x" size="22" />
                        </button>
                    </div>
                </div>
                <div class="flex min-h-0">
                    <div class="flex-1 bg-black min-w-0">
                        <div v-if="showModal" :id="twitchEmbedId" class="w-full" style="aspect-ratio: 16/9" />
                    </div>
                    <div class="hidden lg:block flex-shrink-0 border-l border-zinc-800" style="width: 340px">
                        <iframe v-if="showModal"
                            :src="`https://www.twitch.tv/embed/${streamer.username}/chat?parent=stream-link.fr&parent=www.stream-link.fr&parent=localhost&darkpopout`"
                            class="w-full h-full" style="min-height: 300px"
                            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals" />
                    </div>
                </div>
            </div>
        </Dialog>

        <!-- Raid confirm modal -->
        <Dialog v-model:visible="showRaidModal" modal :draggable="false" :style="{ width: '24rem', margin: '1rem' }">
            <template #container>
                <div v-if="raidConfirmed" class="flex flex-col gap-4 p-6">
                    <div class="flex items-center gap-3">
                        <img :src="streamer.avatar_url || defaultAvatar"
                            class="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700" />
                        <div>
                            <p class="font-semibold text-white text-sm">Raid en cours vers {{ streamer.username }}</p>
                            <p class="text-xs text-zinc-400">{{ raidCountdown }}s restantes</p>
                        </div>
                    </div>
                    <div class="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div class="h-full bg-yellow-500 rounded-full transition-all duration-500"
                            :style="{ width: `${(raidCountdown / 15) * 100}%` }" />
                    </div>
                    <p class="text-xs text-zinc-500 text-center">Tes Coins seront crédités dans {{ raidCountdown }}s</p>
                    <button @click="cancelRaid"
                        class="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        Annuler le raid
                    </button>
                </div>
                <div v-else class="flex flex-col gap-5 p-6">
                    <div class="flex items-center gap-3">
                        <img :src="streamer.avatar_url || defaultAvatar"
                            class="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700" />
                        <div>
                            <p class="font-semibold text-white text-sm">{{ streamer.username }}</p>
                            <p class="text-xs text-zinc-400">{{ gameLabel }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <p class="text-sm text-white font-medium">Lancer un raid vers {{ streamer.username }} ?</p>
                        <p class="text-xs text-zinc-400">Tes viewers seront redirigés vers sa chaîne Twitch.</p>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <Icon name="lucide:coins" size="16" class="text-yellow-400 flex-shrink-0" />
                        <span class="text-xs sm:text-sm text-yellow-300 font-medium">+{{ raidCoins }} Coins</span>
                        <span class="text-xs text-zinc-500 ml-auto">{{ raidStatus.remaining }}/{{ raidStatus.total }}
                            raids restants</span>
                    </div>
                    <div class="flex gap-2">
                        <Button severity="secondary" outlined @click="showRaidModal = false" class="flex-1">
                            <Icon name="lucide:x" size="18" class="shrink-0" />
                            <span class="text-sm shrink-0">Annuler</span>
                        </Button>
                        <Button severity="contrast" @click="confirmRaid" :loading="raidLoading" class="flex-1">
                            <Icon name="lucide:swords" size="18" class="shrink-0" />
                            <span class="text-sm shrink-0">Raid</span>
                        </Button>
                    </div>
                </div>
            </template>
        </Dialog>

    </div>
</template>

<script setup lang="ts">
const defaultAvatar = "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png"

const props = defineProps({
    streamer: { type: Object, required: true }
})

const streamerStore = useStreamerStore()
const { streamer: currentStreamer } = storeToRefs(streamerStore)
const user = useSupabaseUser()
const toast = useToast()
const { raidStatus } = useRaidStatus()
const { fetchBalance } = useWallet()

const showModal = ref(false)
const showRaidModal = ref(false)
const raidLoading = ref(false)
const raidConfirmed = ref(false)
const raidCountdown = ref(15)
const earnedCoins = ref(0)
let countdownInterval: ReturnType<typeof setInterval> | null = null

const twitchEmbedId = computed(() => `twitch-embed-featured-${props.streamer.username}`)
const twitchViewerCount = computed(() => props.streamer.nextSlot?.twitchViewerCount ?? null)
const thumbnailUrl = computed(() => props.streamer.nextSlot?.twitchThumbnailUrl ?? null)
const gameLabel = computed(() => props.streamer.nextSlot?.twitchGameName || props.streamer.nextSlot?.game?.label || '—')
const flagCode = computed(() => getFlag(props.streamer.language ?? ''))

// Calcul dynamique des coins gagnés en fonction du nombre de viewers
const raidCoins = computed(() => {
    const v = twitchViewerCount.value ?? 0
    if (v < 5) return 7
    if (v < 15) return 6
    if (v < 50) return 5
    if (v < 150) return 4
    return 3
})

// Calcul si le raid est possible
const canRaid = computed(() => {
    if (!user.value) return false
    if (!raidStatus.value.canRaidToday) return false
    if (currentStreamer.value?.username?.toLowerCase() === props.streamer.username?.toLowerCase()) return false
    if (raidStatus.value.raidedThisWeek?.includes(props.streamer.username?.toLowerCase())) return false
    return raidStatus.value.remaining > 0
})

// Tooltip dynamique du bouton raid
const raidTooltip = computed(() => {
    if (!user.value) return 'Connecte-toi pour raid'
    if (currentStreamer.value?.username?.toLowerCase() === props.streamer.username?.toLowerCase()) return 'Tu ne peux pas te raid toi-même'
    if (!raidStatus.value.canRaidToday) return 'Tu as déjà raid aujourd\'hui'
    if (raidStatus.value.remaining === 0) return 'Limite de raids atteinte cette semaine'
    if (raidStatus.value.raidedThisWeek?.includes(props.streamer.username?.toLowerCase())) return 'Tu as déjà raid ce streamer cette semaine'
    return `Raid ${props.streamer.username} et gagner ${raidCoins.value} Coins`
})

function openRaidModal() {
    if (!canRaid.value) return
    showRaidModal.value = true
}

// Appelle l'API pour confirmer le raid
async function confirmRaid() {
    raidLoading.value = true
    try {
        const { coinsEarned } = await $fetch<{ success: boolean; coinsEarned: number; raidedViaApi: boolean }>('/api/raids/create', {
            method: 'POST',
            body: { targetUsername: props.streamer.username, coinsEarned: raidCoins.value }
        })

        raidStatus.value.remaining--
        raidStatus.value.used++
        raidStatus.value.canRaidToday = false
        raidStatus.value.raidedThisWeek = [...(raidStatus.value.raidedThisWeek ?? []), props.streamer.username.toLowerCase()]

        raidConfirmed.value = true
        raidCountdown.value = 15
        earnedCoins.value = coinsEarned

        // Lance le countdown
        countdownInterval = setInterval(async () => {
            raidCountdown.value--
            if (raidCountdown.value <= 0) {
                clearInterval(countdownInterval!)
                showRaidModal.value = false
                raidConfirmed.value = false
                await fetchBalance()
                toast.add({ severity: 'secondary', summary: 'Raid lancé !', detail: `${earnedCoins.value}`, group: 'quest', life: 4000 })
            }
        }, 1000)
    } catch (err: any) {
        toast.add({ severity: 'warn', summary: 'Raid impossible', detail: err?.data?.message ?? 'Une erreur est survenue', group: 'app', life: 4000 })
    } finally {
        raidLoading.value = false
    }
}

// Appelle l'API pour annuler le raid
async function cancelRaid() {
    clearInterval(countdownInterval!)
    await $fetch('/api/raids/cancel', { method: 'POST' }).catch(() => { })
    raidStatus.value.remaining++
    raidStatus.value.used--
    raidStatus.value.canRaidToday = true
    raidStatus.value.raidedThisWeek = raidStatus.value.raidedThisWeek?.filter(u => u !== props.streamer.username.toLowerCase()) ?? []
    showRaidModal.value = false
    raidConfirmed.value = false
    raidCountdown.value = 15
}

// Watch pour charger le player Twitch quand la modale s'ouvre
watch(showModal, (val) => {
    if (val) {
        nextTick(() => {
            const container = document.getElementById(twitchEmbedId.value)
            const width = container?.clientWidth || 854
            const height = Math.round(width * 9 / 16)
            const script = document.createElement('script')
            script.src = 'https://embed.twitch.tv/embed/v1.js'
            script.onload = () => {
                new (window as any).Twitch.Embed(twitchEmbedId.value, {
                    width, height,
                    channel: props.streamer.username,
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
</script>
