<template>
    <div v-if="loading" class="flex justify-center items-center w-full py-20">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" fill="transparent" animationDuration=".5s"
            aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else class="mt-8">
        <div v-if="!streamer">
            <StreamLinkCreate />
        </div>
        <div v-else class="flex flex-col lg:flex-row lg:gap-48 gap-4">
            <ConfirmPopup></ConfirmPopup>
            <!-- Édition du streamlink -->
            <div class="flex-[2]">
                <StreamLinkEdit />
            </div>
            <div class="hidden sm:block">
                <Divider layout="vertical" />
            </div>
            <!-- Aperçu du streamlink -->
            <div class="flex-[1] sticky top-21 self-start">
                <StreamLinkPreview />
            </div>
        </div>
    </div>
</template>

<script setup>
// Stores
const streamerStore = useStreamerStore()
const { streamer, loading } = storeToRefs(streamerStore)
const user = useSupabaseUser()

watch(user, async (val) => {
    if (val) {
        await streamerStore.fetchStreamer(val.sub)
    }
}, { immediate: true })
</script>