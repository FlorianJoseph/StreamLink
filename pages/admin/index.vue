<template>
    <div v-if="loading" class="flex justify-center items-center w-full py-20">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" fill="transparent" animationDuration=".5s"
            aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else class="mt-8">
        <div v-if="!streamer">
            <StreamLinkCreate @created="onStreamerCreated" />
        </div>
        <div v-else class="flex flex-col lg:flex-row lg:gap-48 gap-4">
            <Toast />
            <div class="flex-[2]">
                <StreamLinkEdit :streamer="streamer" :links="links" @add="addLink" @update="updateLink"
                    @delete="deleteLink" @updateStreamer="updateStreamer" @updateOrder="updateOrder" />
            </div>
            <!-- Aperçu du streamlink -->
            <div class="flex-[1]">
                <StreamLinkPreview :links="links" :streamer="streamer" />
            </div>
        </div>
    </div>
</template>

<script setup>

const { streamer, updateStreamer, loading } = useStreamer()
const { links, addLink, updateLink, deleteLink, updateOrder } = useLink()

const onStreamerCreated = (data) => {
    streamer.value = data
}

</script>