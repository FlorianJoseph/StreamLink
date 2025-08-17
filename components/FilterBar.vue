<template>
    <Card class="m-4 md:mx-12 lg:mx-20 mt-6">
        <template #title>
            <IconField>
                <InputIcon>
                    <Search class="w-5 h-5" />
                </InputIcon>
                <InputText placeholder="Rechercher par nom, pseudo, jeu..." class="w-full" />
            </IconField>
        </template>
        <template #content>
            <div class="flex justify-between items-center mt-4">
                <Button severity="contrast" class="flex items-center gap-2">
                    <Funnel class="w-5 h-5" />
                    <span>Filtrer</span>
                </Button>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-300">Trier par :</span>
                    <Select v-model="selectedTri" :options="tri" showClear optionLabel="name" placeholder="Followers"
                        class="w-full w-40 md:w-56" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { Search, Funnel } from 'lucide-vue-next';

const selectedTri = ref();
const tri = ref([
    { name: 'Followers', code: 'FO' },
    { name: 'Viewers', code: 'VI' },
    { name: 'Plus récents', code: 'PR' }
]);
</script>