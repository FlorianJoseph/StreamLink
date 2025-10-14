<template>
    <div v-if="loading" class="flex justify-center w-full py-20">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" fill="transparent" animationDuration=".5s"
            aria-label="Custom ProgressSpinner" />
    </div>
    <StreamLinkContent v-else />
    <Toast />
</template>

<script setup>
definePageMeta({
    layout: 'links'
})

// Stores
const streamerStore = useStreamerStore()
const { loading } = storeToRefs(streamerStore)

</script>
