<template>
    <Card class="border border-zinc-700">
        <template #header>
            <div class="flex items-center justify-between p-4">
                <div class="flex flex-col">
                    <h2 class="text-lg font-semibold">Visibilité du profil</h2>
                    <p class="text-xs sm:text-sm text-gray-400 max-w-9/10 sm:max-w-full">
                        <span v-if="getStats().profileVisible">
                            {{ getProfileMessage() }}
                        </span>
                        <span v-else>
                            Complète les {{ getStats().completedRequired }}/{{ getStats().total }} quêtes essentielles
                            pour apparaître sur la page Découverte
                        </span>
                    </p>
                </div>
                <div>
                    <Icon :name="getStats().profileVisible ? 'lucide:circle-check' : 'lucide:circle-alert'"
                        :class="getStats().profileVisible ? 'text-green-400' : 'text-yellow-400'" size="24"
                        class="flex-shrink-0" />
                </div>
            </div>
        </template>

        <template #content>
            <!-- Barre de progression globale -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs sm:text-sm text-gray-400">Complétion globale</span>
                    <span class="text-xs sm:text-sm font-semibold">
                        {{ getStats().completedTotal }}/{{ getStats().total }} quêtes
                    </span>
                </div>
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-sm font-semibold">Niveau du profil :</span>
                    <span
                        :class="`px-2 py-1 text-xs rounded-full font-medium ${getStats().level.bgClass} ${getStats().level.textClass}`">
                        {{ getStats().level.label }}
                    </span>
                </div>
                <ProgressBar :value="getStats().completionPercentage" :showValue="false"
                    style="--p-progressbar-value-background: linear-gradient(to right, #10b981, #059669); height: 8px;" />
            </div>

            <!-- Quêtes essentielles -->
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <Icon name="lucide:star" size="16" class="text-yellow-400" />
                    <h3 class="text-sm font-semibold text-gray-200">Pour apparaître sur la page Découverte</h3>
                    <span class="text-xs text-gray-500">({{ getStats().completedRequired }}/{{ getStats().total
                        }})</span>
                </div>
                <div class="space-y-3">
                    <div v-for="(item, index) in getQuests().filter(q => q.type === 'required')" :key="index"
                        class="flex items-center gap-3">
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
            </div>

            <!-- Quêtes optionnelles -->
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <Icon name="lucide:sparkles" size="16" class="text-blue-400" />
                    <h3 class="text-sm font-semibold text-gray-200">Pour faire apparaître ton prochain stream</h3>
                    <span class="text-xs text-gray-500">({{ getStats().completedOptional }}/{{ getStats().total
                        }})</span>
                </div>
                <div class="space-y-3">
                    <div v-for="(item, index) in getQuests().filter(q => q.type === 'optional')" :key="index"
                        class="flex items-center gap-3">
                        <div
                            :class="['flex items-center justify-center', item.completed ? 'text-green-400' : 'text-gray-500']">
                            <Icon :name="item.completed ? 'lucide:circle-check' : 'lucide:circle'" size="18" />
                        </div>
                        <NuxtLink v-if="!item.completed" :to="item.to" class="hover:underline text-gray-500">
                            <span class="text-sm sm:text-base">{{ item.label }}</span>
                        </NuxtLink>
                        <span v-else class="text-sm sm:text-base text-gray-300">{{ item.label }}</span>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
const { getQuests, getStats, getProfileMessage } = useProfileProgress()
</script>
