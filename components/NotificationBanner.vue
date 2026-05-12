<template>
    <div v-if="visible" class="relative w-full z-50 bg-primary">
        <div class="py-3 px-4 sm:px-6 lg:px-20">
            <div class="flex items-center justify-between gap-3 sm:gap-4">

                <!-- Badge -->
                <div class="flex items-center gap-1.5 shrink-0">
                    <img src="/images/logo/charmi-favicon-blanc.svg" class="w-5 h-5" alt="" loading="eager" />
                    <span class="font-bold text-xs sm:text-sm text-white">Nouveauté</span>
                </div>

                <!-- Message -->
                <div class="flex flex-1 min-w-0 justify-start sm:justify-center">
                    <p class="text-xs sm:text-base text-white/90 leading-relaxed">
                        <span class="lg:hidden">
                            <NuxtLink :to="destination" class="font-bold underline hover:text-white">
                                Analyse tes liens en détail avec les stats avancées
                            </NuxtLink>
                        </span>
                        <span class="hidden lg:inline">
                            Analyse tes liens en détail avec les stats avancées
                        </span>
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 shrink-0">
                    <NuxtLink :to="destination"
                        class="hidden sm:flex items-center gap-2 bg-white text-primary font-semibold px-4 py-1.5 rounded-md hover:bg-white/90 transition-colors whitespace-nowrap">
                        <!-- <img src="/images/mascotte/charmi-happy-violet.svg" class="w-5 h-5" alt="" loading="eager" /> -->
                        <Icon name="lucide:chart-no-axes-column-increasing" />
                        Voir mes stats
                    </NuxtLink>
                    <button @click="closeBanner"
                        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors">
                        <Icon name="lucide:x" size="16" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// const streamerStore = useStreamerStore()
// const { streamer } = storeToRefs(streamerStore)
const destination = ref('/admin/links')

// watchEffect(() => {
//     if (streamer.value?.username) {
//         destination.value = `/${streamer.value.username}`
//     }
// })

const user = useSupabaseUser()

const STORAGE_KEY = 'stats_feature'
const visible = ref(false)

const closeBanner = () => {
    visible.value = false
    localStorage.setItem(STORAGE_KEY, 'true')
}

onMounted(async () => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
        visible.value = true
    }
    // Attend que l'user soit disponible
    // if (user.value && !streamer.value) {
    //     await streamerStore.fetchStreamer()
    // }
})

// Si l'user arrive après le montage
// watch(user, async (newUser) => {
//     if (newUser && !streamer.value) {
//         await streamerStore.fetchStreamer()
//     }
// }, { immediate: true })

</script>
