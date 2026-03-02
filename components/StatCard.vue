<template>
    <div class="border-2 border-zinc-700 rounded-2xl p-6">
        <p class="font-semibold text-xs uppercase tracking-wider text-gray-400">
            {{ label }}
        </p>

        <p class="mt-2 text-3xl font-semibold text-purple-500">
            {{ value }}
        </p>

        <!-- Mode breakdown : 7j / 30j / ratio -->
        <div v-if="breakdown" class="mt-3 space-y-1.5">
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">7 jours</span>
                <span class="text-xs font-medium text-gray-300">{{ fmt(breakdown.d7) }}</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">30 jours</span>
                <span class="text-xs font-medium text-gray-300">{{ fmt(breakdown.d30) }}</span>
            </div>
            <div class="mt-2 pt-2 border-t border-zinc-700 flex items-center justify-between">
                <span class="text-xs text-gray-500">7j / 30j</span>
                <span class="text-xs font-semibold" :class="ratioColor">
                    {{ ratio }}%
                </span>
            </div>
        </div>

        <div v-else-if="note" class="mt-2 text-xs text-gray-500">
            {{ note }}
        </div>

        <!-- Mode sub classique -->
        <div v-else-if="sub" class="mt-1 flex items-center gap-1 text-sm font-medium" :class="subColorClass">
            <span v-if="trend === 'up'">
                <Icon name="lucide:move-up-right" />
            </span>
            <span v-else-if="trend === 'down'">
                <Icon name="lucide:move-down-right" />
            </span>
            <span v-else-if="trend === 'neutral'">
                <Icon name="lucide:minus" />
            </span>
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