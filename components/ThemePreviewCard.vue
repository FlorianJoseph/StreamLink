<template>
    <div class="flex flex-col items-center gap-1">
        <div class="relative rounded-xl overflow-hidden cursor-pointer transition 
    hover:ring-2 hover:ring-white hover:ring-2 hover:ring-white border-2 border-black "
            :style="{ backgroundColor: '#' + theme.wallpaper_style.backgroundColor }" :class="{
                'ring-2 ring-white': isSelected
            }" style="width: 100px; height: 110px" @mouseenter="hovered = true" @mouseleave="hovered = false">

            <!-- Aa en haut à gauche -->
            <div class="absolute top-3 left-3">
                <span class="text-2xl leading-none"
                    :style="{ color: '#' + theme.username_style.textColor, fontFamily: theme.font_family }">
                    Aa
                </span>
            </div>

            <!-- Fake button -->
            <div :class="['absolute bottom-4 left-3 right-3 h-8 w-full flex items-center justify-center text-[9px] font-medium',
                theme.button_style.borderRadius,
                buttonClass,
            ]" :style="buttonStyle">
            </div>

            <!-- Badge exclusif -->
            <div v-if="theme.premium && !hasAccess"
                class="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 py-0.5 px-1.5 rounded-full text-[9px] font-semibold bg-amber-500 text-amber-950 overflow-hidden transition-all duration-200">
                <span class="whitespace-nowrap overflow-hidden transition-all duration-200"
                    :style="{ maxWidth: hovered ? '60px' : '0px', opacity: hovered ? 1 : 0, marginRight: hovered ? '0' : '-4px' }">
                    Premium
                </span>
                <Icon name="lucide:sparkles" size="10" class="shrink-0" />
            </div>

        </div>
        <!-- Label -->
        <p class="text-[10px] font-semibold truncate">
            {{ theme.label }}
        </p>
    </div>
</template>

<script setup>
const hovered = ref(false)
const props = defineProps({
    theme: { type: Object, required: true },
    isSelected: { type: Boolean, default: false },
    hasAccess: { type: Boolean, default: false },
})

const buttonClass = computed(() => {
    if (props.theme.button_style.variant === 'outlined') return 'bg-transparent border'
    return ''
})

const buttonStyle = computed(() => {
    const btn = props.theme.button_style
    if (btn.variant === 'outlined') {
        return { borderColor: `#${btn.backgroundColor}`, color: `#${btn.textColor}` }
    }
    return { backgroundColor: `#${btn.backgroundColor}`, color: `#${btn.textColor}` }
})

</script>
