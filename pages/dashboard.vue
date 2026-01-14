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
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                        Tableau de bord
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center lg:text-left max-w-xl">
                        Bienvenue, {{ streamer?.username || 'Streameur' }}
                    </p>
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
                                Approfondir ton profil
                            </h2>
                            <p class="text-xs sm:text-sm text-gray-400">
                                Optimise ta page pour attirer plus de visiteurs
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
                            <Tag class="border border-2 border-zinc-400/30 bg-indigo-500"
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
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:calendar" class="text-indigo-400" size="16" />
                                <span class="text-gray-400 text-sm">Création et partage de planning</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:bell" class="text-yellow-400" size="16" />
                                <span class="text-gray-400 text-sm">Notifications in-app</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:rocket" class="text-pink-400" size="16" />
                                <span class="text-gray-400 text-sm">Boost Découverte avec Collabs / Raid /
                                    Filtres</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:star" class="text-green-400" size="16" />
                                <span class="text-gray-400 text-sm">…et bien plus encore !</span>
                            </div>
                        </div>
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
const { streamer } = storeToRefs(streamerStore)
const newsletterStore = useNewsletterStore()
const user = useSupabaseUser()
const loading = ref(true)

const profileSections = [
    {
        label: 'Description',
        description: 'Présente ton contenu et ton univers',
        to: '/admin/links',
        icon: 'lucide:pen-line',
        color: 'text-indigo-400'
    },
    {
        label: 'Liens',
        description: 'Ajoute et organise tes plateformes',
        to: '/admin/links',
        icon: 'lucide:link',
        color: 'text-pink-400'
    },
    {
        label: 'Design',
        description: 'Personnalise l’apparence de ta page',
        to: '/admin/design',
        icon: 'lucide:palette',
        color: 'text-emerald-400'
    },
    // {
    //     label: 'Statistiques avancées',
    //     icon: 'lucide:star',
    //     color: 'text-yellow-400',
    //     premium: true
    // }
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
        loading.value = false
    }
}, { immediate: true })

definePageMeta({
    layout: 'dashboard'
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