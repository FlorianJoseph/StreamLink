<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else>
        <div class="flex flex-col gap-4 fade-in">
            <div class="py-4">
                <div class="flex flex-col lg:items-start items-center">
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                        Planning
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center lg:text-left max-w-xl">
                        Crée et partage ton planning hebdomadaire
                    </p>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div class="lg:col-span-1">
                <!-- Configuration du planning -->
                <Fieldset style=" --p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:settings" size="24" />
                            <span class="font-semibold">Configuration</span>
                        </div>
                    </template>
                    <Button label="Ajouter un créneau" severity="contrast">
                        <Icon name="lucide:plus" size="18" />
                        <span>Ajouter un créneau</span>
                    </Button>
                </Fieldset>
                <!-- Design du planning -->
                <Fieldset style=" --p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:palette" size="24" />
                            <span class="font-semibold">Design</span>
                        </div>
                    </template>
                    <p class="font-semibold mb-2">Arrière-plan</p>
                    <div class="flex flex-col gap-2 mb-4">
                        <InputGroup class="flex-1">
                            <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm sm:text-base lg:text-sm xl:text-base">Couleur</span>
                                    <ColorPicker ref="bgColorPicker" v-model="bgColorLocal" format="hex" @click.stop
                                        style="--p-colorpicker-preview-focus-ring-color :none" />
                                </div>
                            </InputGroupAddon>
                            <InputText v-model="bgColorLocal" @input="bgColorLocal = bgColorLocal.toUpperCase()"
                                style="--p-inputtext-focus-border-color:white" maxlength="7" />
                        </InputGroup>
                        <div class="flex flex-col gap-2">
                            Image de fond
                            <div>
                                <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*"
                                    :maxFileSize="1000000" @upload="onUpload" :auto="true"
                                    chooseLabel="Choisir une image" severity="contrast" />
                            </div>
                        </div>
                    </div>
                    <p class="font-semibold mb-2">Texte</p>
                    <div class="flex flex-col gap-2 mb-4">
                        <InputGroup class="flex-1">
                            <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm sm:text-base lg:text-sm xl:text-base">Couleur</span>
                                    <ColorPicker ref="bgColorPicker" v-model="bgColorLocal" format="hex" @click.stop
                                        style="--p-colorpicker-preview-focus-ring-color :none" />
                                </div>
                            </InputGroupAddon>
                            <InputText v-model="bgColorLocal" @input="bgColorLocal = bgColorLocal.toUpperCase()"
                                style="--p-inputtext-focus-border-color:white" maxlength="7" />
                        </InputGroup>
                    </div>
                </Fieldset>
            </div>
            <div class="lg:col-span-3 flex flex-col gap-4">
                <!-- Barre d'outils -->
                <Menubar>
                    <template #start>
                        <Button severity="secondary">
                            <Icon name="lucide:eye" size="18" />
                            <span
                                class="hidden sm:inline text-xs md:text-base lg:text-xs xl:text-base whitespace-nowrap">Voir
                                le rendu final</span>
                        </Button>
                    </template>
                    <template #end>
                        <div class="flex items-center gap-1 sm:gap-2">
                            <Button severity="secondary">
                                <Icon name="lucide:share" size="18" />
                                <span
                                    class="hidden sm:inline text-xs md:text-base lg:text-xs xl:text-base">Partager</span>
                            </Button>
                            <Button severity="contrast">
                                <Icon name="lucide:download" size="18" />
                                <span class="text-xs md:text-base lg:text-xs xl:text-base">Télécharger</span>
                            </Button>
                        </div>
                    </template>
                </Menubar>
                <!-- Planning hebdomadaire -->
                <Card class="p-4 relative">
                    <template #header>
                        <div class="flex items-center gap-4">
                            <!-- <Avatar size="large" class="mb-2" /> -->
                            <div class="flex flex-col">
                                <h1 class="text-4xl font-bold">{{ schedule?.title }}</h1>
                                <div class="text-base text-gray-500 font-semibold">{{ schedule?.subtitle }}</div>
                            </div>
                        </div>
                    </template>
                    <template #content>
                        <div class="flex gap-2 p-3">
                            <div v-for="day in days" :key="day" class="flex-1" @click="visible = true">
                                <div class="flex gap-2 p-3">
                                    <div class="flex-1 text-center rounded-lg font-bold text-lg">
                                        {{ day }}
                                    </div>
                                </div>
                                <Card
                                    class="h-110 border border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition">
                                    <template #content>
                                        <div class="border-zinc-700 ">
                                            <Icon name="lucide:plus" size="32" />
                                        </div>
                                    </template>

                                </Card>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="absolute bottom-3 right-3 text-xs text-zinc-400/60 select-none pointer-events-none">
                            Fait avec <span class="font-semibold">StreamLink</span>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Username</label>
            <InputText id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="email" class="font-semibold w-24">Email</label>
            <InputText id="email" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Save" @click="visible = false"></Button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
const scheduleStore = useScheduleStore()
const { schedule, loading } = storeToRefs(scheduleStore)

definePageMeta({
    layout: 'fullscreen'
})

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const bgColorLocal = ref('FFFFFF')
const visible = ref(false)

onMounted(async () => {
    await scheduleStore.getOrCreateSchedule()
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
