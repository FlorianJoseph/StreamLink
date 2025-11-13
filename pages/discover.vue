<template>
    <!-- Loader pendant le chargement -->
    <div v-if="loading" class="flex justify-center items-center w-full pt-100">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div class="flex flex-col gap-4 lg:max-w-5xl xl:max-w-6xl fade-in" v-else>
        <!-- En-tête -->
        <div class="py-4">
            <div class="flex flex-col items-center justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                    Découvrir des streamers
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center max-w-xl sm:whitespace-nowrap">
                    Découvrir des streameurs talentueux et trouvez votre prochain coup de cœur
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
        <IconField class="lg:w-5xl xl:w-6xl">
            <InputIcon>
                <Icon name="lucide:search" size="20" />
            </InputIcon>
            <InputText v-model="search" placeholder="Rechercher par nom" class="w-full"
                style="--p-inputtext-focus-border-color: #ffffff" />
        </IconField>

        <!-- <Card class="lg:w-5xl xl:w-6xl">
            <template #title>
            </template>
<template #content>
                <div class="flex justify-center"> -->
        <!-- <Button severity="contrast" class="flex items-center gap-2">
                                <Funnel class="w-5 h-5" />
                                <span>Filtrer</span>
                            </Button> -->
        <!-- <Paginator :template="{
                            '640px': 'PrevPageLink CurrentPageReport NextPageLink',
                            '960px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
                            '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
                            default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown JumpToPageInput'
                        }" :rows="rowsPerPage" :totalRecords="filteredStreamers.length" @page="onPageChange">
                        </Paginator> -->
        <!-- <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-300">Trier par :</span>
                                <Select v-model="selectedTri" :options="tri" showClear optionLabel="name"
                                    placeholder="Plus récents" class="w-full w-40 md:w-56" />
                            </div> -->
        <!-- </div>
            </template>
</Card> -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <StreamerCard v-for="s in paginatedStreamers" :key="s.id" :streamer="s" />
        </div>
        <div class="w-full fixed left-0 bottom-0 flex justify-center pb-safe pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12">
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

<script setup>
const streamerStore = useStreamerStore()
const streamers = ref([])
const search = ref('')
const loading = ref(true)

// Charger tous les streamers
onMounted(async () => {
    loading.value = true
    try {
        updateRowsPerPage()
        window.addEventListener('resize', updateRowsPerPage)
        streamers.value = await streamerStore.fetchAllStreamers()
    } finally {
        loading.value = false
    }
})

// Penser à retirer le listener si le composant se détruit
onUnmounted(() => {
    window.removeEventListener('resize', updateRowsPerPage)
})

// Filtrage en temps réel
const filteredStreamers = computed(() => {
    if (!search.value) return streamers.value
    return streamers.value.filter(s =>
        s.username.toLowerCase().includes(search.value.toLowerCase())
    )
})

const currentPage = ref(0)
const rowsPerPage = ref(16)

// Détecter la taille de l’écran une seule fois
function updateRowsPerPage() {
    const width = window.innerWidth
    if (width >= 1280) {      // xl
        rowsPerPage.value = 16   // par exemple 4 colonnes x 4 lignes
    } else if (width >= 1024) { // lg
        rowsPerPage.value = 12   // 3 colonnes x 4 lignes
    } else if (width >= 640) {  // sm
        rowsPerPage.value = 10    // 2 colonnes x 5 lignes
    } else {
        rowsPerPage.value = 3    // 1 colonne x 4 lignes
    }
}

// Pagination
function onPageChange(event) {
    currentPage.value = event.page
}

// Liste affichée (pagination locale)
const paginatedStreamers = computed(() => {
    const start = currentPage.value * rowsPerPage.value
    const end = start + rowsPerPage.value
    return filteredStreamers.value.slice(start, end)
})

import { Funnel } from 'lucide-vue-next';

const selectedTri = ref();
const tri = ref([
    { name: 'Followers', code: 'FO' },
    { name: 'Viewers', code: 'VI' },
    { name: 'Plus récents', code: 'PR' }
]);
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