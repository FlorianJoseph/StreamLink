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

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div class="lg:col-span-1">
                    <!-- Configuration du planning -->
                    <Fieldset
                        style=" --p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem; margin-top: -1.3rem;">
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
                                        :maxFileSize="1000000" @upload="" :auto="true" chooseLabel="Choisir une image"
                                        severity="contrast" />
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
                    <Card class="p-4 relative" :style="{ backgroundColor: schedule?.style?.bgColor || '' }">
                        <template #header>
                            <div class="flex items-center gap-4">
                                <div class="flex flex-col">

                                    <!-- TITLE -->
                                    <template v-if="editing.field === 'title'">
                                        <input :ref="el => inputRefs['title'] = el" v-model="editing.value"
                                            @blur="saveEdit" @keyup.enter="saveEdit"
                                            @keyup.esc.prevent.stop="cancelEdit"
                                            class="text-4xl font-bold bg-transparent border-none focus:outline-none w-full truncate" />
                                    </template>
                                    <template v-else>
                                        <div class="flex items-center gap-2 hover:cursor-pointer"
                                            @click="editField('title')">
                                            <h1 class="text-4xl font-bold">
                                                {{ schedule?.title }}
                                            </h1>
                                            <Icon name="lucide:pencil" size="34" class="transition" />
                                        </div>
                                    </template>

                                    <!-- SUBTITLE -->
                                    <template v-if="editing.field === 'subtitle'">
                                        <input :ref="el => inputRefs['subtitle'] = el" v-model="editing.value"
                                            @blur="saveEdit" @keyup.enter="saveEdit"
                                            @keyup.esc.prevent.stop="cancelEdit"
                                            class="text-base font-semibold bg-transparent border-none focus:outline-none w-full truncate" />
                                    </template>
                                    <template v-else>
                                        <div class="flex items-center gap-2 hover:cursor-pointer"
                                            @click="editField('subtitle')">
                                            <div class="text-base font-semibold">
                                                {{ schedule?.subtitle }}
                                            </div>
                                            <Icon name="lucide:pencil" size="18" class="transition" />
                                        </div>
                                    </template>

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
                            <div
                                class="absolute bottom-3 right-3 text-xs text-zinc-400/60 select-none pointer-events-none">
                                Fait avec <span class="font-semibold">StreamLink</span>
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="visible" modal :header="`Ajouter un créneau – ${selectedDay}`" :style="{ width: '25rem' }">
        <InputText type="text" v-model="game" />
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Save" @click="visible = false"></Button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
const scheduleStore = useScheduleStore()
const { schedule, loading } = storeToRefs(scheduleStore)

// Édition du titre et du sous-titre
const editing = ref<{
    field: 'title' | 'subtitle' | null
    value: string
}>({
    field: null,
    value: ''
})

const inputRefs = ref<Record<string, HTMLInputElement | null>>({})

// Démarre l’édition du titre ou du sous-titre
function editField(field: 'title' | 'subtitle') {
    if (!schedule.value) return

    editing.value = {
        field,
        value: schedule.value[field] ?? ''
    }

    nextTick(() => {
        inputRefs.value[field]?.focus()
    })
}
// Sauvegarde les modifications apportées au titre ou au sous-titre
async function saveEdit() {
    if (!schedule.value || !editing.value.field) return

    const field = editing.value.field
    const newValue = editing.value.value

    if (newValue === schedule.value[field]) {
        editing.value.field = null
        return
    }

    await scheduleStore.updateSchedule({
        [field]: newValue
    })

    editing.value.field = null
}

function cancelEdit() {
    editing.value.field = null
    editing.value.value = ''
}

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const bgColorLocal = ref('FFFFFF')
const visible = ref(false)

const selectedDay = ref('')
const game = ref('')

onMounted(async () => {
    loading.value = true
    await scheduleStore.getOrCreateSchedule()
    loading.value = false
})

definePageMeta({
    layout: 'fullscreen'
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
