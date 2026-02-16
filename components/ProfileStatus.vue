<template>
    <Card class="border border-zinc-700 h-full">
        <template #header>
            <div class="p-4">
                <div class="mb-4">
                    <h2 class="text-lg font-semibold">Visibilité du profil</h2>
                    <p class="text-xs sm:text-sm text-gray-400">
                        Utilise les outils et rend ton profil visible sur la page Découverte
                    </p>
                </div>

                <!-- Bloc principal fusionné -->
                <div :class="stats.profileVisible
                    ? 'border-green-500/30'
                    : 'border-yellow-500/30'"
                    class="p-4 rounded-lg border space-y-3 bg-zinc-800/30 ring-1 ring-white/5">

                    <!-- Ligne statut -->
                    <div class="flex items-start gap-2">
                        <Icon :name="stats.profileVisible ? 'lucide:check-circle' : 'lucide:alert-circle'"
                            :class="stats.profileVisible ? 'text-green-400' : 'text-yellow-400'" size="18" />

                        <div class="flex-1">
                            <p class="text-sm font-semibold"
                                :class="stats.profileVisible ? 'text-zinc-200' : 'text-yellow-200'">
                                {{
                                    stats.profileVisible
                                        ? getProfileMessage()
                                        : 'Ton profil n’est pas encore visible sur la page Découverte'
                                }}
                            </p>

                            <p v-if="stats.completionPercentage < 100" class="text-xs mt-1"
                                :class="stats.completedRequired < getRequiredCount() ? 'text-yellow-200/80' : 'text-blue-300/80'">
                                {{ getNextStepMessage() }}
                            </p>
                        </div>
                    </div>

                    <!-- Progression compacte -->
                    <div>
                        <ProgressBar :value="stats.completionPercentage" :showValue="false"
                            style="--p-progressbar-value-background: linear-gradient(to right, #10b981, #059669); height: 6px;" />

                        <div class="flex items-center justify-between mt-2">
                            <span class="text-xs text-gray-400">
                                {{ stats.completedTotal }}/{{ stats.total }} quêtes
                            </span>
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-bold text-white">
                                    {{ stats.completionPercentage }}%
                                </span>

                                <!-- Badge niveau -->
                                <!-- <div :key="stats.level.label"
                                    :class="`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs whitespace-nowrap ${stats.level.bgClass} ${stats.level.textClass} ring-1 ring-white/10`">
                                    <Icon :name="getLevelIcon(stats.level.color)" size="14" />
                                    <span>{{ stats.level.label }}</span>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #content>
            <div class="space-y-5">

                <!-- Section 1 : Quêtes essentielles -->
                <div>
                    <div class="flex items-center gap-2 mb-2 px-2">
                        <Icon name="lucide:shield-check" size="18" class="shrink-0"
                            :class="stats.completedRequired >= getRequiredCount() ? 'text-green-400' : 'text-red-400'" />
                        <span class="font-bold text-sm sm:text-base">
                            Essentielles
                        </span>
                        <span class="text-xs px-2 py-1 rounded-full font-medium ml-auto"
                            :class="stats.completedRequired >= getRequiredCount() ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'">
                            {{ stats.completedRequired }}/{{ getRequiredCount() }}
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
                                <Icon name="lucide:circle-check" size="18" class="text-green-400 shrink-0" />
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-300">{{ item.label }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Séparateur subtil -->
                <div class="border-t border-zinc-700/50"></div>

                <!-- Section 2 : Planning -->
                <div>
                    <div class="flex items-center gap-2 mb-3 px-2">
                        <Icon name="lucide:calendar-days" size="18" class="text-blue-400 shrink-0" />
                        <span class="font-bold text-sm sm:text-base">
                            Planning
                        </span>
                        <span v-if="hasPlanning"
                            class="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium ml-auto">
                            Actif
                        </span>
                        <span v-else
                            class="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium ml-auto">
                            Recommandé
                        </span>
                    </div>

                    <NuxtLink v-if="!hasPlanning" to="/schedule" class="group flex items-start gap-3 p-4 rounded-lg border-2 transition-all
                        border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50 hover:bg-blue-500/10">
                        <Icon name="lucide:sparkles" size="18" class="text-blue-400 shrink-0 mt-0.5" />
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-200 mb-1">Ajoute ton planning</p>
                            <div class="flex items-center gap-1 text-xs text-blue-400">
                                <Icon name="lucide:trending-up" size="14" />
                                <span>Ton prochain stream sera mis en avant sur la page Découverte</span>
                            </div>
                        </div>
                        <Icon name="lucide:arrow-right" size="18"
                            class="text-gray-400 group-hover:text-blue-400 transition-colors shrink-0 mt-0.5" />
                    </NuxtLink>

                    <div v-else class="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800/30">
                        <Icon name="lucide:circle-check" size="18" class="text-green-400 shrink-0" />
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-300">Planning configuré</p>
                        </div>
                        <NuxtLink to="/schedule" class="text-xs text-blue-400 hover:underline">
                            Modifier
                        </NuxtLink>
                    </div>
                </div>

                <!-- Séparateur subtil -->
                <div class="border-t border-zinc-700/50"></div>

                <!-- Section 3 : Améliorations optionnelles -->
                <div>
                    <div class="flex items-center gap-2 mb-3 px-2">
                        <Icon name="lucide:star" size="18" class="text-purple-400 shrink-0" />
                        <span class="font-bold text-sm sm:text-base">
                            Optionnelles
                        </span>
                        <span class="text-xs text-gray-500 ml-auto">
                            {{ getOptionalCompletedCount() }}/{{ getOptionalCount() }}
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

                <!-- Séparateur -->
                <!-- <div class="border-t border-zinc-700/50"></div> -->

                <!-- Bouton reset en bas -->
                <div class="px-2">
                    <Button label="Réinitialiser les notifications" severity="secondary" text size="small"
                        @click="showResetDialog = true" class="w-full justify-center" />
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
const { getQuests, getStats, getProfileMessage, resetNotifications } = useProfileProgress()

const stats = computed(() => getStats())

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

const getNextStepMessage = () => {
    const stats = getStats()

    if (stats.completedRequired < getRequiredCount()) {
        return `Complète ${getRequiredCount() - stats.completedRequired} quête(s) essentielle(s) pour débloquer la visibilité`
    }

    if (!hasPlanning.value) {
        return "Ajoute ton planning pour augmenter ta visibilité sur la Découverte"
    }

    if (getOptionalCompletedCount() < getOptionalCount()) {
        return `Plus que ${getOptionalCount() - getOptionalCompletedCount()} quête(s) optionnelle(s) pour un profil parfait`
    }

    return "Ton profil est au top !"
}

// Icons selon le niveau
const getLevelIcon = (color: string) => {
    const icons = {
        bronze: 'lucide:shield',
        silver: 'lucide:award',
        gold: 'lucide:crown',
        platinum: 'lucide:diamond',
        diamond: 'lucide:gem'
    }
    return icons[color] || 'lucide:star'
}
</script>
