<script setup lang="ts">
type LogoVariant = 'full' | 'centred' | 'favicon' | 'logotype'
type LogoColor = 'violet' | 'jaune' | 'blanc' | 'noir'

interface Props {
    variant?: LogoVariant
    color?: LogoColor
    width?: number | string
    height?: number | string
    alt?: string
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'full',
    color: 'violet',
    alt: 'Charmi',
})

const src = computed(() =>
    `/images/logo/charmi-${props.variant}-${props.color}.svg`
)
</script>

<template>
    <img :src="src" :alt="alt" class="block" :style="{ height: height ? `${height}px` : 'auto', width: 'auto' }"
        loading="lazy" decoding="async" />
</template>