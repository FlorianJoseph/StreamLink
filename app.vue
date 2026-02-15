<template>
    <NuxtLayout>
        <Toast />
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup>
useHead({
    htmlAttrs: {
        class: 'app-dark'
    }
})
</script>