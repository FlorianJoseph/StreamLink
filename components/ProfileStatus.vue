<template>
    <Card class="border border-zinc-700">
        <template #header>
            <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-lg font-semibold">Visibilité du profil</h2>
                </div>

                <!-- Statut principal -->
                <div :class="getStats().profileVisible ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'"
                    class="flex items-start gap-2 p-3 rounded-lg border">
                    <Icon :name="getStats().profileVisible ? 'lucide:check-circle' : 'lucide:alert-circle'"
                        :class="getStats().profileVisible ? 'text-green-400' : 'text-yellow-400'" size="18" />
                    <div class="flex-1">
                        <p class="text-sm font-semibold"
                            :class="getStats().profileVisible ? 'text-green-200' : 'text-yellow-200'">
                            {{ getStats().profileVisible ? getProfileMessage() :
                                'Ton profil n’est pas encore visible sur la page Découverte' }}
                        </p>
                        <p v-if="!getStats().profileVisible" class="text-xs text-yellow-200/80">
                            Complète {{ getRequiredCount() - getStats().completedRequired }} quête(s) essentielles pour
                            être découvert
                        </p>
                    </div>
                </div>
                <Button label="Réinitialiser les notifications" severity="secondary" text size="small"
                    @click="showResetDialog = true" />
            </div>
        </template>

        <template #content>
            <!-- Section 0 : Niveau et progression -->
            <div
                class="mb-6 p-4 rounded-lg border border-zinc-700/50 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <Icon name="lucide:trophy" size="18" class="text-yellow-400" />
                        <span class="text-sm font-medium text-gray-300">Niveau du profil</span>
                    </div>
                    <Transition name="level-change" mode="out-in">
                        <span :key="getStats().level.label"
                            :class="`px-3 py-1 text-sm rounded-full font-semibold ${getStats().level.bgClass} ${getStats().level.textClass} shadow-lg transition-all duration-300`">
                            {{ getStats().level.label }}
                        </span>
                    </Transition>
                </div>

                <!-- Progress bar custom avec gradient et animation -->
                <div class="relative">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs text-gray-400">Progression</span>
                        <span class="text-sm font-bold text-white">{{ getStats().completionPercentage }}%</span>
                    </div>

                    <!-- Barre custom au lieu de PrimeVue -->
                    <div class="relative h-3 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                        <div class="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                            :class="'bg-gradient-to-r from-green-500 to-emerald-500'"
                            :style="{ width: `${getStats().completionPercentage}%` }">
                            <!-- Effet de brillance qui se déplace -->
                            <div
                                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer">
                            </div>
                        </div>

                        <!-- Points de milestone -->
                        <div class="absolute inset-0 flex items-center justify-between px-1">
                            <div v-for="milestone in [25, 50, 75, 100]" :key="milestone"
                                class="w-1 h-1 rounded-full bg-zinc-600"
                                :class="{ 'bg-white': getStats().completionPercentage >= milestone }">
                            </div>
                        </div>
                    </div>

                    <!-- Indicateur de quêtes restantes -->
                    <div class="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Icon name="lucide:target" size="12" />
                        <span>{{ getStats().completedTotal }}/{{ getStats().total }} quêtes complétées</span>
                    </div>
                </div>
            </div>
            <!-- Section 1 : Quêtes obligatoires (2/3) -->
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <div class="flex items-center gap-2 flex-1">
                        <Icon name="lucide:shield-check" size="18" class="text-red-400" />
                        <h3 class="text-base font-semibold text-gray-200">Obligatoires pour être visible</h3>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full font-medium"
                        :class="getStats().completedRequired >= getRequiredCount() ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'">
                        {{ getStats().completedRequired }}/{{ getRequiredCount() }} complétées
                    </span>
                </div>

                <div class="space-y-2">
                    <div v-for="(item, index) in getRequiredQuests()" :key="index" class="group">
                        <NuxtLink v-if="!item.completed" :to="item.to"
                            class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                                border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50 hover:bg-yellow-500/10">
                            <Icon name="lucide:circle-alert" size="20" class="text-yellow-400 shrink-0" />
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-200">{{ item.label }}</p>
                            </div>
                            <Icon name="lucide:arrow-right" size="18"
                                class="text-gray-400 group-hover:text-yellow-400 transition-colors" />
                        </NuxtLink>

                        <div v-else
                            class="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800/30">
                            <Icon name="lucide:circle-check" size="20" class="text-green-400 shrink-0" />
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-300">{{ item.label }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 2 : Planning (optionnel mais valorisé) -->
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <Icon name="lucide:calendar-days" size="18" class="text-blue-400" />
                    <h3 class="text-base font-semibold text-gray-200">Planning de streams</h3>
                    <span v-if="!hasPlanning"
                        class="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                        Recommandé
                    </span>
                </div>

                <NuxtLink v-if="!hasPlanning" to="/schedule" class="group flex items-start gap-3 p-4 rounded-lg border-2 transition-all
                        border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50 hover:bg-blue-500/10">
                    <Icon name="lucide:sparkles" size="20" class="text-blue-400 shrink-0 mt-0.5" />
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-200 mb-1">Ajoute ton planning</p>
                        <p class="text-xs text-gray-400 mb-2">
                            Ton <strong>prochain stream</strong> apparaîtra en avant sur la page Découverte
                        </p>
                        <div class="flex items-center gap-1 text-xs text-blue-400">
                            <Icon name="lucide:trending-up" size="14" />
                            <span>Jusqu'à 3x plus de visibilité</span>
                        </div>
                    </div>
                    <Icon name="lucide:arrow-right" size="18"
                        class="text-gray-400 group-hover:text-blue-400 transition-colors shrink-0 mt-0.5" />
                </NuxtLink>

                <div v-else class="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800/30">
                    <Icon name="lucide:circle-check" size="20" class="text-green-400 shrink-0" />
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-300">Planning configuré</p>
                    </div>
                    <NuxtLink to="/schedule" class="text-xs text-blue-400 hover:underline">
                        Modifier
                    </NuxtLink>
                </div>
            </div>

            <!-- Section 3 : Autres améliorations -->
            <div>
                <div class="flex items-center gap-2 mb-3">
                    <Icon name="lucide:star" size="18" class="text-purple-400" />
                    <h3 class="text-base font-semibold text-gray-200">Améliore encore ton profil</h3>
                    <span class="text-xs text-gray-500">
                        ({{ getOptionalCompletedCount() }}/{{ getOptionalCount() }})
                    </span>
                </div>

                <div class="space-y-2">
                    <div v-for="(item, index) in getOptionalQuests()" :key="index" class="group">
                        <NuxtLink v-if="!item.completed" :to="item.to" class="flex items-center gap-3 p-3 rounded-lg border transition-all
                                border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/30">
                            <Icon name="lucide:circle" size="18" class="text-gray-500 shrink-0" />
                            <div class="flex-1">
                                <p class="text-sm text-gray-300">{{ item.label }}</p>
                            </div>
                            <Icon name="lucide:arrow-right" size="16"
                                class="text-gray-500 group-hover:text-gray-400 transition-colors" />
                        </NuxtLink>

                        <div v-else
                            class="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800/30">
                            <Icon name="lucide:circle-check" size="18" class="text-green-400 shrink-0" />
                            <p class="text-sm text-gray-300 flex-1">{{ item.label }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>

    <!-- Dialog de confirmation reset -->
    <Dialog v-model:visible="showResetDialog" header="Réinitialiser les notifications ?" :modal="true"
        :style="{ width: '25rem' }">
        <p class="text-sm text-gray-300 mb-2">
            Tu recevras à nouveau toutes les notifications pour les quêtes déjà complétées.
        </p>
        <template #footer>
            <Button label="Annuler" severity="secondary" @click="showResetDialog = false" text />
            <Button label="Réinitialiser" severity="danger" @click="handleReset" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { get } from 'node:http'


const { getQuests, getStats, getProfileMessage, resetNotifications } = useProfileProgress()

// Helpers pour filtrer les quêtes
const getRequiredQuests = () => getQuests().filter(q => q.type === 'required')
const getOptionalQuests = () => getQuests().filter(q => q.type === 'optional' && q.id !== 'schedule')
const getPlanningQuest = () => getQuests().find(q => q.id === 'schedule')

const getRequiredCount = () => getRequiredQuests().length
const getOptionalCount = () => getOptionalQuests().length
const getOptionalCompletedCount = () => getOptionalQuests().filter(q => q.completed).length

const hasPlanning = computed(() => getPlanningQuest()?.completed || false)

const showResetDialog = ref(false)

const handleReset = () => {
    resetNotifications()
    showResetDialog.value = false
}
</script>