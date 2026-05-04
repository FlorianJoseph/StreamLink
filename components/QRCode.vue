<template>
    <div class="flex flex-col gap-3 p-4 bg-surface-dark border border-white/8 rounded-xl">
        <p class="text-white text-sm font-bold">Partager ta page</p>

        <!-- Lien + Copier -->
        <div class="flex gap-2">
            <input type="text" :value="shareUrl" readonly class="flex-1 min-w-0 px-3 py-1.5 rounded-md bg-white/5 border border-white/8
                       text-white text-sm truncate outline-none" />
            <button @click="copyLink"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold shrink-0" :class="copied
                    ? 'bg-white/10 text-white'
                    : 'bg-white/5 border border-white/8 text-muted hover:text-white'">
                <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" size="16" class="shrink-0" />
                {{ copied ? 'Copié !' : 'Copier' }}
            </button>
        </div>

        <!-- QR Code -->
        <div class="bg-white rounded-lg p-3 flex flex-col items-center gap-2">
            <div ref="qrcodeContainer"></div>
            <p class="text-xs text-gray-500">Scanne pour accéder à ta page</p>
        </div>

    </div>
</template>

<script setup>
import QRCode from 'qrcode'

const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)

const shareUrl = computed(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/${streamer.value?.username || ''}`
})

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
            const size = 215
            const canvas = await QRCode.toCanvas(shareUrl.value, {
                width: size,
                margin: 1,
                errorCorrectionLevel: 'H',
                color: {
                    dark: '#1E1F22',
                    light: '#FFFFFF',
                },
            })

            const ctx = canvas.getContext('2d')
            const logoSize = 38
            const center = size / 2

            const logo = new Image()
            logo.src = '/images/logo/charmi-favicon-noir.svg'
            await new Promise((resolve) => {
                logo.onload = () => {
                    ctx.beginPath()
                    ctx.arc(center, center, logoSize / 2 + 5, 0, 2 * Math.PI)
                    ctx.fillStyle = '#FFFFFF'
                    ctx.fill()

                    ctx.drawImage(logo, center - logoSize / 2, center - logoSize / 2, logoSize, logoSize)
                    resolve()
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