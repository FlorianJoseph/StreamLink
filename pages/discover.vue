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

        <IconField class="w-full">
            <InputIcon>
                <Icon name="lucide:search" size="20" />
            </InputIcon>
            <InputText v-model="search" placeholder="Rechercher par nom" class="w-full"
                style="--p-inputtext-focus-border-color: #ffffff" />
        </IconField>

        <Card class="w-full" :content-class="'flex flex-col gap-4'">
            <template #content>
                <div class="flex justify-center">
                    <!-- <Button severity="contrast" class="flex items-center gap-2">
                        <Icon name="lucide:funnel" class="w-5 h-5" />
                        <span>Filtrer</span>
                    </Button> -->

                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-300">Trier par :</span>
                        <Select v-model="selectedFilter" :options="tri" showClear optionLabel="name" optionValue="value"
                            placeholder="Filtrer les streamers" class=" w-full w-40 md:w-56" />
                    </div>
                </div>
            </template>
        </Card>
        <div v-if="filteredStreamers.length === 0 && !loading"
            class="flex flex-col items-center justify-center py-20 gap-4">
            <Icon name="lucide:search-x" size="64" class="text-gray-600" />
            <div class="text-center">
                <h3 class="text-xl font-semibold text-white mb-2">
                    Aucun streameur trouvé
                </h3>
                <p class="text-sm text-gray-400">
                    {{ search ? `Aucun résultat pour "${search}"` : 'Aucun streameur disponible pour le moment' }}
                </p>
            </div>
            <Button v-if="search" @click="search = ''" severity="contrast" outlined class="mt-4">
                <Icon name="lucide:x" size="16" />
                <span>Réinitialiser la recherche</span>
            </Button>
        </div>

        <div v-else
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24 sm:pb-20">
            <StreamerCard v-for="s in paginatedStreamers" :key="s.id" :streamer="s" />
        </div>
        <div v-if="filteredStreamers.length > rowsPerPage"
            class="w-full fixed left-0 bottom-0 flex justify-center pb-safe pb-6">
            <Paginator :template="{
                '640px': 'PrevPageLink CurrentPageReport NextPageLink',
                '960px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
                '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
                default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
            }" :rows="rowsPerPage" :totalRecords="filteredStreamers.length" @page="onPageChange"
                style="--p-paginator-nav-button-selected-background:#fff; --p-paginator-nav-button-selected-color:#000"
                currentPageReportTemplate="Page {currentPage} sur {totalPages}" />
        </div>
    </div>
</template>

<script setup lang="ts">
const search = ref('')
const loading = ref(true)
const { streamers, fetchStreamersWithNextSlot } = useDiscoverStreamers()
const selectedFilter = ref('all')

const tri = [
    { name: 'Prochains streams', value: 'all' },
    { name: 'Actifs uniquement', value: 'active' },
    { name: "Aujourd'hui", value: 'today' }
]

watch(search, () => {
    currentPage.value = 0
})

watch(selectedFilter, () => {
    currentPage.value = 0
})

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

const currentPage = ref(0)
const rowsPerPage = ref(16)

// Détecter la taille de l’écran une seule fois
function updateRowsPerPage() {
    const width = window.innerWidth

    rowsPerPage.value =
        width >= 1280 ? 8 :
            width >= 1024 ? 6 :
                width >= 640 ? 4 :
                    2
}

// Pagination
function onPageChange(event: { page: number }) {
    currentPage.value = event.page
}

// Liste affichée (pagination locale)
const paginatedStreamers = computed(() => {
    const start = currentPage.value * rowsPerPage.value
    const end = start + rowsPerPage.value
    return filteredStreamers.value.slice(start, end)
})

// Charger tous les streamers
onMounted(async () => {
    loading.value = true
    try {
        await fetchStreamersWithNextSlot()
        updateRowsPerPage()
        window.addEventListener('resize', updateRowsPerPage)
    } finally {
        loading.value = false
    }
})

// Penser à retirer le listener si le composant se détruit
onUnmounted(() => {
    window.removeEventListener('resize', updateRowsPerPage)
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