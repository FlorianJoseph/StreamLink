<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width:40px;height:40px;--p-progressspinner-color-one:#6A5AE0;--p-progressspinner-color-two:#8B7FF0;--p-progressspinner-color-three:#6A5AE0;--p-progressspinner-color-four:#4A3AC0"
            strokeWidth="6" fill="transparent" animationDuration=".5s" />
    </div>
    <div v-else>
        <div
            class="flex flex-col lg:flex-row sm:max-w-4xl lg:max-w-5xl xl:max-w-full sm:gap-6 lg:gap-12 xl:gap-24 2xl:gap-42 fade-in py-6">
            <!-- Édition du streamlink -->
            <div class="flex-1 lg:flex-[2] min-w-0">
                <StreamLinkDesign />
            </div>
            <div class="hidden lg:block w-px bg-white/8 self-stretch" />
            <div class="lg:hidden h-px bg-white/8 mt-8" />
            <!-- Aperçu du streamlink -->
            <div class="sticky top-0 lg:self-start mx-auto">
                <StreamLinkPreview />
            </div>
        </div>
    </div>
</template>

<script setup>
// Stores
const streamerStore = useStreamerStore()
const { loading } = storeToRefs(streamerStore)
const { uid } = useSupabase()
const linkStore = useLinkStore()
const designStore = useDesignStore()

watch(uid, async (val) => {
    if (val) {
        await streamerStore.fetchStreamer()
    }
}, { immediate: true })

onMounted(async () => {
    await Promise.all([
        linkStore.fetchLinks(),
        designStore.fetchDesign()
    ])
})
</script>

<style scoped>
/* Petite animation d’apparition douce du contenu */
.fade-in {
    animation: fadeIn 0.4s ease forwards;
    opacity: 0;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}
</style>