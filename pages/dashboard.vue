<template>
    <div class="flex flex-col gap-4">
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
                        <p class="text-sm text-gray-400">
                            Optimise ta page pour attirer plus de visiteurs
                        </p>
                    </div>
                </template>

                <template #content>
                    <div class="space-y-3">
                        <!-- Description -->
                        <NuxtLink to="/admin/links"
                            class="flex items-center justify-between p-3 rounded-lg border border-zinc-700 hover:border-zinc-500 transition">
                            <div class="flex items-center gap-3">
                                <Icon name="lucide:pen-line" size="18" class="text-indigo-400" />
                                <div>
                                    <p class="font-medium">Description</p>
                                    <p class="text-xs text-gray-400">
                                        Présente ton contenu et ton univers
                                    </p>
                                </div>
                            </div>
                            <Icon name="lucide:chevron-right" class="text-gray-500" />
                        </NuxtLink>

                        <!-- Liens -->
                        <NuxtLink to="/admin/links"
                            class="flex items-center justify-between p-3 rounded-lg border border-zinc-700 hover:border-zinc-500 transition">
                            <div class="flex items-center gap-3">
                                <Icon name="lucide:link" size="18" class="text-pink-400" />
                                <div>
                                    <p class="font-medium">Liens</p>
                                    <p class="text-xs text-gray-400">
                                        Ajoute et organise tes plateformes
                                    </p>
                                </div>
                            </div>
                            <Icon name="lucide:chevron-right" class="text-gray-500" />
                        </NuxtLink>

                        <!-- Design -->
                        <NuxtLink to="/admin/design"
                            class="flex items-center justify-between p-3 rounded-lg border border-zinc-700 hover:border-zinc-500 transition">
                            <div class="flex items-center gap-3">
                                <Icon name="lucide:palette" size="18" class="text-emerald-400" />
                                <div>
                                    <p class="font-medium">Design</p>
                                    <p class="text-xs text-gray-400">
                                        Personnalise l’apparence de ta page
                                    </p>
                                </div>
                            </div>
                            <Icon name="lucide:chevron-right" class="text-gray-500" />
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
                            <p class="text-sm text-gray-400">
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
                            <span class="text-gray-400 text-sm">Boost Découverte avec Collabs / Raid / Filtres</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:star" class="text-green-400" size="16" />
                            <span class="text-gray-400 text-sm">…et bien plus encore !</span>
                        </div>
                    </div>
                    <!-- CTA Newsletter -->
                    <div class="mt-4 pt-4 border-t border-zinc-700 px-4">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p class="text-sm text-gray-400">
                                Sois informé en avant-première des nouvelles fonctionnalités StreamLink
                            </p>
                            <Button @click="subscribeIfNotYet" :disabled="newsletterStore.subscribed" severity="info"
                                class="flex items-center gap-2">
                                <Icon :name="newsletterStore.subscribed ? 'lucide:check' : 'lucide:mail-plus'"
                                    size="16" />
                                {{ newsletterStore.subscribed ? 'Inscrit aux nouveautés' : 'Recevoir les nouveautés' }}
                            </Button>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)
const newsletterStore = useNewsletterStore()
const user = useSupabaseUser()
onMounted(() => newsletterStore.fetchStatus())

const subscribeIfNotYet = async () => {
    if (!newsletterStore.subscribed) {
        await newsletterStore.toggle()
    }
}

// Charger les données du streamer
watch(user, async (val) => {
    if (val) {
        await streamerStore.fetchStreamer(val.sub)
    }
}, { immediate: true })

definePageMeta({
    layout: 'dashboard'
})
</script>