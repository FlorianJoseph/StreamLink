<template>
    <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <p class="text-xs uppercase tracking-wide text-gray-400">
            {{ label }}
        </p>

        <p class="mt-2 text-3xl font-semibold text-gray-900">
            {{ value }}
        </p>

        <div v-if="sub" class="mt-1 flex items-center gap-1 text-sm font-medium" :class="subColorClass">
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
}>()

const subColorClass = computed(() => {
    if (props.trend === 'up') return 'text-green-600'
    if (props.trend === 'down') return 'text-red-600'
    return 'text-gray-500'
})
</script>