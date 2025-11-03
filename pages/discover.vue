<template>
    <div class="flex flex-col gap-4">
        <div class="lg:max-w-5xl xl:max-w-6xl">
            <!-- En-tête -->
            <div class="py-4">
                <div class="flex flex-col items-center justify-end">
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                        Découvrir des streamers
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center max-w-xl">
                        Découvrir des streamers talentueux et trouvez votre prochain coup de cœur
                    </p>
                </div>
            </div>
            <!-- <div class="flex justify-center gap-2">
            <Button class="whitespace-nowrap" outlined severity="contrast">
                <Shuffle class="w-4 h-4" />
                <span>Raid aléatoire</span>
            </Button>
            <Button class="whitespace-nowrap" severity="contrast">
                <Zap class="w-4 h-4" />
                <span>Trouver une collab</span>
            </Button>
        </div> -->
            <!-- <FilterBar /> -->
            <!-- Barre de recherche -->
            <div class="flex justify-center mb-4">
                <InputText v-model="search" placeholder="Rechercher par nom" class="w-full lg:w-6xl"
                    style="--p-inputtext-focus-border-color: #ffffff" />
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <StreamerCard v-for="s in filteredStreamers" :key="s.id" :streamer="s" />
        </div>
    </div>
</template>

<script setup>
const streamerStore = useStreamerStore()
const streamers = ref([])
const search = ref('')

// Charger tous les streamers
onMounted(async () => {
    streamers.value = await streamerStore.fetchAllStreamers()
})

// Filtrage en temps réel
const filteredStreamers = computed(() => {
    if (!search.value) return streamers.value
    return streamers.value.filter(s =>
        s.username.toLowerCase().includes(search.value.toLowerCase())
    )
})
</script>