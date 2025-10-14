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
            <Toast />
            <div class="flex-[2]">
                <!--  -->
                <StreamLinkEdit />
            </div>
            <!-- Aperçu du streamlink -->
            <div class="flex-[1]">
                <StreamLinkPreview />
            </div>
        </div>
    </div>
</template>

<script setup>
// Stores
const streamerStore = useStreamerStore()
const { streamer, loading } = storeToRefs(streamerStore)

</script>