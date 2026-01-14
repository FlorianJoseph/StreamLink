<template>
    <Card class="border border-zinc-700">
        <template #header>
            <div class="flex items-center justify-between p-4">
                <div class="flex flex-col">
                    <h2 class="text-lg font-semibold">Visibilité du profil</h2>
                    <p class="text-xs sm:text-sm text-gray-400 max-w-9/10 sm:max-w-full">
                        <span v-if="profileVisible">
                            Ton profil est maintenant visible !
                        </span>
                        <span v-else>
                            Complète au moins 2 des 3 quêtes pour apparaître sur la page découverte
                        </span>
                    </p>
                </div>
                <Icon :name="profileVisible ? 'lucide:circle-check' : 'lucide:circle-alert'"
                    :class="profileVisible ? 'text-green-400' : 'text-yellow-400'" size="24" class="flex-shrink-0" />
            </div>
        </template>
        <template #content>
            <!-- Barre de progression -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs sm:text-sm text-gray-400">Complétion</span>
                    <span class="text-xs sm:text-sm font-semibold ">{{ completedQuests }}/{{ totalQuests }} quêtes
                        complétées</span>
                </div>
                <ProgressBar :value="completionPercentage" :showValue="false"
                    style="--p-progressbar-value-background: linear-gradient(to right, #10b981, #059669)" />
            </div>

            <!-- Liste des items de complétion -->
            <div class="space-y-3 mb-6">
                <div v-for="(item, index) in completionItems" :key="index" class="flex items-center gap-3">
                    <div :class="[
                        'flex items-center justify-center',
                        item.completed ? 'text-green-400' : 'text-yellow-400/60'
                    ]">
                        <Icon :name="item.completed ? 'lucide:circle-check' : 'lucide:circle-alert'" size="18" />
                    </div>
                    <NuxtLink v-if="!item.completed" :to="item.to" class="hover:underline text-gray-500">
                        <span class="text-sm sm:text-base">{{ item.label }}</span>
                    </NuxtLink>
                    <span v-else class="text-sm sm:text-base text-gray-300">{{ item.label }}</span>
                </div>
            </div>

            <!-- Bouton vers design -->
            <div class="space-y-3">
                <!-- Bouton principal : Compléter le profil -->
                <NuxtLink to="/admin/links" class="block">
                    <Button class="w-full" severity="contrast">
                        <Icon name="lucide:link" size="18" />
                        <span class="text-sm sm:text-base">Gérer mes liens</span>
                    </Button>
                </NuxtLink>

                <!-- Bouton secondaire : Design -->
                <NuxtLink to="/admin/design" class="block">
                    <Button class="w-full" severity="secondary" outlined>
                        <Icon name="lucide:palette" size="18" />
                        <span class="text-sm sm:text-base">Personnaliser mon design</span>
                    </Button>
                </NuxtLink>
            </div>
        </template>
    </Card>
</template>

<script setup>
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)
const linkStore = useLinkStore()
const { links } = storeToRefs(linkStore)

// Items de complétion du profil
const completionItems = computed(() => [
    { label: 'Ajouter une photo de profil', completed: !!streamer.value?.avatar_url, to: '/admin/design' },
    { label: 'Rédiger une description', completed: !!streamer.value?.bio, to: '/admin/links' },
    { label: 'Ajouter au moins un lien', completed: (links.value?.length || 0) > 0, to: '/admin/links' },
])

const totalQuests = completionItems.value.length
// Pourcentage de complétion
const completionPercentage = computed(() => Math.round((completedQuests.value / completionItems.value.length) * 100))

// Profil visible si au moins 2/3
const profileVisible = computed(() => completedQuests.value >= 2)

// Nombre de quêtes complétées
const completedQuests = computed(() => completionItems.value.filter(i => i.completed).length)

</script>