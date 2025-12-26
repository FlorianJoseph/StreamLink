<template>
    <div class="relative w-32 h-44 rounded-xl overflow-hidden cursor-pointer transition
               hover:scale-105 hover:ring-2 hover:ring-white/20"
        :style="{ backgroundColor: '#' + theme.wallpaper_style.backgroundColor }">
        <!-- Fake content -->
        <div class="flex flex-col gap-2 px-3 py-4">
            <!-- Fake avatar -->
            <div class="w-8 h-8 rounded-full bg-white/20 mx-auto" />

            <!-- Fake username -->
            <div class="h-2 w-16 bg-white/30 rounded mx-auto" />

            <!-- Fake buttons -->
            <div class="flex flex-col gap-1 mt-3">
                <div v-for="i in 2" :key="i" :class="[
                    'h-6 w-full flex items-center justify-center text-[9px] font-medium',
                    theme.button_style.borderRadius,
                    buttonClass,
                ]" :style="buttonStyle">
                    Bouton
                </div>
            </div>
        </div>

        <!-- Label -->
        <div class="absolute bottom-0 inset-x-0 text-center text-xs font-semibold py-1
                    bg-black/40 backdrop-blur">
            {{ theme.label }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    theme: {
        type: Object,
        required: true,
    },
})

const buttonClass = computed(() => {
    if (props.theme.button_style.variant === 'outlined') {
        return 'bg-transparent border'
    }
    return ''
})

const buttonStyle = computed(() => {
    const btn = props.theme.button_style

    if (btn.variant === 'outlined') {
        return {
            borderColor: `#${btn.backgroundColor}`,
            color: `#${btn.textColor}`,
        }
    }

    return {
        backgroundColor: `#${btn.backgroundColor}`,
        color: `#${btn.textColor}`,
    }
})
</script>
