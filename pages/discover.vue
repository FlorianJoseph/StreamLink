<template>
    <!-- Loader pendant le chargement -->
    <div v-if="loading" class="flex justify-center items-center w-full pt-100">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div class="flex flex-col gap-4 fade-in" v-else>
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
        <div class="sticky top-0 sm:top-13 z-40 bg-zinc-900 pb-3 pt-1 sm:pb-4 sm:pt-2 ">

            <!-- Recherche -->
            <IconField class="w-full">
                <InputIcon>
                    <Icon name="lucide:search" size="20" />
                </InputIcon>
                <InputText v-model="search" placeholder="Rechercher par nom" class="w-full"
                    style="--p-inputtext-focus-border-color: #ffffff" />
            </IconField>

            <!-- Filtres -->
            <Card class="w-full">
                <template #content>
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <!-- Filtres rapides (boutons) -->
                        <div class="flex gap-2 flex-wrap justify-center sm:justify-start">
                            <Button @click="selectedFilter = 'all'"
                                :severity="selectedFilter === 'all' ? 'info' : 'secondary'" label="Tous"
                                :outlined="selectedFilter !== 'all'" size="small" />
                            <Button @click="selectedFilter = 'active'"
                                :severity="selectedFilter === 'active' ? 'info' : 'secondary'" label="Actifs"
                                :outlined="selectedFilter !== 'active'" size="small" />
                            <Button @click="selectedFilter = 'today'"
                                :severity="selectedFilter === 'today' ? 'info' : 'secondary'" label="Aujourd'hui"
                                :outlined="selectedFilter !== 'today'" size="small" />
                        </div>

                        <!-- Compteur de résultats -->
                        <div class="text-sm text-gray-400">
                            {{ filteredStreamers.length }} streameur{{ filteredStreamers.length > 1 ? 's' : '' }}
                        </div>
                    </div>
                </template>
            </Card>
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
            <!-- Chevron gauche --><!-- Chevron gauche -->
            <div v-if="currentPage > 0" @click="previousPage"
                class="hidden xl:flex absolute -left-40 top-1/2 -translate-y-1/2 z-30 
             w-32 h-32 items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-x-2 hover:cursor-pointer"
                aria-label="Page précédente">
                <Icon name="lucide:chevron-left" size="96"
                    class="text-purple-500 hover:text-purple-400 transition-colors" />
            </div>

            <!-- Grid de streamers -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <StreamerCard v-for="s in paginatedStreamers" :key="s.id + '-' + currentPage" :streamer="s" />
            </div>

            <!-- Chevron droit -->
            <div v-if="currentPage < totalPages - 1" @click="nextPage"
                class="hidden xl:flex absolute -right-40 top-1/2 -translate-y-1/2 z-30 
                w-32 h-32 items-center justify-center transition-all duration-300 hover:scale-110 hover:translate-x-2 hover:cursor-pointer" aria-label="Page suivante">
                <Icon name="lucide:chevron-right" size="96"
                    class="text-purple-500 hover:text-purple-400 transition-colors" />
            </div>
        </div>

        <div v-if="filteredStreamers.length > rowsPerPage" class="flex flex-col items-center gap-3 py-6">
            <!-- Dots (desktop xl uniquement) -->
            <div class="hidden xl:flex items-center gap-2">
                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                    'transition-all rounded-full duration-200',
                    currentPage === page
                        ? 'w-8 h-2 bg-purple-500'
                        : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                ]" :aria-label="`Aller à la page ${page + 1}`" />
            </div>

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


// Afficher max 7 dots
const visiblePages = computed(() => {
    const pages = []
    const maxDots = 7

    if (totalPages.value <= maxDots) {
        for (let i = 0; i < totalPages.value; i++) {
            pages.push(i)
        }
    } else {
        let start = Math.max(0, currentPage.value - 3)
        let end = Math.min(totalPages.value - 1, start + maxDots - 1)

        if (end - start < maxDots - 1) {
            start = Math.max(0, end - maxDots + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }
    }

    return pages
})

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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>