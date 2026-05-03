<template>
    <div class="rounded-xl p-5 border border-white/8 bg-surface-dark">
        <h3 class="text-xs font-bold text-muted uppercase tracking-wider mb-5">
            Activation Funnel
        </h3>

        <div class="flex flex-col gap-5">
            <div v-for="(step, index) in steps" :key="step.label">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-white font-medium">{{ step.label }}</span>
                    <span class="text-sm text-white font-bold">{{ step.value }}</span>
                </div>

                <div class="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div class="h-1.5 rounded-full transition-all duration-500" :style="{
                        width: step.percentage + '%',
                        background: step.highlight
                            ? 'linear-gradient(to right, #10b981, #059669)'
                            : 'linear-gradient(to right, #6A5AE0, #a89ff0)'
                    }" />
                </div>

                <p v-if="index > 0" class="text-xs text-muted mt-1">
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