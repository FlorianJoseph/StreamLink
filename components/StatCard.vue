<template>
    <div class="border border-white/8 rounded-xl p-4 bg-surface-dark">
        <p class="text-xs font-bold text-muted uppercase tracking-wider">
            {{ label }}
        </p>

        <p class="mt-2 text-3xl font-bold text-primary">
            {{ value }}
        </p>

        <!-- Breakdown 7j / 30j -->
        <div v-if="breakdown" class="mt-3 flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
                <span class="text-xs text-muted">7 jours</span>
                <span class="text-xs font-semibold text-white">{{ fmt(breakdown.d7) }}</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-xs text-muted">30 jours</span>
                <span class="text-xs font-semibold text-white">{{ fmt(breakdown.d30) }}</span>
            </div>
            <div class="pt-2 mt-1 border-t border-white/8 flex items-center justify-between">
                <span class="text-xs text-muted">7j / 30j</span>
                <span class="text-xs font-bold" :class="ratioColor">{{ ratio }}%</span>
            </div>
        </div>

        <!-- Note -->
        <div v-else-if="note" class="mt-2 text-xs text-muted">
            {{ note }}
        </div>

        <!-- Sub + trend -->
        <div v-else-if="sub" class="mt-1.5 flex items-center gap-1 text-sm font-semibold" :class="subColorClass">
            <Icon v-if="trend === 'up'" name="lucide:move-up-right" size="15" />
            <Icon v-else-if="trend === 'down'" name="lucide:move-down-right" size="15" />
            <Icon v-else-if="trend === 'neutral'" name="lucide:minus" size="15" />
            <span>{{ sub }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string
    value: string | number
    sub?: string
    trend?: 'up' | 'down' | 'neutral'
    breakdown?: { d7: number; d30: number }
    note?: string
}>()

const fmt = (n: number) => n > 0 ? `+${n}` : `${n}`

const ratio = computed(() => {
    if (!props.breakdown || props.breakdown.d30 === 0) return 0
    return Math.round((props.breakdown.d7 / props.breakdown.d30) * 100)
})

const ratioColor = computed(() => {
    if (!props.breakdown) return ''
    const r = ratio.value
    if (r >= 40) return 'text-emerald-400'
    if (r >= 20) return 'text-amber-400'
    return 'text-red-400'
})

const subColorClass = computed(() => {
    if (props.trend === 'up') return 'text-emerald-400'
    if (props.trend === 'down') return 'text-red-400'
    return 'text-gray-500'
})
</script>