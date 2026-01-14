<template>
    <div v-if="visible" class="relative bg-indigo-600 lg:top-13 w-full z-50 lg:mb-[-20px]">
        <div class="bg-surface-900 text-surface-100 py-4 px-6 lg:px-20 flex justify-between items-center flex-wrap">
            <div class="flex inline-flex gap-1 items-center">
                <Icon name="lucide:star" size="18" class="flex-shrink-0" />
                <span class="font-bold text-sm sm:text-lg">Nouveauté</span>
            </div>
            <div>
                <div class="inline-flex gap-1 items-center">
                    <span class="hidden sm:flex leading-normal">
                        Découvre ton nouveau
                    </span>
                    <NuxtLink to="/dashboard" class="text-surface-0 underline font-bold text-sm sm:text-base">tableau de
                        bord
                    </NuxtLink>
                    <span class="hidden lg:flex leading-normal">
                        et rends ton profil encore plus visible !
                    </span>
                </div>
            </div>
            <div class="flex gap-2">
                <NuxtLink to="/dashboard"
                    class="bg-white text-indigo-600 font-semibold px-3 py-2 rounded hover:bg-gray-100 transition hidden sm:block">
                    Explorer
                </NuxtLink>
                <Button @click="closeBanner" rounded severity="contrast" variant="text">
                    <Icon name="lucide:x" size="20" />
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
const STORAGE_KEY = 'dashboard'
const visible = ref(false)


const closeBanner = () => {
    visible.value = false
    localStorage.setItem(STORAGE_KEY, 'true')
}

onMounted(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
        visible.value = true
    }
})

</script>
