<template>
    <Card class="border border-zinc-700">
        <template #header>
            <div class="p-3">
                <h2 class="text-lg font-semibold">Partager ta page</h2>
                <p class="text-sm text-gray-400">
                    Diffuse ton lien partout en un clic !
                </p>
            </div>
        </template>
        <template #content>
            <!-- Lien à copier -->
            <div class="mb-4">
                <div class="flex gap-2">
                    <InputText type="text" class="flex-1" v-model="shareUrl" readonly
                        style="--p-inputtext-focus-border-color:none" />
                    <Button @click="copyLink" :severity="copied ? 'success' : 'secondary'" outlined>
                        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" size="18" class="flex-shrink-0" />
                        <span class="transition-all duration-200">{{ copied ? "Copié !" : "Copier" }}</span>
                    </Button>
                </div>
            </div>

            <!-- QR Code -->
            <div class="bg-white p-4 rounded-lg">
                <div ref="qrcodeContainer" class="flex justify-center"></div>
                <p class="text-center text-xs text-gray-600 mt-2">
                    Scanne pour accéder à ta page
                </p>
            </div>

        </template>
    </Card>
</template>

<script setup>
import QRCode from 'qrcode'
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)

// Partage
const shareUrl = computed(() => `https://stream-link.fr/${streamer.value?.username || ''}`)

const copied = ref(false)

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(shareUrl.value)
        copied.value = true
        setTimeout(() => copied.value = false, 2000)
    } catch (err) {
        console.error('Erreur copie:', err)
    }
}

const qrcodeContainer = ref(null)
watch([streamer, qrcodeContainer], async ([streamerVal, container]) => {
    if (streamerVal?.username && container) {
        try {
            const canvas = await QRCode.toCanvas(shareUrl.value, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })
            container.innerHTML = ''
            container.appendChild(canvas)
        } catch (err) {
            console.error('Erreur QR Code:', err)
        }
    }
}, { immediate: true })
</script>
