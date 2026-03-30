<template>
    <div v-if="visible" class="relative bg-indigo-600 w-full z-50 lg:mb-[-20px]">
        <div class="bg-surface-900 text-surface-100 py-3 sm:py-4 px-4 sm:px-6 lg:px-20">
            <div class="flex items-center justify-between gap-3 sm:gap-4">
                <!-- Badge Nouveauté -->
                <div class="flex items-center gap-1.5 flex-shrink-0">
                    <Icon name="lucide:star" size="16" class="sm:w-[18px] sm:h-[18px] text-yellow-300" />
                    <span class="font-bold text-xs sm:text-sm lg:text-base">Nouveauté</span>
                </div>

                <!-- Message central -->
                <div>
                    <p class="text-xs sm:text-sm lg:text-base leading-relaxed">
                        <!-- Mobile -->
                        <span class="lg:hidden flex flex-col gap-1">
                            <NuxtLink to="/discover" class="font-bold underline hover:text-indigo-200">
                                Regarde les lives sans quitter StreamLink
                            </NuxtLink>
                        </span>

                        <!-- Desktop -->
                        <span class="hidden lg:inline">
                            Regarde les streams en direct intégrés à StreamLink, sans quitter la page !
                        </span>
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 flex-shrink-0">
                    <NuxtLink to="/discover"
                        class="hidden sm:flex bg-white text-indigo-600 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm lg:text-base whitespace-nowrap">
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:tv-2" size="18" />
                            Regarder
                        </div>
                    </NuxtLink>
                    <Button @click="closeBanner" rounded severity="contrast" variant="text" class="flex-shrink-0">
                        <Icon name="lucide:x" size="18" class="sm:w-5 sm:h-5" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const STORAGE_KEY = 'discovery'
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
