<template>
    <div class="flex flex-col min-h-screen" :style="{ backgroundColor: pageBackgroundColor ?? '#121212' }">
        <!-- Contenu principal -->
        <main class="mx-auto min-h-screen max-w-xl sm:pt-13 flex w-full">
            <slot />
        </main>
    </div>
</template>

<script setup>
const designStore = useDesignStore()
const { publicDesign } = storeToRefs(designStore)

function deriveBackgroundColor(hex) {
    const c = hex.replace('#', '')
    let r = parseInt(c.substr(0, 2), 16) / 255
    let g = parseInt(c.substr(2, 2), 16) / 255
    let b = parseInt(c.substr(4, 2), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }

    s = Math.max(0, s - 0.08) // désaturation
    l = Math.max(l - 0.05, 0.18) // assombrissement

    // back to RGB
    function hue2rgb(p, q, t) {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s
    let p = 2 * l - q

    r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255)
    g = Math.round(hue2rgb(p, q, h) * 255)
    b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255)

    return `#${r.toString(16).padStart(2, '0')}${g
        .toString(16)
        .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const wallpaperColor = computed(() => {
    const color = publicDesign.value?.wallpaper_style?.backgroundColor ?? '2E2E2E'
    return `#${color}`
})

const pageBackgroundColor = computed(() => {
    return deriveBackgroundColor(wallpaperColor.value, 16)
})
</script>