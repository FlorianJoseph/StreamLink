<template>
    <div class="card flex justify-center">
        <Button type="button" severity="contrast" @click="toggle">
            <span>streamlink.com/{{ streamer?.username }}</span>
            <Icon name="lucide:share" size="20" />
        </Button>
        <Popover ref="op">
            <div class="flex flex-col gap-2 w-[25rem]">
                <h1 class="font-semibold text-lg">Partagez votre StreamLink</h1>
                <Divider />
                <!-- Aperçu du lien -->
                <div class="flex items-center bg-gray-100/10 rounded-2xl justify-between pr-4 cursor-pointer"
                    @click="copyText">
                    <p ref="linkText" class="m-4">
                        streamlink.com/{{ streamer?.username }}
                    </p>
                    <Tag :severity="copied ? 'success' : 'secondary'" class="transition-all duration-300">
                        {{ copied ? 'Copié !' : 'Copier' }}
                    </Tag>
                </div>
                <NuxtLink :to="{ path: `/${streamer?.username}` }" target="_blank">
                    <div class="flex justify-between items-center hover:bg-gray-400/10 rounded-md transition w-full px-2 py-4 h"
                        severity="contrast" variant="outlined">
                        <span>Ouvrir dans un nouvel onglet</span>
                        <Icon name="lucide:external-link" size="20" />
                    </div>
                </NuxtLink>
            </div>
        </Popover>
    </div>
</template>

<script setup>
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)

const op = ref();

const toggle = (event) => {
    op.value.toggle(event);
}

// Copier le lien
const linkText = ref(null)
const copied = ref(false)
const copyText = () => {
    if (linkText.value) navigator.clipboard.writeText(`https://${linkText.value.innerText}`)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
}
</script>
