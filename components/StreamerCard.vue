<template>
    <div class="relative w-full">
        <div class="flex flex-col gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900">

            <div class="flex items-center gap-4">

                <!-- Badge "À découvrir" -->
                <span v-if="isLive && twitchViewerCount !== null && twitchViewerCount < 10"
                    class="absolute top-3 right-3 flex items-center gap-1 text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-medium">
                    <Icon name="lucide:sprout" size="10" /> À découvrir
                </span>
                <span v-else-if="isLive && twitchViewerCount !== null && twitchViewerCount < 50"
                    class="absolute top-3 right-3 flex items-center gap-1 text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded-md font-medium">
                    <Icon name="lucide:trending-up" size="10" /> En montée
                </span>
                <span v-else-if="isLive"
                    class="absolute top-3 right-3 flex items-center gap-1 text-[9px] bg-orange-500/20 text-orange-300 border border-orange-500/20 px-1.5 py-0.5 rounded-md font-medium">
                    <Icon name="lucide:flame" size="10" /> Populaire
                </span>

                <!-- Avatar -->
                <div class="relative flex-shrink-0">
                    <img :src="streamer.avatar_url || defaultAvatar" class="w-14 h-14 object-cover rounded-xl"
                        :class="isLive ? 'ring-2 ring-red-500/70' : 'ring-1 ring-zinc-700/80'"
                        :alt="streamer.username" />
                    <span v-if="isLive"
                        class="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none uppercase tracking-widest whitespace-nowrap">
                        <span class="w-1 h-1 rounded-full bg-white animate-pulse flex-shrink-0" />
                        live
                    </span>
                </div>

                <!-- Infos -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="font-semibold text-white truncate text-sm sm:text-base">{{ streamer.username
                        }}</span>
                        <img v-if="streamer?.language && streamer.language !== 'OTHER'"
                            :src="`https://flagcdn.com/w80/${getFlag(streamer.language)}.png`"
                            class="w-4 h-[11px] object-cover rounded-xs opacity-90 flex-shrink-0" />
                        <Icon v-else-if="streamer?.language === 'OTHER'" name="lucide:globe" size="13"
                            class="opacity-40 flex-shrink-0" />
                    </div>
                    <div class="flex items-center mt-1 gap-2 min-w-0">
                        <img v-if="gameCover" :src="gameCover" :alt="gameLabel"
                            class="w-6 h-8 rounded object-cover border border-zinc-700/50 flex-shrink-0" />
                        <div class="flex flex-col min-w-0">
                            <div class="flex items-center gap-1.5">
                                <span class="text-[13px] text-zinc-300 font-medium truncate">{{ gameLabel || '—'
                                }}</span>
                                <span v-if="isLive && twitchViewerCount !== null"
                                    class="flex items-center gap-1 text-zinc-500 flex-shrink-0 text-[11px]">
                                    <Icon name="lucide:eye" size="12" />{{ twitchViewerCount }}
                                </span>
                            </div>
                            <span class="text-[12px] text-zinc-500">{{ whenLabel }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2 CTA -->
            <div class="flex gap-2">
                <NuxtLink :to="`/${streamer.username}`" target="_blank"
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border border-zinc-700/60 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-sm font-medium transition-all duration-150">
                    <Icon name="lucide:user" size="16" />
                    <span>Profil</span>
                </NuxtLink>
                <component :is="isLive ? 'button' : 'a'"
                    v-bind="isLive ? {} : { href: `https://twitch.tv/${streamer.username}`, target: '_blank', rel: 'noopener noreferrer' }"
                    @click="isLive ? showModal = true : undefined"
                    class="flex-1 flex items-center justify-center gap-2 !px-3 !py-1.5 rounded-md border !text-sm font-medium transition-all duration-150 !bg-zinc-800 hover:!bg-zinc-700 !text-zinc-400 hover:!text-white !border-zinc-700/60 !no-underline">
                    <Icon name="simple-icons:twitch" size="16" class="shrink-0"/>
                    <span>{{ isLive ? 'Regarder' : 'Twitch' }}</span>
                </component>
            </div>
        </div>

        <!-- Modale player Twitch -->
        <Dialog v-model:visible="showModal" modal :dismissableMask="true"
            :style="{ width: '80vw', maxWidth: '80vw', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px', padding: 0, overflow: 'hidden' }"
            :pt="{ header: { style: 'display:none' }, content: { style: 'padding:0; background:#18181b; border-radius:16px; overflow:hidden' } }">
            <div class="flex flex-col">

                <!-- Header modale -->
                <div
                    class="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-zinc-800 flex-shrink-0 gap-3">
                    <div class="flex items-center gap-3">
                        <img :src="streamer.avatar_url || defaultAvatar"
                            class="w-9 h-9 rounded-xl object-cover ring-1 ring-zinc-700" />
                        <div class="flex min-w-0 justify-between w-full">
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-white">{{ streamer.username }}</span>
                                </div>
                                <div class="flex items-center gap-2 mt-0.5">
                                    <span class="text-xs text-zinc-400">{{ gameLabel }}{{ !isLive ? ' | ' + whenLabel :
                                        '' }}</span>
                                    <span v-if="isLive && twitchViewerCount !== null"
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
                            class="w-full sm:w-auto flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700/60 transition-all duration-150">
                            <Icon name="simple-icons:twitch" size="16" />
                            Voir sur Twitch
                        </a>
                        <!-- Bouton raid -->
                        <button @click="openRaidModal" :disabled="!canRaid || raidLoading" :class="[
                            'w-full sm:w-auto flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-150',
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

                <!-- Player + chat -->
                <div class="flex min-h-0">
                    <div class="flex-1 bg-black min-w-0">
                        <div v-if="showModal" id="twitch-embed" class="w-full" style="aspect-ratio: 16/9" />
                    </div>
                    <div class="hidden lg:block flex-shrink-0 border-l border-zinc-800"
                        style="aspect-ratio: unset; width: 340px">
                        <iframe v-if="showModal"
                            :src="`https://www.twitch.tv/embed/${streamer.username}/chat?parent=stream-link.fr&parent=www.stream-link.fr&parent=localhost&darkpopout`"
                            class="w-full h-full" style="min-height: 300px"
                            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals" />
                    </div>
                </div>
            </div>
        </Dialog>

        <!-- Modale de confirmation raid -->
        <Dialog v-model:visible="showRaidModal" modal :dismissableMask="true" :draggable="false"
            :style="{ width: '24rem', margin: '1rem' }">
            <template #container>
                <div class="flex flex-col gap-5 p-6 bg-zinc-900 rounded-2xl border border-zinc-700/60">
                    <!-- Header -->
                    <div class="flex items-center gap-3">
                        <img :src="streamer.avatar_url || defaultAvatar"
                            class="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700" />
                        <div>
                            <p class="font-semibold text-white text-sm">{{ streamer.username }}</p>
                            <p class="text-xs text-zinc-400">{{ gameLabel }} · {{ twitchViewerCount }} viewers</p>
                        </div>
                    </div>

                    <!-- Message -->
                    <div class="flex flex-col gap-1">
                        <p class="text-sm text-white font-medium">Lancer un raid vers {{ streamer.username }} ?</p>
                        <p class="text-xs text-zinc-400">
                            Vos viewers seront redirigés vers sa chaîne Twitch.
                        </p>
                    </div>

                    <!-- Récompense -->
                    <div
                        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <Icon name="lucide:coins" size="16" class="text-yellow-400 flex-shrink-0" />
                        <span class="text-sm text-yellow-300 font-medium">+{{ raidCoins }} Coins</span>
                        <span class="text-xs text-zinc-500 ml-auto">{{ raidStatus.remaining }}/{{ raidStatus.total }}
                            raids restants cette semaine</span>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2">
                        <Button severity="secondary" outlined @click="showRaidModal = false" class="flex-1">
                            <Icon name="lucide:x" size="16" />
                            Annuler
                        </Button>
                        <Button severity="contrast" @click="confirmRaid" :loading="raidLoading" class="flex-1">
                            <Icon name="lucide:swords" size="16" />
                            Raider
                        </Button>
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png"

const props = defineProps({
    streamer: { type: Object, required: true }
})

const user = useSupabaseUser()
const toast = useToast()

const showModal = ref(false)
const showRaidModal = ref(false)
const raidLoading = ref(false)

const { raidStatus, fetchStatus } = useRaidStatus()

// Charge le statut des raids au montage
onMounted(async () => {
    if (user.value) {
        await fetchStatus()
    }
})

const canRaid = computed(() => {
    if (!user.value) return false
    if (!isLive.value) return false
    return raidStatus.value.remaining > 0
})

const raidTooltip = computed(() => {
    if (!user.value) return 'Connectez-vous pour raider'
    if (!isLive.value) return 'Le streamer doit être en live'
    if (raidStatus.value.remaining === 0) return 'Limite de raids atteinte cette semaine'
    return `Raider ${props.streamer.username} et gagner ${raidCoins.value} Coins`
})

function openRaidModal() {
    if (!canRaid.value) return
    showRaidModal.value = true
}

async function confirmRaid() {
    raidLoading.value = true
    try {
        const supabase = useSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        const providerToken = session?.provider_token

        const { coinsEarned, raidedViaApi } = await $fetch<{ success: boolean; coinsEarned: number; raidedViaApi: boolean }>('/api/raids/create', {
            method: 'POST',
            body: {
                targetUsername: props.streamer.username,
                coinsEarned: raidCoins.value,
                providerToken,
            }
        })

        showRaidModal.value = false
        raidStatus.value.remaining--
        raidStatus.value.used++

        // Si pas de token Twitch → copie la commande dans le presse-papier
        if (!raidedViaApi) {
            navigator.clipboard.writeText(`/raid ${props.streamer.username}`)
            toast.add({
                severity: 'success',
                summary: 'Raid lancé !',
                detail: `+${coinsEarned} Coins · Commande /raid copiée dans le presse-papier`,
                life: 4000,
            })
        } else {
            toast.add({
                severity: 'success',
                summary: 'Raid lancé !',
                detail: `+${coinsEarned} Coins gagnés`,
                life: 3000,
            })
        }
    } catch (err: any) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err?.data?.message ?? 'Une erreur est survenue',
            life: 4000,
        })
    } finally {
        raidLoading.value = false
    }
}

watch(showModal, (val) => {
    if (val) {
        nextTick(() => {
            const container = document.getElementById('twitch-embed')
            const width = container?.clientWidth || 854
            const height = Math.round(width * 9 / 16)
            const script = document.createElement('script')
            script.src = 'https://embed.twitch.tv/embed/v1.js'
            script.onload = () => {
                new (window as any).Twitch.Embed('twitch-embed', {
                    width,
                    height,
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

const isLive = computed(() => props.streamer.nextSlot?.isLive === true)

const gameLabel = computed(() => {
    if (isLive.value && props.streamer.nextSlot?.twitchGameName) return props.streamer.nextSlot.twitchGameName
    return props.streamer.nextSlot?.game?.label || ''
})

const gameCover = computed(() => {
    if (isLive.value) return props.streamer.nextSlot?.twitchGameCover || null
    return props.streamer.nextSlot?.game?.cover || null
})

const twitchViewerCount = computed(() => props.streamer.nextSlot?.twitchViewerCount ?? null)

const whenLabel = computed(() => {
    if (isLive.value) return 'En live'
    const slot = props.streamer.nextSlot
    if (!slot) return 'Aucun planning'
    const time = formatTime(slot.start_at)
    if (slot.isToday) return `Aujourd'hui · ${time}`
    if (slot.isTomorrow) return `Demain · ${time}`
    return `${slot.day} · ${time}`
})

const raidCoins = computed(() => {
    const viewers = twitchViewerCount.value ?? 0
    if (viewers < 5) return 7
    if (viewers < 15) return 6
    if (viewers < 50) return 5
    if (viewers < 150) return 4
    return 3
})

function formatTime(time: string) {
    if (!time) return ''
    const [h, m] = time.split(':')
    return `${h}h${m}`
}
</script>