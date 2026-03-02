<template>
    <div class="rounded-2xl p-6 border-2 border-zinc-700">
        <h3 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-6">
            Activation Funnel
        </h3>

        <div class="space-y-6">
            <div v-for="(step, index) in steps" :key="step.label" class="relative">
                <div class="flex items-center justify-between">
                    <span class="text-gray-300 font-medium">{{ step.label }}</span>
                    <span class="text-gray-300 font-semibold">{{ step.value }}</span>
                </div>

                <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-2 rounded-full transition-all duration-500"
                        :style="{ width: step.percentage + '%', background: step.highlight ? 'linear-gradient(to right, #10b981, #059669)' : 'linear-gradient(to right, #8b5cf6, #a78bfa)' }" />
                </div>

                <p v-if="index > 0" class="text-xs text-gray-400 mt-1">
                    {{ step.percentage }}% conversion
                </p>
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
}>()
</script>