<template>
    <div class="flex flex-col gap-3 p-4 rounded-xl bg-surface-dark border border-white/8">
        <!-- URL -->
        <div class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface-darker border border-white/8">
            <Icon name="lucide:link" size="14" class="text-muted shrink-0" />
            <span class="text-sm text-muted truncate flex-1 min-w-0">{{ url }}</span>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
            <button @click="copyText"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors">
                <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" size="16" class="shrink-0" />
                {{ copied ? 'Copié !' : 'Copier le lien' }}
            </button>
            <NuxtLink :to="`/${streamer?.username}`" target="_blank">
                <button v-tooltip.bottom="{ value: 'Ouvrir dans un nouvel onglet', pt: { text: '!text-xs' } }"
                    class="flex items-center justify-center w-10 h-10 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-muted hover:text-white transition-colors">
                    <Icon name="lucide:external-link" size="16" />
                </button>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)

const url = computed(() => {
    const username = streamerStore.streamer?.username
    return username ? `${window.location.host.replace(/^www\./, '')}/${username}` : ''
})

const copied = ref(false)
const copyText = () => {
    const username = streamerStore.streamer?.username
    if (username) navigator.clipboard.writeText(`${window.location.origin}/${username}`)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
}
</script>