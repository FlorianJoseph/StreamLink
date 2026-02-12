<template>
    <!-- Loader pendant le chargement -->
    <div v-if="loading" class="flex justify-center items-center w-full pt-100">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div class="flex flex-col gap-4 fade-in w-full" v-else>
        <!-- En-tête -->
        <div class="py-4">
            <div class="flex flex-col items-center justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                    Découvrir des streameurs
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center max-w-xl sm:whitespace-nowrap">
                    Explore la communauté StreamLink et connecte-toi avec d'autres créateurs
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
        <div class="sticky top-0 sm:top-13 z-40 bg-zinc-900 py-2 sm:py-3 px-2 sm:px-4 rounded">
            <!-- Recherche -->
            <IconField class="w-full mb-2 sm:mb-3">
                <InputIcon>
                    <Icon name="lucide:search" size="18" class="text-gray-400" />
                </InputIcon>
                <InputText v-model="search" placeholder="Rechercher par nom" fluid
                    style="--p-inputtext-focus-border-color: #ffffff" />
            </IconField>

            <!-- Filtres -->
            <div class="flex flex-col sm:flex-row justify-between items-center">
                <!-- Filtres rapides (boutons) -->
                <div class="flex gap-2 flex-wrap justify-center sm:justify-start text-xs sm:text-base">
                    <button @click="selectedFilter = 'all'"
                        class=" px-3 py-1 rounded border-2 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-colors duration-200"
                        :class="selectedFilter === 'all' ? 'bg-purple-500 text-white border-purple-500' : 'bg-zinc-800 text-gray-300 border-zinc-700'"
                        size="small"> Tous
                    </button>
                    <button @click="selectedFilter = 'active'"
                        class=" px-3 py-1 rounded border-2 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-colors duration-200"
                        :class="selectedFilter === 'active' ? 'bg-purple-500 text-white border-purple-500' : 'bg-zinc-800 text-gray-300 border-zinc-700'"
                        size="small"> Prochains streams
                    </button>
                    <button @click="selectedFilter = 'today'"
                        class=" px-3 py-1 rounded border-2 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-colors duration-200"
                        :class="selectedFilter === 'today' ? 'bg-purple-500 text-white border-purple-500' : 'bg-zinc-800 text-gray-300 border-zinc-700'"
                        size="small"> Streams aujourd'hui
                    </button>
                </div>
                <!-- Compteur de résultats -->
                <div class="mt-1 sm:mt-0 text-sm sm:text-base text-purple-300/80">
                    {{ filteredStreamers.length }} streameur{{ filteredStreamers.length > 1 ? 's' : '' }}
                </div>
            </div>
        </div>

        <!-- État vide -->
        <div v-if="filteredStreamers.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
            <Icon name="lucide:search-x" size="64" class="text-gray-600" />
            <div class="text-center">
                <h3 class="text-xl font-semibold text-white mb-2">
                    Aucun streameur trouvé
                </h3>
                <p class="text-sm text-gray-400">
                    {{ getEmptyStateMessage() }}
                </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 mt-4">
                <Button v-if="search" @click="search = ''" severity="contrast" outlined>
                    <Icon name="lucide:x" size="16" />
                    <span class="text-sm sm:text-base">Réinitialiser la recherche</span>
                </Button>
                <Button v-if="selectedFilter !== 'all'" @click="selectedFilter = 'all'" severity="contrast" outlined>
                    <Icon name="lucide:filter-x" size="16" />
                    <span class="text-sm sm:text-base">Supprimer le filtre</span>
                </Button>
            </div>
        </div>

        <!-- Carousel avec chevrons -->
        <div v-if="filteredStreamers.length > 0" class="relative group">

            <!-- Chevron première page -->
            <div v-if="currentPage > 0" @click="goToPage(0)"
                class="hidden xl:flex absolute -left-50 top-1/2 -translate-y-1/2 z-35 
              w-26 h-26 items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-x-2 hover:cursor-pointer"
                aria-label="Première page">
                <Icon name="lucide:chevrons-left" size="96"
                    class="text-purple-500 hover:text-purple-400 transition-colors" />
            </div>
            <!-- Chevron gauche -->
            <div v-if="currentPage > 0" @click="previousPage"
                class="hidden xl:flex absolute -left-30 top-1/2 -translate-y-1/2 z-30 
             w-28 h-26 items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-x-2 hover:cursor-pointer"
                aria-label="Page précédente">
                <Icon name="lucide:chevron-left" size="96"
                    class="text-purple-500 hover:text-purple-400 transition-colors" />
            </div>

            <!-- Grid de streamers -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <StreamerCard v-for="s in paginatedStreamers" :key="s.id + '-' + currentPage" :streamer="s" />
            </div>

            <!-- Chevron droit -->
            <div>
                <div v-if="currentPage < totalPages - 1" @click="nextPage"
                    class="hidden xl:flex absolute -right-30 top-1/2 -translate-y-1/2 z-30 
                w-28 h-26 items-center justify-center transition-all duration-300 hover:scale-110 hover:translate-x-2 hover:cursor-pointer" aria-label="Page suivante">
                    <Icon name="lucide:chevron-right" size="96"
                        class="text-purple-500 hover:text-purple-400 transition-colors" />
                </div>

                <!-- Chevron dernière page -->
                <div v-if="currentPage < totalPages - 1" @click="goToPage(totalPages - 1)"
                    class="hidden xl:flex absolute -right-50 top-1/2 -translate-y-1/2 z-35 
              w-26 h-26 items-center justify-center transition-all duration-300 hover:scale-110 hover:translate-x-2 hover:cursor-pointer" aria-label="Dernière page">
                    <Icon name="lucide:chevrons-right" size="96"
                        class="text-purple-500 hover:text-purple-400 transition-colors" />
                </div>
            </div>
        </div>

        <div v-if="filteredStreamers.length > rowsPerPage" class="flex flex-col items-center gap-3 py-6">

            <!-- Info page (desktop xl uniquement) -->
            <p class="hidden xl:block text-sm text-gray-400">
                Page {{ currentPage + 1 }} sur {{ totalPages }}
            </p>

            <!-- Navigation mobile/tablette -->
            <div class="flex xl:hidden items-center gap-4">
                <Button @click="previousPage" :disabled="currentPage === 0" severity="secondary" outlined size="small"
                    class="min-w-[44px]">
                    <Icon name="lucide:chevron-left" size="16" />
                </Button>

                <span class="text-sm text-gray-400">
                    {{ currentPage + 1 }} / {{ totalPages }}
                </span>

                <Button @click="nextPage" :disabled="currentPage === totalPages - 1" severity="secondary" outlined
                    size="small" class="min-w-[44px]">
                    <Icon name="lucide:chevron-right" size="16" />
                </Button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
const search = ref('')
const loading = ref(true)
const { streamers, fetchStreamersWithNextSlot } = useDiscoverStreamers()
const selectedFilter = ref('all')
const currentPage = ref(0)
const rowsPerPage = ref(12)
const totalPages = computed(() =>
    Math.ceil(filteredStreamers.value.length / rowsPerPage.value)
)

// Liste affichée (pagination locale)
const paginatedStreamers = computed(() => {
    const start = currentPage.value * rowsPerPage.value
    const end = start + rowsPerPage.value
    return filteredStreamers.value.slice(start, end)
})

function goToPage(page: number) {
    currentPage.value = page
}

function nextPage() {
    if (currentPage.value < totalPages.value - 1) {
        currentPage.value++
    }
}

function previousPage() {
    if (currentPage.value > 0) {
        currentPage.value--
    }
}

// Watch pour réinitialiser la page lors des changements
watch([search, selectedFilter], () => {
    currentPage.value = 0
})

// Liste filtrée en fonction des critères de recherche et de filtre
const filteredStreamers = computed(() => {
    let list = [...streamers.value] // déjà triés : prochains streams d'abord, puis alphabétique

    // Filtre : actifs seulement
    if (selectedFilter.value === 'active') {
        list = list.filter(s => s.nextSlot)
    }

    // Filtre : aujourd'hui seulement
    if (selectedFilter.value === 'today') {
        const today = new Date().getDay()
        list = list.filter(
            s => s.nextSlot && s.nextSlot.slotDate?.getDay() === today
        )
    }

    // Filtre par recherche
    if (search.value) {
        const searchLower = search.value.toLowerCase()
        list = list.filter(s => s.username.toLowerCase().includes(searchLower))
    }

    return list
})

// Message d'état vide contextuel
function getEmptyStateMessage() {
    if (search.value && selectedFilter.value !== 'all') {
        return `Aucun résultat pour "${search.value}" avec le filtre "${getFilterLabel()}"`
    }
    if (search.value) {
        return `Aucun résultat pour "${search.value}"`
    }
    if (selectedFilter.value === 'active') {
        return 'Aucun streameur avec un planning actif'
    }
    if (selectedFilter.value === 'today') {
        return 'Aucun stream prévu aujourd\'hui'
    }
    return 'Aucun streameur disponible pour le moment'
}

// Label lisible pour le filtre actif
function getFilterLabel() {
    const labels: Record<string, string> = {
        all: 'Tous',
        active: 'Actifs',
        today: 'Aujourd\'hui'
    }
    return labels[selectedFilter.value] || 'Tous'
}


// Détecter la taille de l’écran une seule fois
function updateRowsPerPage() {
    const width = window.innerWidth

    rowsPerPage.value =
        width >= 1280 ? 12 :
            width >= 1024 ? 9 :
                width >= 640 ? 8 :
                    6
}

// Navigation au clavier
function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
        previousPage()
    } else if (e.key === 'ArrowRight') {
        nextPage()
    }
}

// Charger tous les streamers
onMounted(async () => {
    loading.value = true
    try {
        await fetchStreamersWithNextSlot()
        updateRowsPerPage()
        window.addEventListener('resize', updateRowsPerPage)
        window.addEventListener('keydown', handleKeydown)
    } finally {
        loading.value = false
    }
})

// Penser à retirer le listener si le composant se détruit
onUnmounted(() => {
    window.removeEventListener('resize', updateRowsPerPage)
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Petite animation d’apparition douce du contenu */
.fade-in {
    animation: fadeIn 0.4s ease forwards;
    opacity: 0;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}
</style>