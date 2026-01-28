<template>
    <Card class="p-4 relative lg:h-160" :style="{ backgroundColor: schedule?.style?.bgColor || '' }">
        <template #header>
            <div class="flex items-center gap-4">
                <div class="flex flex-col">

                    <!-- TITLE -->
                    <template v-if="editing.field === 'title'">
                        <input :ref="el => inputRefs['title'] = el" v-model="editing.value" @blur="saveEdit"
                            @keyup.enter="saveEdit" @keyup.esc.prevent.stop="cancelEdit"
                            class="text-4xl font-bold bg-transparent border-none focus:outline-none w-full truncate" />
                    </template>
                    <template v-else>
                        <div class="flex items-center gap-2 hover:cursor-pointer" @click="editField('title')">
                            <h1 class="text-4xl font-bold">
                                {{ schedule?.title }}
                            </h1>
                            <Icon name="lucide:pencil" size="34" class="transition" />
                        </div>
                    </template>

                    <!-- SUBTITLE -->
                    <template v-if="editing.field === 'subtitle'">
                        <input :ref="el => inputRefs['subtitle'] = el" v-model="editing.value" @blur="saveEdit"
                            @keyup.enter="saveEdit" @keyup.esc.prevent.stop="cancelEdit"
                            class="text-base font-semibold bg-transparent border-none focus:outline-none w-full truncate" />
                    </template>
                    <template v-else>
                        <div class="flex items-center gap-2 hover:cursor-pointer" @click="editField('subtitle')">
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
            <div class="grid lg:grid-cols-7 gap-4 w-full">
                <div v-for="day in daysOptions" :key="day.label" class="flex flex-col gap-1 min-w-0">
                    <div class="flex flex-col items-center w-full">
                        <!-- Jour -->
                        <div class="font-semibold mb-2 text-center">{{ day.label }}</div>
                        <!-- Créneaux -->
                        <div class="grid grid-rows-[auto_1fr_auto] gap-2 lg:h-110 w-full">

                            <!-- CAS : aucun créneau -->
                            <Card v-if="slotsForDay(day.label).length === 0"
                                class="row-span-3 border-2 border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-all h-full w-full"
                                @click="openSlotModal(day.label)">
                                <template #content>
                                    <div class="flex flex-col items-center justify-center gap-1 ">
                                        <Icon name="lucide:plus" size="18" class="text-zinc-400" />
                                        <span class="text-zinc-400 text-center text-xs">Ajouter un stream</span>
                                    </div>
                                </template>
                            </Card>

                            <!-- CAS : il y a des créneaux -->
                            <template v-else>
                                <!-- Zone + en haut -->
                                <Card
                                    class="h-8 border-2 border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-all w-full"
                                    @click="openSlotModal(day.label, undefined, 'before')"
                                    v-tooltip.bottom="{ value: `Ajouter un stream avant`, pt: { text: '!text-sm' } }">
                                    <template #content>
                                        <Icon name="lucide:plus" size="14" class="text-zinc-400" />
                                    </template>
                                </Card>

                                <!-- Créneaux -->
                                <div class="flex flex-col gap-1 overflow-hidden w-full">
                                    <Card v-for="slot in slotsForDay(day.label)" :key="slot.id"
                                        class="border-2 border-zinc-600 rounded flex-1 min-h-0 w-full relative group hover:border-zinc-500 transition-all">
                                        <template #content>
                                            <div class="flex flex-col justify-between h-full">
                                                <!-- Titre et jeu -->
                                                <div class="font-semibold line-clamp-2">{{ slot.title }}</div>
                                                <div class="text-xs text-zinc-400 truncate">{{ slot.game.label }}</div>
                                                <!-- Horaire -->
                                                <div class="text-sm font-medium text-zinc-300 flex items-center gap-1">
                                                    <Icon name="lucide:clock" size="14" />
                                                    <span>{{ slot.start_at }} - {{ slot.end_at }}</span>
                                                </div>
                                                <!-- Actions visibles sur mobile, overlay sur desktop -->
                                                <div class="flex gap-1 mt-1 lg:hidden">
                                                    <button @click.prevent="openSlotModal(day.label, slot)"
                                                        class="flex-1 px-2 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-xs transition flex items-center justify-center gap-1"
                                                        :aria-label="`Modifier ${slot.title}`">
                                                        <Icon name="lucide:edit-2" size="14" />
                                                        <span>Modifier</span>
                                                    </button>
                                                    <button @click.prevent="deleteSlot(slot)"
                                                        class="flex-1 px-2 py-1.5 bg-red-900/30 hover:bg-red-900/50 rounded text-xs transition flex items-center justify-center gap-1"
                                                        :aria-label="`Supprimer ${slot.title}`">
                                                        <Icon name="lucide:trash-2" size="14" />
                                                        <span>Supprimer</span>
                                                    </button>
                                                </div>
                                                <!-- Overlay desktop uniquement -->
                                                <div
                                                    class="hidden lg:flex absolute opacity-0 group-hover:opacity-100 transition-opacity h-full w-full top-0 left-0 bg-black/30 items-center justify-center rounded-lg gap-2">
                                                    <Button @click.prevent="openSlotModal(day.label, slot)"
                                                        class="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all justify-center flex items-center"
                                                        v-tooltip.bottom="`Modifier`" severity="info">
                                                        <Icon name="lucide:edit-2" size="20" />
                                                    </Button>
                                                    <Button @click.prevent="deleteSlot(slot)"
                                                        class="p-4 bg-red-900 hover:bg-red-800 rounded-lg transition-all justify-center flex items-center"
                                                        v-tooltip.bottom="`Supprimer`" severity="danger">
                                                        <Icon name="lucide:trash-2" size="20" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </template>
                                    </Card>
                                </div>

                                <!-- Zone + en bas -->
                                <Card
                                    class="h-8 border-2 border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-all w-full"
                                    @click="openSlotModal(day.label, undefined, 'after')"
                                    v-tooltip.bottom="{ value: `Ajouter un stream après`, pt: { text: '!text-sm' } }">
                                    <template #content>
                                        <Icon name="lucide:plus" size="14" class="text-zinc-400" />
                                    </template>
                                </Card>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="absolute bottom-3 right-3 text-lg text-zinc-400/60 select-none pointer-events-none">
                Fait avec <span class="font-semibold">StreamLink</span>
            </div>
        </template>
    </Card>

    <!-- Modal d'ajout de créneau -->
    <Dialog v-model:visible="visible" modal header="Ajouter un stream" :style="{ width: '25rem' }">
        <div class="flex flex-col gap-4 mb-4">
            <div class="flex flex-col gap-2">
                <span class="font-semibold">Nom du jeu</span>
                <IconField>
                    <div>
                        <InputIcon>
                            <Icon name="lucide:search" size="18" />
                        </InputIcon>
                        <AutoComplete v-model="selectedGame" :suggestions="gameSuggestions" @complete="searchGames"
                            optionLabel="label" placeholder="Rechercher un jeu vidéo" fluid forceSelection>
                            <template #option="slotProps">
                                <div class="flex items-center gap-2">
                                    <img v-if="slotProps.option.cover" :src="slotProps.option.cover" alt=""
                                        class="w-8 h-10 rounded border border-black" />
                                    <span>{{ slotProps.option.label }}</span>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                </IconField>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-semibold">Titre du stream</span>
                <InputText type="text" v-model="title" />
            </div>
            <div class="flex flex-col">
                <span class="font-semibold">Sélectionne les jours de stream</span>
                <span class="text-sm text-zinc-500">Tu peux ajouter le même stream à plusieurs jours en même
                    temps.</span>
            </div>
            <SelectButton v-model="selectedDays" :options="daysOptions" optionLabel="label" :multiple="!editingSlot"
                aria-labelledby="multiple" class="flex flex-wrap gap-1 rounded" />
            <div class="flex gap-2">
                <span class="flex items-center">Horaire :</span>
                <InputText type="time" v-model="startTime" />
                <span class="flex items-center">-></span>
                <InputText type="time" v-model="endTime" />
            </div>
        </div>
        <div class="flex justify-end gap-2 w-full">
            <Button type="button" label="Annuler" severity="secondary" @click="visible = false" class="flex-1"></Button>
            <Button type="button" label="Enregistrer" severity="contrast" @click="saveSlot" class="flex-1"></Button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">

const scheduleStore = useScheduleStore()
const scheduleSlotStore = useScheduleSlotStore()
const { schedule } = storeToRefs(scheduleStore)

const slots = ref([])

// Édition du titre et du sous-titre
const editing = ref({ field: null as 'title' | 'subtitle' | null, value: '' })
const inputRefs = ref<Record<string, HTMLInputElement | null>>({})

// Démarre l’édition du titre ou du sous-titre
function editField(field: 'title' | 'subtitle') {
    if (!schedule.value) return
    editing.value = {
        field, value: schedule.value[field] ?? ''
    }
    nextTick(() => {
        inputRefs.value[field]?.focus()
    })
}

// Sauvegarde les modifications apportées au titre ou au sous-titre
async function saveEdit() {
    if (!schedule.value || !editing.value.field) return
    const { field, value } = editing.value
    if (value !== schedule.value[field]) {
        await scheduleStore.updateSchedule({ [field]: value })
    }
    editing.value = { field: null, value: '' }
}

function cancelEdit() {
    editing.value.field = null
    editing.value.value = ''
}

// Charge les slots
async function loadSlots() {
    if (!schedule.value) return
    const { data } = await scheduleSlotStore.fetchSlots(schedule.value.id)
    if (data) slots.value = data
}

// Trie les slots pour un jour donné
function slotsForDay(day: string) {
    return slots.value
        .filter(slot => slot.day.includes(day))
}

// Supprime un slot
async function deleteSlot(slot: any) {
    // if (!schedule.value) return
    // const confirmed = confirm(`Es-tu sûr de vouloir supprimer le stream "${slot.title}" ?`)
    // if (!confirmed) return
    await scheduleSlotStore.deleteSlot(slot.id)
    await loadSlots()
}

// Gestion de la modal de créneau
const {
    visible,
    selectedGame,
    title,
    startTime,
    endTime,
    selectedDays,
    daysOptions,
    openSlotModal,
    editingSlot,
    saveSlot,
    searchGames,
    gameSuggestions
} = useSlotModal(schedule.value.id, slots, scheduleSlotStore, loadSlots)

onMounted(async () => {
    await loadSlots()
})
</script>