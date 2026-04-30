<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width:40px;height:40px;--p-progressspinner-color-one:#6A5AE0;--p-progressspinner-color-two:#8B7FF0;--p-progressspinner-color-three:#6A5AE0;--p-progressspinner-color-four:#4A3AC0"
            strokeWidth="6" fill="transparent" animationDuration=".5s" />
    </div>
    <div v-else>
        <div class="flex flex-col gap-4 fade-in">
            <div class="py-4">
                <header class="flex flex-col lg:items-start items-center">
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                        {{ greeting }}, <span class="text-primary">{{ streamer?.username || 'Streamer' }}</span>
                    </h1>
                </header>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Carte Visibilité -->
                <div class="lg:col-span-1">
                    <ProfileStatus />
                </div>
                <div class="lg:col-span-2 flex flex-col gap-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">

                        <!-- Col 2 — Outils + Charm empilés en flex-col -->
                        <div class="flex flex-col gap-6">

                            <!-- Outils -->
                            <div class="flex flex-col gap-2 p-4 bg-white/[0.03] border border-white/8 rounded-xl">
                                <p class="text-white text-sm font-bold">Accès rapide</p>
                                <div class="flex flex-col gap-1">
                                    <NuxtLink v-for="tool in toolsSections" :key="tool.title" :to="tool.to" class="group flex items-center gap-3 p-3 rounded-lg border border-transparent
                                   hover:border-primary/25 hover:bg-primary/5">
                                        <Icon :name="tool.icon" size="18" class="text-primary shrink-0" />
                                        <div class="flex-1 min-w-0">
                                            <p class="text-white text-sm leading-tight">{{ tool.title }}</p>
                                            <p class="text-muted text-xs mt-0.5 truncate">{{ tool.description }}</p>
                                        </div>
                                        <Icon name="lucide:arrow-right" size="14"
                                            class="text-muted group-hover:text-primary shrink-0" />
                                    </NuxtLink>
                                </div>
                            </div>

                            <!-- Charm quotidien -->
                            <div class="rounded-xl p-5 border flex flex-col gap-4" :class="{
                                'bg-primary/8 border-primary/20': isSub,
                                'bg-white/[0.03] border-white/8': !isSub && dailyClaimed,
                                'bg-accent/8 border-accent/20': !isSub && !dailyClaimed,
                            }">

                                <div class="flex items-center justify-between gap-2">
                                    <p class="text-white text-sm font-bold">Connexion quotidienne</p>
                                    <img src="/images/assets/charmi-monnaie-jaune.svg" class="w-5 h-5 shrink-0"
                                        alt="" />
                                </div>

                                <div class="flex items-baseline justify-between gap-2">
                                    <div class="flex items-baseline gap-1.5">
                                        <span class="text-2xl font-bold"
                                            :class="dailyClaimed && !isSub ? 'text-white/30' : isSub ? 'text-white' : 'text-accent'">
                                            {{ isSub ? '+6' : '+3' }}
                                        </span>
                                        <span class="text-muted text-xs">Charm / jour</span>
                                    </div>
                                    <NuxtLink v-if="!isSub" to="/shop"
                                        class="text-xs text-muted hover:text-white transition-colors shrink-0">
                                        Abonne-toi → 6/jour auto
                                    </NuxtLink>
                                    <div v-else class="text-xs text-muted shrink-0">
                                        Abonnement actif
                                    </div>
                                </div>
                                <template v-if="isSub">
                                    <div class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md
                        bg-primary/10 text-primary text-sm font-bold">
                                        Récompense automatique
                                    </div>
                                </template>

                                <template v-else-if="dailyClaimed">
                                    <div disabled class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md
                            bg-white/5 text-muted text-sm font-bold">
                                        Déjà récupéré
                                    </div>
                                </template>

                                <template v-else>
                                    <button :disabled="dailyLoading"
                                        class="w-full flex items-center justify-center gap-2 bg-accent text-dark hover:bg-accent/90 transition-colors font-bold px-3 py-2 rounded-md"
                                        @click="claimDaily">
                                        <Icon v-if="dailyLoading" name="lucide:loader-circle" size="16"
                                            class="animate-spin shrink-0" />
                                        <span v-if="!dailyLoading" class="text-sm font-bold">Réclamer</span>
                                    </button>
                                </template>
                            </div>
                        </div>

                        <!-- Carte Partage rapide -->
                        <QRCode />
                    </div>

                    <!-- Prochainement -->
                    <div class="lg:col-span-2 p-4 bg-white/[0.03] border border-white/8 rounded-xl
                        flex flex-col sm:flex-row sm:items-start gap-5">

                        <!-- Items roadmap -->
                        <div class="flex-1 flex flex-col gap-3 min-w-0">
                            <div>
                                <p class="text-white text-sm font-bold">Prochainement</p>
                                <p class="text-xs text-muted italic">
                                    La roadmap évolue selon les retours de la communauté
                                </p>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <div v-for="item in roadmapItems" :key="item.label" class="flex items-center gap-1.5">
                                    <Icon :name="item.icon" size="18" :class="`${item.color} shrink-0`" />
                                    <span class="text-sm text-muted">{{ item.label }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- CTAs -->
                        <div class="flex flex-col gap-2 shrink-0 self-center w-full sm:w-45">
                            <p class="text-xs text-muted hidden sm:block">Être informé en avant-première</p>
                            <button @click="subscribeIfNotYet" :disabled="newsletterStore.subscribed"
                                class="flex items-center gap-2 w-full justify-center px-3 py-1.5 rounded-md text-sm font-bold transition-colors"
                                :class="newsletterStore.subscribed
                                    ? 'bg-primary/30 text-white/50'
                                    : 'bg-primary text-white hover:bg-primary/90'"
                                :style="newsletterStore.subscribed ? { cursor: 'default', pointerEvents: 'auto' } : {}">
                                <Icon :name="newsletterStore.subscribed ? 'lucide:check' : 'lucide:mail-plus'" size="16"
                                    class="shrink-0" />
                                <span>{{ newsletterStore.subscribed ? 'Inscrit' : 'Me notifier' }}</span>
                            </button>
                            <a href="https://discord.gg/fVFguWc76b" target="_blank">
                                <button
                                    class="flex items-center gap-2 w-full justify-center px-3 py-1.5 rounded-md bg-[#5865f2] text-[#e0e3ff] hover:bg-[#5865f2]/90 transition-colors">
                                    <Icon name="simple-icons:discord" size="16" />
                                    <span class="text-sm">Discord</span>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const streamerStore = useStreamerStore()
const scheduleStore = useScheduleStore()
const scheduleSlotStore = useScheduleSlotStore()
const linkStore = useLinkStore()
const { streamer } = storeToRefs(streamerStore)
const newsletterStore = useNewsletterStore()
const loading = ref(true)
const { uid } = useSupabase()
const { fetchBalance } = useWallet()
const { isSub, fetchSubscription } = useFeatures()
const toast = useToast()
const dailyClaimed = ref(false)
const dailyLoading = ref(false)

const greeting = computed(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
})

const claimDaily = async () => {
    dailyLoading.value = true
    try {
        const { credited } = await $fetch('/api/quests/daily', { method: 'POST' })
        if (credited) {
            dailyClaimed.value = true
            await fetchBalance()
            toast.add({
                severity: 'secondary',
                group: 'quest',
                summary: 'Connexion quotidienne',
                detail: '3',
                life: 4000,
            })
        } else {
            dailyClaimed.value = true
        }
    } finally {
        dailyLoading.value = false
    }
}

watch(uid, async (val) => {
    if (val) {
        await streamerStore.fetchStreamer(uid.value)
    }
}, { immediate: true })

const toolsSections = [
    {
        icon: 'lucide:link',
        title: 'Page de liens',
        description: 'Partage tout en un lien',
        to: '/admin/links',
    },
    {
        icon: 'lucide:calendar-days',
        title: "Planning",
        description: "Dis à ta commu quand tu stream",
        to: "/schedule",
    },
]

const roadmapItems = [
    { icon: 'lucide:chart-column', label: 'Stats avancées', color: 'text-blue-400' },
    { icon: 'simple-icons:twitch', label: 'Synchronisation Twitch', color: 'text-purple-400' },
    { icon: 'simple-icons:discord', label: 'Export Discord', color: 'text-indigo-400' },
]

onMounted(async () => {
    loading.value = true
    await fetchSubscription()
    await newsletterStore.fetchStatus()
    const { data: schedule } = await scheduleStore.fetchSchedule()
    if (schedule?.id) await scheduleSlotStore.fetchSlots(schedule.id)
    await linkStore.fetchLinks()
    const { claimed } = await $fetch('/api/quests/daily')
    dailyClaimed.value = claimed
    loading.value = false
})

const subscribeIfNotYet = async () => {
    if (!newsletterStore.subscribed) await newsletterStore.toggle()
}

definePageMeta({
    layout: 'fullscreen'
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
</style>