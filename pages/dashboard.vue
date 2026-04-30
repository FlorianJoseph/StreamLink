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
                        Bon retour, <span class="text-primary">{{ streamer?.username || 'Streamer' }}</span>
                    </h1>
                    <p class="text-sm sm:text-base text-center lg:text-left max-w-xl text-muted">
                        Keep on streaming.
                    </p>
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
                                <h2 class="text-white text-sm">Accès rapide</h2>
                                <div class="flex flex-col gap-1">
                                    <NuxtLink v-for="tool in toolsSections" :key="tool.title" :to="tool.to" class="group flex items-center gap-3 p-3 rounded-lg border border-transparent
                                   hover:border-primary/25 hover:bg-primary/5 transition-all duration-200">
                                        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0
                                        group-hover:bg-primary/20 transition-colors duration-200">
                                            <Icon :name="tool.icon" size="15" class="text-primary" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-white text-sm font-bold leading-tight">{{ tool.title }}</p>
                                            <p class="text-muted text-xs mt-0.5 truncate">{{ tool.description }}</p>
                                        </div>
                                        <Icon name="lucide:arrow-right" size="14"
                                            class="text-muted group-hover:text-primary transition-colors duration-200 shrink-0" />
                                    </NuxtLink>
                                </div>
                            </div>

                            <!-- Charm quotidien -->
                            <div class="rounded-xl p-5 border flex flex-col gap-4 transition-colors duration-200"
                                :class="{
                                    'bg-primary/8 border-primary/20': isSub,
                                    'bg-white/[0.03] border-white/8': !isSub && dailyClaimed,
                                    'bg-accent/8 border-accent/20': !isSub && !dailyClaimed,
                                }">

                                <div class="flex items-center justify-between gap-2">
                                    <h3 class="text-white text-sm">Connexion quotidienne</h3>
                                    <img src="/images/assets/charmi-monnaie-jaune.svg" class="w-5 h-5 shrink-0"
                                        alt="" />
                                </div>

                                <!-- Abonné -->
                                <template v-if="isSub">
                                    <div class="flex flex-col gap-1">
                                        <div class="flex items-baseline gap-1.5">
                                            <span class="text-2xl font-bold text-white">+6</span>
                                            <span class="text-muted text-xs">Charm / jour</span>
                                        </div>
                                        <p class="text-muted text-xs">Crédités automatiquement chaque matin. ✦</p>
                                    </div>
                                    <span class="inline-flex items-center gap-1.5 text-xs text-primary font-bold w-fit">
                                        <Icon name="lucide:check-circle" size="13" />
                                        Abonné actif
                                    </span>
                                </template>

                                <!-- Free — déjà récupéré -->
                                <template v-else-if="dailyClaimed">
                                    <div class="flex flex-col gap-1">
                                        <div class="flex items-baseline gap-1.5">
                                            <span class="text-2xl font-bold text-white/30">+3</span>
                                            <span class="text-muted text-xs">Charm</span>
                                        </div>
                                        <p class="text-muted text-xs">Reviens demain pour ta prochaine récompense.</p>
                                    </div>
                                    <span class="inline-flex items-center gap-1.5 text-xs text-muted w-fit">
                                        <Icon name="lucide:check" size="13" />
                                        Récupéré aujourd'hui
                                    </span>
                                    <NuxtLink to="/shop"
                                        class="text-xs text-primary hover:underline transition-opacity">
                                        Abonne-toi → 6 Charm/jour auto
                                    </NuxtLink>
                                </template>

                                <!-- Free — à réclamer -->
                                <template v-else>
                                    <div class="flex flex-col gap-1">
                                        <div class="flex items-baseline gap-1.5">
                                            <span class="text-2xl font-bold text-accent">+3</span>
                                            <span class="text-muted text-xs">Charm aujourd'hui</span>
                                        </div>
                                        <p class="text-muted text-xs">Connecte-toi chaque jour pour accumuler des Charm.
                                        </p>
                                    </div>
                                    <Button :disabled="dailyLoading"
                                        class="w-full flex items-center justify-center gap-2"
                                        style="background:#FFC82C;border-color:#FFC82C;color:#1E1F22"
                                        @click="claimDaily">
                                        <Icon v-if="dailyLoading" name="lucide:loader-circle" size="15"
                                            class="animate-spin shrink-0" />
                                        <img v-else src="/images/assets/charmi-monnaie-jaune.svg"
                                            class="w-4 h-4 shrink-0" alt="" />
                                        <span class="text-sm font-bold">Réclamer</span>
                                    </Button>
                                    <NuxtLink to="/shop"
                                        class="text-xs text-center text-muted hover:text-white transition-colors">
                                        Abonne-toi → 6 Charm/jour auto
                                    </NuxtLink>
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
        title: 'Ma page de liens',
        description: 'Gère tes liens et personnalise ta page publique',
        to: '/admin/links',
        color: 'green'
    },
    {
        icon: 'lucide:calendar-days',
        title: "Mon planning",
        description: "Personnalise et partage ton planning de streams facilement",
        // badge: "Nouveau",
        to: "/schedule",
        color: "blue",
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