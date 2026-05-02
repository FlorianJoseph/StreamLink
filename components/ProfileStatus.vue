<template>
    <div v-if="isReady" class="flex flex-col gap-4 p-4 bg-surface-dark border border-white/8 rounded-xl">

        <!-- Header statut -->
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2">
                <p class="text-white text-sm font-bold">Visibilité du profil</p>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold" :class="stats.profileVisible
                    ? 'bg-primary/15 text-primary'
                    : 'bg-white/5 text-muted'">
                    {{ stats.completionPercentage }}%
                </span>
            </div>

            <!-- Barre de progression -->
            <div class="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                    :class="stats.profileVisible ? 'bg-primary' : 'bg-white/20'"
                    :style="{ width: `${stats.completionPercentage}%` }" />
            </div>

            <!-- Message statut -->
            <p class="text-xs text-muted">
                {{ getNextStepMessage() }}
            </p>
        </div>

        <div class="h-px bg-white/5" />

        <!-- Essentielles -->
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <p class="text-white text-sm font-bold">Essentielles</p>
                <span v-if="stats.completedRequired < getRequiredCount()" class="text-xs font-bold text-muted">
                    {{ stats.completedRequired }}/{{ getRequiredCount() }}
                </span>
            </div>

            <div class="flex flex-col gap-1.5">
                <div v-for="(item, index) in getRequiredQuests()" :key="index">
                    <NuxtLink v-if="!item.completed" :to="item.to" class="group flex items-center gap-3 p-3 rounded-lg border border-white/8
                               hover:border-primary/25 hover:bg-primary/5">
                        <Icon name="lucide:circle-dashed" size="14" class="text-muted shrink-0" />
                        <p class="text-white text-sm flex-1">{{ item.label }}</p>
                        <div class="flex items-center gap-1 shrink-0">
                            <img src="/images/assets/charmi-monnaie-jaune.svg" class="w-3 h-3" alt="" />
                            <span class="text-xs font-bold text-accent">+{{ item.reward }}</span>
                        </div>
                        <Icon name="lucide:arrow-right" size="14"
                            class="text-muted group-hover:text-primary shrink-0" />
                    </NuxtLink>

                    <div v-else class="flex items-center gap-3 p-3 rounded-lg">
                        <Icon name="lucide:circle-check" size="14" class="text-primary shrink-0" />
                        <p class="text-muted text-sm flex-1">{{ item.label }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="h-px bg-white/5" />

        <!-- Planning -->
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <p class="text-white text-sm font-bold">Planning</p>
                <span v-if="!hasPlanning" class="text-xs font-bold text-muted">
                    Recommandé
                </span>
            </div>

            <NuxtLink v-if="!hasPlanning" to="/schedule" class="group flex items-center gap-3 p-3 rounded-lg border border-white/8
                       hover:border-primary/25 hover:bg-primary/5">
                <Icon name="lucide:circle-dashed" size="14" class="text-muted shrink-0" />
                <div class="flex-1 min-w-0">
                    <p class="text-white text-sm">Ajoute ton planning</p>
                    <p class="text-muted text-xs mt-0.5">Tes streams seront mis en avant sur la Découverte</p>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <img src="/images/assets/charmi-monnaie-jaune.svg" class="w-3 h-3" alt="" />
                    <span class="text-xs font-bold text-accent">+{{ getPlanningQuest()?.reward }}</span>
                </div>
                <Icon name="lucide:arrow-right" size="14" class="text-muted group-hover:text-primary shrink-0" />
            </NuxtLink>

            <div v-else class="flex items-center gap-3 p-3 rounded-lg">
                <Icon name="lucide:circle-check" size="14" class="text-primary shrink-0" />
                <p class="text-muted text-sm flex-1">Planning configuré</p>
            </div>
        </div>

        <div class="h-px bg-white/5" />

        <!-- Optionnelles -->
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <p class="text-white text-sm font-bold">Optionnelles</p>
                <span v-if="getOptionalCompletedCount() < getOptionalCount()" class="text-xs text-muted">
                    {{ getOptionalCompletedCount() }}/{{ getOptionalCount() }}
                </span>
            </div>

            <div class="flex flex-col gap-1.5">
                <div v-for="(item, index) in getOptionalQuests()" :key="index">
                    <NuxtLink v-if="!item.completed" :to="item.to" class="group flex items-center gap-3 p-3 rounded-lg border border-white/8
                               hover:border-primary/25 hover:bg-primary/5">
                        <Icon name="lucide:circle-dashed" size="14" class="text-muted shrink-0" />
                        <p class="text-white text-sm flex-1">{{ item.label }}</p>
                        <div class="flex items-center gap-1 shrink-0">
                            <img src="/images/assets/charmi-monnaie-jaune.svg" class="w-3 h-3" alt="" />
                            <span class="text-xs font-bold text-accent">+{{ item.reward }}</span>
                        </div>
                        <Icon name="lucide:arrow-right" size="14"
                            class="text-muted group-hover:text-primary shrink-0" />
                    </NuxtLink>

                    <div v-else class="flex items-center gap-3 p-3 rounded-lg">
                        <Icon name="lucide:circle-check" size="14" class="text-primary shrink-0" />
                        <p class="text-muted text-sm flex-1">{{ item.label }}</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
const { getQuests, getStats, isReady } = useProfileProgress()

const stats = computed(() => getStats())

const getRequiredQuests = () => getQuests().filter(q => q.type === 'required')
const getOptionalQuests = () => getQuests().filter(q => q.type === 'optional' && q.id !== 'schedule')
const getPlanningQuest = () => getQuests().find(q => q.id === 'schedule')

const getRequiredCount = () => getRequiredQuests().length
const getOptionalCount = () => getOptionalQuests().length
const getOptionalCompletedCount = () => getOptionalQuests().filter(q => q.completed).length

const hasPlanning = computed(() => getPlanningQuest()?.completed || false)

const getNextStepMessage = () => {
    const stats = getStats()
    const remaining = getRequiredCount() - stats.completedRequired

    if (remaining > 0) {
        return remaining === 1
            ? '1 quête essentielle restante'
            : `${remaining} quêtes essentielles restantes`
    }
    if (!hasPlanning.value) {
        return "Ajoute ton planning pour booster ta visibilité"
    }
    const optRemaining = getOptionalCount() - getOptionalCompletedCount()
    if (optRemaining > 0) {
        return optRemaining === 1
            ? "Plus qu'une quête pour un profil parfait"
            : `Plus que ${optRemaining} quêtes pour un profil parfait`
    }
    return "Ton profil est au top !"
}
</script>