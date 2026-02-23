<template>
    <div v-if="visible" class="relative bg-indigo-600 lg:top-13 w-full z-50 lg:mb-[-20px]">
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
                        <span class="lg:hidden">
                            Tes streams en direct sont maintenant mis en avant sur la page
                            <NuxtLink to="/discover" class="font-bold underline hover:text-indigo-200">
                                <span>Découvrir des streameurs</span>
                            </NuxtLink>
                        </span>

                        <!-- Desktop -->
                        <span class="hidden lg:inline">
                            Tes streams en direct apparaissent automatiquement en tête de la page
                            <NuxtLink to="/discover" class="font-bold underline hover:text-indigo-200">
                                <span>Découvrir des streameurs</span>
                            </NuxtLink>
                            pour maximiser ta visibilité !
                        </span>
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 flex-shrink-0">
                    <NuxtLink to="/discover"
                        class="hidden sm:flex bg-white text-indigo-600 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm lg:text-base whitespace-nowrap">
                        Voir les streams
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
const STORAGE_KEY = 'LiveBoost'
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
