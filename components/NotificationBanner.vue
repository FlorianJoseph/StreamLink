<template>
    <div v-if="visible" class="relative bg-indigo-600 lg:top-13 w-full z-50 lg:mb-[-20px]">
        <div class="bg-surface-900 text-surface-100 py-3 sm:py-4 px-4 sm:px-6 lg:px-20">
            <div class="flex items-center justify-between gap-3 sm:gap-4">
                <!-- Badge Nouveauté -->
                <div class="flex items-center gap-1.5 flex-shrink-0">
                    <Icon name="lucide:star" size="16" class="sm:w-[18px] sm:h-[18px]" />
                    <span class="font-bold text-xs sm:text-sm lg:text-base">Nouveauté</span>
                </div>

                <!-- Message central -->
                <div>
                    <p class="text-xs sm:text-sm lg:text-base leading-relaxed">
                        <!-- Mobile -->
                        <span class="md:hidden">
                            Nouvelles quêtes disponibles sur le
                            <NuxtLink to="/dashboard" class="font-bold underline">
                                <span>tableau de bord</span>
                            </NuxtLink>
                        </span>

                        <!-- Tablet -->
                        <span class="hidden md:inline lg:hidden">
                            Découvre les nouvelles quêtes sur ton
                            <NuxtLink to="/dashboard" class="font-bold underline">
                                <span>tableau de bord</span>
                            </NuxtLink>
                            !
                        </span>

                        <!-- Desktop -->
                        <span class="hidden lg:inline">
                            Découvre les nouvelles quêtes sur ton
                            <NuxtLink to="/dashboard" class="font-bold underline">
                                <span>tableau de bord</span>
                            </NuxtLink>
                            et optimise ton profil pour être mieux découvert !
                        </span>
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 flex-shrink-0">
                    <NuxtLink to="/dashboard"
                        class="hidden sm:flex bg-white text-indigo-600 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm lg:text-base whitespace-nowrap">
                        Voir les quêtes
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
const STORAGE_KEY = 'quests'
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
