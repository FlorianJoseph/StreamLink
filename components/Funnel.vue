<template>
    <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
            Activation Funnel
        </h3>

        <div class="space-y-6">
            <div v-for="(step, index) in steps" :key="step.label" class="relative">
                <div class="flex items-center justify-between">
                    <span class="text-gray-700 font-medium">{{ step.label }}</span>
                    <span class="text-gray-900 font-semibold">{{ step.value }}</span>
                </div>

                <div class="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-2 rounded-full transition-all duration-500"
                        :class="step.highlight ? 'bg-violet-500' : 'bg-indigo-500'"
                        :style="{ width: step.percentage + '%' }" />
                </div>

                <p v-if="index > 0" class="text-xs text-gray-400 mt-1">
                    {{ step.percentage }}% conversion
                </p>
            </div>
        </div>

        <!-- Séparateur -->
        <div class="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide">Funnel Integrity</p>
                <p class="text-lg font-semibold text-gray-900 mt-1">{{ funnelIntegrity }}%</p>
                <p class="text-xs text-gray-400">lien → stream</p>
            </div>
            <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide">Newsletter Visible</p>
                <p class="text-lg font-semibold text-gray-900 mt-1">{{ newsletterConversion }}%</p>
                <p class="text-xs text-gray-400">inscrits activés</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    steps: {
        label: string
        value: number
        percentage: number
        highlight?: boolean
    }[]
    funnelIntegrity: number
    newsletterConversion: number
}>()
</script>