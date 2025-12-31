<template>
    <div class="relative w-30 sm:w-36 h-42 rounded-xl overflow-hidden cursor-pointer transition 
    hover:ring-2 hover:ring-white hover:ring-2 hover:ring-white border-2 border-black "
        :style="{ backgroundColor: '#' + theme.wallpaper_style.backgroundColor }" :class="{
            'ring-2 ring-white': isSelected
        }">
        <!-- Fake content -->
        <div class="flex flex-col gap-2 px-2 py-4">
            <!-- Fake avatar -->
            <Avatar :image="streamer?.avatar_url || defaultAvatar" shape="circle" class="mx-auto" />
            <!-- Fake username -->
            <span class="font-medium text-xs mx-auto" :style="{ color: '#' + (theme.username_style.textColor) }">
                {{ streamer?.username }}
            </span>
            <!-- Fake buttons -->
            <div class="flex flex-col gap-1">
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
                    bg-black/40">
            {{ theme.label }}
        </div>

        <!-- <div v-if="theme.badge" class="absolute top-2 right-2 z-10
           text-[10px] px-2 py-0.5 rounded-full
           bg-primary text-white font-semibold">
            {{ theme.badge }}
        </div> -->

    </div>
</template>

<script setup>
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png";

const props = defineProps({
    theme: {
        type: Object,
        required: true,
    },
    isSelected: {
        type: Boolean,
        default: false,
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
