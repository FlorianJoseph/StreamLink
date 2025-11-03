<template>
    <div v-if="loading" class="flex justify-center items-center w-full py-20">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" fill="transparent" animationDuration=".5s"
            aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else>
        <div v-if="!streamer">
            <StreamLinkCreate />
        </div>
        <div v-else
            class="flex flex-col lg:flex-row sm:max-w-4xl lg:max-w-5xl xl:max-w-full sm:gap-6 lg:gap-12 xl:gap-24 2xl:gap-42">
            <ConfirmPopup></ConfirmPopup>
            <!-- Édition du streamlink -->
            <div class="flex-1 lg:flex-[2] min-w-0">
                <StreamLinkEdit />
            </div>
            <div class="hidden lg:block">
                <Divider layout="vertical" />
            </div>
            <div class="lg:hidden block">
                <Divider />
            </div>
            <!-- Aperçu du streamlink -->
            <div class="sticky top-21 lg:self-start mx-auto">
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