<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else>
        <div class="flex flex-col gap-4 fade-in">
            <div class="py-4">
                <div class="flex flex-col lg:items-start items-center">
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                        Tableau de bord
                    </h1>
                    <p class="text-sm sm:text-base text-center lg:text-left max-w-xl">
                        Bienvenue, {{ streamer?.username || 'Streameur' }}
                    </p>
                </div>
                <!-- Bannière d'annonce -->
                <div class="mt-6 p-4 rounded-lg bg-indigo-900/50 border border-indigo-500/30">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                        <div class="flex items-center gap-3">
                            <Icon name="lucide:sparkles" class="text-indigo-400 shrink-0" size="24" />
                            <div>
                                <p class="font-semibold text-white text-sm sm:text-base">Nouveau : Planning !
                                </p>
                                <p class="text-xs sm:text-sm text-gray-300">Personnalise et partage ton planning de
                                    streams en
                                    quelques clics</p>
                            </div>
                        </div>
                        <NuxtLink to="/schedule" class="w-full sm:w-auto">
                            <Button severity="info" size="small"
                                class="w-full sm:w-auto flex items-center justify-center gap-2">
                                Essayer maintenant
                                <Icon name="lucide:arrow-right" size="16" />
                            </Button>
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <!-- Carte Visibilité -->
                <ProfileStatus />

                <!-- Carte Approfondir -->
                <Card class="border border-zinc-700">
                    <template #header>
                        <div class="p-3">
                            <h2 class="text-lg font-semibold">
                                Mets ton profil en avant sur la page Découverte
                            </h2>
                            <p class="text-xs sm:text-sm text-gray-400">
                                Approfondis ton profil pour attirer plus de visiteurs
                            </p>
                        </div>
                    </template>

                    <template #content>
                        <div class="space-y-3">
                            <NuxtLink v-for="section in profileSections" :key="section.label" :to="section.to" class="flex items-center justify-between p-3 rounded-lg border border-zinc-700
           hover:border-zinc-500 transition">
                                <div class="flex items-center gap-3">
                                    <Icon :name="section.icon" size="18" class="flex-shrink-0" :class="section.color" />
                                    <div>
                                        <p class="text-sm sm:text-base font-medium">
                                            {{ section.label }}
                                        </p>
                                        <p class="text-xs text-gray-400">
                                            {{ section.description }}
                                        </p>
                                        <span v-if="section.premium" class="text-[10px] px-2 py-0.5 rounded-full
           bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                            Premium
                                        </span>
                                    </div>
                                </div>
                                <Icon name="lucide:chevron-right" class="text-gray-500 flex-shrink-0" />
                            </NuxtLink>
                        </div>
                    </template>
                </Card>

                <!-- Carte Partage rapide -->
                <QRCode />

                <!-- Carte Outils -->
                <Card class="border border-zinc-700 lg:col-span-1">
                    <template #header>
                        <div class="p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                                <h2 class="text-lg font-semibold">Outils</h2>
                                <p class="text-xs sm:text-sm text-gray-400">
                                    Accède rapidement à tous tes outils StreamLink
                                </p>
                            </div>
                            <Tag class="border border-2 border-zinc-400/30"
                                style=" background: transparent; color: white">
                                <div class="flex items-center gap-2 px-1 py-1">
                                    <Icon name="lucide:sparkles" class="text-emerald-400 flex-shrink-0" size="16" />
                                    <span class="text-xs">Nouvelle section</span>
                                </div>
                            </Tag>
                        </div>
                    </template>
                    <template #content>
                        <div class="grid grid-cols-1 gap-4">
                            <NuxtLink v-for="tool in toolsSections" :key="tool.title" :to="tool.to" class="group flex flex-col gap-2 p-4 rounded-lg border-2 transition-all 
                                border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50">
                                <div class="flex items-center gap-2">
                                    <Icon :name="tool.icon" size="20" :class="`text-${tool.color}-400 shrink-0`" />
                                    <span class="font-semibold text-sm sm:text-base">{{ tool.title }}</span>
                                    <span v-if="tool.badge" :class="[
                                        'ml-auto text-xs px-2 py-1 rounded-full font-medium',
                                        `bg-${tool.color}-500 text-white`
                                    ]">
                                        {{ tool.badge }}
                                    </span>
                                </div>
                                <span class="text-xs sm:text-sm text-gray-300">
                                    {{ tool.description }}
                                </span>
                            </NuxtLink>

                            <!-- Placeholder pour futur outil -->
                            <div class="flex flex-col gap-2 p-4 rounded-lg border border-zinc-700 opacity-50">
                                <div class="flex items-center gap-2">
                                    <Icon name="lucide:settings" size="20" class="text-gray-500 shrink-0" />
                                    <span class="font-semibold text-sm sm:text-base text-gray-500">Autres outils</span>
                                    <span class="ml-auto text-xs px-2 py-1 rounded-full bg-zinc-700 text-gray-400">
                                        Bientôt
                                    </span>
                                </div>
                                <span class="text-xs sm:text-sm text-gray-500">
                                    D'autres outils arrivent prochainement
                                </span>
                            </div>
                        </div>
                    </template>
                </Card>

                <!-- Carte Nouvelles fonctionnalités / Coming soon -->
                <Card class="border border-zinc-700 lg:col-span-2">
                    <template #header>
                        <div class="p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                                <h2 class="text-lg font-semibold">Prochainement</h2>
                                <p class="text-xs sm:text-sm text-gray-400">
                                    De nouvelles fonctionnalités arrivent bientôt pour rendre ton StreamLink encore plus
                                    puissant !
                                </p>
                            </div>
                            <Tag class="border border-2 border-zinc-400/30"
                                style=" background: transparent; color: white">
                                <div class="flex items-center gap-2 px-1">
                                    <Icon name="lucide:star" class="text-pink-400 flex-shrink-0" size="16" />
                                    <span class="2xl:text-base text-sm">Accès anticipé</span>
                                </div>
                            </Tag>
                        </div>
                    </template>

                    <template #content>
                        <div class="space-y-2">
                            <p class="text-xs text-gray-500 italic">
                                La roadmap évolue selon les retours de la communauté
                            </p>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:bell" class="text-yellow-400" size="16" />
                                <span class="text-gray-400 text-sm">Notifications in-app</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:rocket" class="text-pink-400" size="16" />
                                <span class="text-gray-400 text-sm">Amélioration de la page Découverte</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:chart-bar" class="text-blue-400" size="16" />
                                <span class="text-gray-400 text-sm">Statistiques</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:users" class="text-purple-400" size="16" />
                                <span class="text-gray-400 text-sm">Collabs & raids entre streameurs</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:star" class="text-green-400" size="16" />
                                <span class="text-gray-400 text-sm">…et bien plus encore !</span>
                            </div>
                        </div>

                        <!-- Placeholder quand premium -->
                        <!-- <div class="space-y-3">
                            <div class="flex items-start gap-3">
                                <Icon name="lucide:bell" class="text-yellow-400 flex-shrink-0 mt-0.5" size="18" />
                                <div>
                                    <p class="text-sm text-gray-300 font-medium">Notifications in-app</p>
                                    <p class="text-xs text-gray-500">Reçois des alertes pour tes événements</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <Icon name="lucide:rocket" class="text-pink-400 flex-shrink-0 mt-0.5" size="18" />
                                <div>
                                    <p class="text-sm text-gray-300 font-medium">Boost Découverte</p>
                                    <p class="text-xs text-gray-500">Collabs, Raids et filtres avancés</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <Icon name="lucide:chart-bar" class="text-blue-400 flex-shrink-0 mt-0.5" size="18" />
                                <div>
                                    <p class="text-sm text-gray-300 font-medium">Statistiques détaillées</p>
                                    <p class="text-xs text-gray-500">Analyse tes performances en profondeur</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 my-4">
                                <div class="flex-1 border-t border-zinc-700"></div>
                                <span class="text-xs text-gray-500">Et aussi</span>
                                <div class="flex-1 border-t border-zinc-700"></div>
                            </div>

                            <div class="flex items-start gap-3 opacity-90">
                                <Icon name="lucide:palette" class="text-purple-400 flex-shrink-0 mt-0.5" size="18" />
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <p class="text-sm text-gray-300 font-medium">Thèmes personnalisés avancés</p>
                                        <span
                                            class="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                            Premium
                                        </span>
                                    </div>
                                    <p class="text-xs text-gray-500">Crée ton identité visuelle unique</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3 opacity-90">
                                <Icon name="lucide:star" class="text-emerald-400 flex-shrink-0 mt-0.5" size="18" />
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <p class="text-sm text-gray-300 font-medium">Priorité support & early access</p>
                                        <span
                                            class="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                            Premium
                                        </span>
                                    </div>
                                    <p class="text-xs text-gray-500">Accès anticipé aux nouvelles features</p>
                                </div>
                            </div>
                        </div> -->
                        <!-- Note rassurante quand il y aura le premium-->
                        <!-- <div class="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                            <div class="flex items-start gap-2">
                                <Icon name="lucide:info" class="text-indigo-400 flex-shrink-0 mt-0.5" size="16" />
                                <p class="text-xs text-gray-400">
                                    <strong class="text-gray-300">StreamLink reste gratuit !</strong> Les
                                    fonctionnalités Premium viendront compléter l'expérience pour ceux qui veulent aller
                                    plus loin.
                                </p>
                            </div>
                        </div> -->

                        <!-- CTA Newsletter -->
                        <div class="mt-4 pt-4 border-t border-zinc-700">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <p class="text-xs sm:text-sm text-gray-400 text-center">
                                    Sois informé en avant-première des nouvelles fonctionnalités StreamLink
                                </p>
                                <Button @click="subscribeIfNotYet" :disabled="newsletterStore.subscribed"
                                    severity="info" class="flex items-center gap-2">
                                    <Icon :name="newsletterStore.subscribed ? 'lucide:check' : 'lucide:mail-plus'"
                                        size="16" />
                                    <span class="text-sm sm:text-base">
                                        {{ newsletterStore.subscribed ? 'Inscrit aux nouveautés' :
                                            'Recevoir les nouveautés'
                                        }}</span>
                                </Button>
                            </div>
                        </div>
                    </template>
                </Card>
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
const user = useSupabaseUser()
const loading = ref(true)

const profileSections = [
    {
        label: 'Mon StreamLink',
        description: 'Personnalise ta page publique pour mieux te présenter',
        to: '/admin/links',
        icon: 'lucide:user',
        color: 'text-green-400'
    },
    {
        label: 'Planning',
        description: 'Ton prochain stream sera visible sur la page découverte',
        to: '/schedule',
        icon: 'lucide:calendar-days',
        color: 'text-blue-400'
    },
]

const toolsSections = [
    {
        icon: 'lucide:calendar-days',
        title: "Planning",
        description: "Personnalise et partage ton planning de streams facilement",
        badge: "Nouveau",
        to: "/schedule",
        color: "blue",
    },
]

onMounted(async () => {
    loading.value = true
    await newsletterStore.fetchStatus()
    loading.value = false
})

const subscribeIfNotYet = async () => {
    if (!newsletterStore.subscribed) {
        await newsletterStore.toggle()
    }
}

// Charger les données du streamer
watch(user, async (val) => {
    if (val) {
        loading.value = true
        await streamerStore.fetchStreamer(val.sub)

        const { data: schedule } = await scheduleStore.fetchSchedule()
        if (schedule?.id) {
            await scheduleSlotStore.fetchSlots(schedule.id)
        }

        await linkStore.fetchLinks()

        loading.value = false
    }
}, { immediate: true })

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