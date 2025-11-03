<template>
    <div v-if="visible" class="bg-gradient-to-br from-purple-500 to-purple-700 mt-13">
        <div class="bg-surface-900 text-surface-100 py-4 px-6 lg:px-20 flex justify-between items-center flex-wrap">
            <div class="flex inline-flex gap-1 items-center">
                <Icon name="lucide:lock-keyhole" />
                <span class="font-bold">Protection de vos données</span>
            </div>
            <div class="inline-flex gap-1 items-center">
                <span class="hidden lg:flex leading-normal">
                    Veuillez prendre connaissance de notre
                </span>
                <NuxtLink to="/privacy">
                    <a class="text-surface-0 underline font-bold">Avis de Confidentialité et Mentions légales.</a>
                </NuxtLink>
            </div>
            <Button @click="closeBanner" rounded severity="contrast" variant="text">
                <Icon name="lucide:x" size="20" />
            </Button>
        </div>
    </div>
</template>

<script setup>
const visible = ref(false)

const closeBanner = () => {
    visible.value = false
    localStorage.setItem('bannerClosed', 'true')
}

// onMounted(() => {
//     if (localStorage.getItem('bannerClosed') === 'true') {
//         visible.value = false
//     }
// })
</script>
