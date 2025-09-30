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
            <StreamLinkEdit />
        </div>
    </div>
</template>

<script setup>

const { loading, streamer } = useStreamer()

const onStreamerCreated = (data) => {
    streamer.value = data
}

</script>