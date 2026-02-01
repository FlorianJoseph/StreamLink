<template>
    <div class="p-4 relative lg:h-160 bg-zinc-900 rounded-lg export-footer"
        :style="{ backgroundColor: schedule?.style?.bgColor || '' }" id="scheduleCard">
        <div class="flex flex-col gap-6">

            <!-- En-tête du planning -->
            <div class="flex items-center gap-4">
                <div class="flex flex-col">
                    <!-- Titre -->
                    <template v-if="editing.field === 'title'">
                        <input :ref="el => inputRefs['title'] = el" v-model="editing.value" @blur="saveEdit"
                            @keyup.enter="saveEdit" @keyup.esc.prevent.stop="cancelEdit"
                            class="text-4xl font-bold bg-transparent border-none focus:outline-none w-full truncate" />
                    </template>
                    <template v-else>
                        <div class="flex items-center gap-2 hover:cursor-pointer" @click="editField('title')">
                            <h1 class="text-4xl font-bold"> {{ schedule?.title }} </h1>
                            <Icon name="lucide:pencil" size="34" class="transition ignore-export" />
                        </div>
                    </template>
                    <!-- Sous-titre -->
                    <template v-if="editing.field === 'subtitle'">
                        <input :ref="el => inputRefs['subtitle'] = el" v-model="editing.value" @blur="saveEdit"
                            @keyup.enter="saveEdit" @keyup.esc.prevent.stop="cancelEdit"
                            class="text-base font-semibold bg-transparent border-none focus:outline-none w-full truncate" />
                    </template>
                    <template v-else>
                        <div class="flex items-center gap-2 hover:cursor-pointer" @click="editField('subtitle')">
                            <div class="text-base font-semibold"> {{ schedule?.subtitle }} </div>
                            <Icon name="lucide:pencil" size="18" class="transition ignore-export" />
                        </div>
                    </template>
                </div>
            </div>

            <!-- Contenu du planning -->
            <div class="grid lg:grid-cols-7 gap-4 w-full">
                <div v-for="day in daysOptions" :key="day.label" class="flex flex-col items-center w-full">
                    <!-- Jour -->
                    <div class="font-semibold mb-2 text-center text-xl">{{ day.label }}</div>
                    <!-- Créneaux -->
                    <div class="lg:h-110 w-full">

                        <!-- CAS : aucun créneau -->
                        <template v-if="slotsForDay(day.label).length === 0">
                            <div class="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer border-zinc-500 hover:border-zinc-300 
                            transition-all h-full w-full day-slot-empty" @click="openSlotModal(day.label)">
                                <div class="flex flex-col items-center justify-center gap-1 ">
                                    <Icon name="lucide:plus" size="18" class="text-zinc-400" />
                                    <span class="text-center text-xs text-zinc-400">Ajouter un
                                        stream</span>
                                </div>
                            </div>
                        </template>

                        <!-- CAS : il y a des créneaux -->
                        <template v-else>
                            <div class="grid grid-rows-[auto_1fr_auto] gap-2 h-full">
                                <!-- Zone + en haut -->
                                <div class="h-6 border-2 border-dashed border-zinc-500 rounded-lg flex items-center justify-center cursor-pointer hover:border-zinc-300 transition-all w-full row-span-1 ignore-export"
                                    @click="openSlotModal(day.label, undefined, 'before')"
                                    v-tooltip.bottom="{ value: `Ajouter un stream avant`, pt: { text: '!text-sm' } }">
                                    <Icon name="lucide:plus" size="14" class="text-zinc-400" />
                                </div>
                                <!-- Créneaux -->
                                <div class="flex flex-col gap-1 overflow-hidden w-full export-day-column-content">
                                    <div v-for="slot in slotsForDay(day.label)" :key="slot.id"
                                        class="border-2 rounded-lg flex-1 min-h-0 w-full relative h-full flex flex-col group transition-all"
                                        :style="slotStyle(slot)">
                                        <div class="flex-1"></div>
                                        <!-- Tag titre -->
                                        <div class="bg-black/80 text-sm font-semibold px-2 py-1 rounded-b-md z-100">
                                            {{ slot.title }}
                                        </div>
                                        <div class="absolute top-0 left-0 z-100 px-2 py-1 text-sm font-semibold rounded-br-md rounded-tl-sm"
                                            :style="slot.game.cover
                                                ? { backgroundColor: `#${slot.color}` || 'rgba(0, 0, 0, 0.7)' }
                                                : {}">
                                            {{ formatTime(slot.start_at) }}
                                        </div>
                                        <!-- Overlay desktop uniquement -->
                                        <div
                                            class="hidden lg:flex absolute opacity-0 group-hover:opacity-100 z-50 transition-opacity h-full w-full top-0 left-0 bg-black/30 items-center justify-center rounded-sm gap-2">
                                            <Button @click.prevent="openSlotModal(day.label, slot)"
                                                v-tooltip.bottom="`Modifier`" severity="info">
                                                <Icon name="lucide:edit-2" size="20" />
                                            </Button>
                                            <Button @click.prevent="deleteSlot(slot)" v-tooltip.bottom="`Supprimer`"
                                                severity="danger">
                                                <Icon name="lucide:trash-2" size="20" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <!-- Zone + en bas -->
                                <div class="h-6 border-2 border-dashed border-zinc-500 rounded-lg flex items-center justify-center cursor-pointer hover:border-zinc-300 transition-all w-full row-span-1 ignore-export"
                                    @click="openSlotModal(day.label, undefined, 'after')"
                                    v-tooltip.bottom="{ value: `Ajouter un stream après`, pt: { text: '!text-sm' } }">
                                    <Icon name="lucide:plus" size="14" class="text-zinc-400" />
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer -->
        <div class="absolute bottom-3 right-3 text-lg text-zinc-400/80 select-none pointer-events-none ignore-export">
            Fait avec <span class="font-semibold">StreamLink</span>
        </div>
    </div>

    <!-- Modal d'ajout de créneau -->
    <Dialog v-model:visible="visible" dismissable-mask modal
        :header="editingSlot ? 'Modifier le stream' : 'Ajouter un stream'" :style="{ width: '30rem' }"
        :draggable="false">
        <div class="flex flex-col gap-5">

            <!-- Catégorie Twitch -->
            <div class="flex flex-col gap-2">
                <label for="game-search" class="font-semibold text-sm flex items-center gap-2">
                    <Icon name="lucide:gamepad-2" size="18" />
                    Catégorie Twitch
                    <span>
                        <Icon name="lucide:asterisk" size="14" class="text-red-500"
                            v-tooltip.bottom="'La catégorie Twitch correspond généralement au jeu vidéo que tu vas streamer. Choisis-en une pour que tes spectateurs sachent à quoi s\'attendre !'" />
                    </span>
                </label>
                <InputGroup>
                    <InputGroupAddon>
                        <Icon name="lucide:search" size="20" class="text-zinc-500" />
                    </InputGroupAddon>
                    <AutoComplete v-model="selectedGame" :suggestions="gameSuggestions" @complete="searchGames"
                        optionLabel="label" placeholder="Ex: League of Legends, Valorant..." fluid forceSelection
                        style="--p-inputtext-focus-border-color:white" id="game-search">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <img v-if="slotProps.option.cover" :src="slotProps.option.cover"
                                    :alt="slotProps.option.label"
                                    class="w-8 h-10 rounded border border-zinc-700 flex-shrink-0" />
                                <div v-else
                                    class="w-8 h-10 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                                    <Icon name="lucide:image-off" size="20" class="text-zinc-600" />
                                </div>
                                <span>{{ slotProps.option.label }}</span>
                            </div>
                        </template>
                        <template #empty>
                            Aucun jeu trouvé
                        </template>
                    </AutoComplete>
                </InputGroup>
            </div>

            <!-- Titre du stream -->
            <div class="flex flex-col gap-2 relative">
                <label for="stream-title" class="font-semibold text-sm flex items-center gap-2">
                    <Icon name="lucide:type" size="18" />
                    Titre du stream
                </label>
                <InputText id="stream-title" type="text" v-model="title" placeholder="Ex: On monte Diamant ce soir !"
                    maxlength="60" style="--p-inputtext-focus-border-color:white" />
                <div class="flex justify-between items-center absolute bottom-1 right-2">
                    <small class="text-zinc-500 text-xs ml-auto">
                        {{ title.length }}/60
                    </small>
                </div>
            </div>

            <!-- Couleur du créneau -->
            <div class="flex flex-col gap-2">
                <div class="flex items-start justify-between">
                    <div class="flex flex-col gap-1">
                        <label class="font-semibold text-sm flex items-center gap-2">
                            <Icon name="lucide:palette" size="18" />
                            Couleur du créneau
                        </label>
                        <span class="text-xs text-zinc-500">
                            {{ useGameColor ? 'Suggérée automatiquement en fonction du jeu sélectionné mais modifiable.'
                                :
                                'Personnalisée' }}
                        </span>
                    </div>
                    <div v-if="!useGameColor"
                        class="px-2 py-1 bg-zinc-700 text-white text-xs rounded-full flex items-center gap-1">
                        <Icon name="lucide:wand-2" size="12" />
                        Modifiée
                    </div>
                </div>

                <InputGroup>
                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                        <ColorPicker ref="slotColorPicker" v-model="colorInput" format="hex" @click.stop
                            style="--p-colorpicker-preview-focus-ring-color :none" @change="useGameColor = false" />
                    </InputGroupAddon>
                    <InputText v-model="colorInput" @blur="colorInput = slotColor"
                        @input="colorInput = colorInput.toUpperCase(); useGameColor = false"
                        style="--p-inputtext-focus-border-color:white" maxlength="7"
                        :style="{ color: isColorInvalid ? '#f87171' : '#ffffff' }" />
                    <InputGroupAddon v-tooltip.bottom="'Réinitialiser en couleur automatique'"
                        class="cursor-pointer flex items-center gap-1" @click="resetColor">
                        <Icon name="lucide:rotate-ccw" size="16" />
                        <span>Réinitialiser</span>
                    </InputGroupAddon>
                </InputGroup>
            </div>

            <!-- Jours de stream -->
            <div class="flex flex-col gap-2">
                <label class="font-semibold text-sm flex items-center gap-2">
                    <Icon name="lucide:calendar-days" size="18" />
                    Jours de stream
                    <span class="text-red-500">*</span>
                </label>
                <span class="text-xs text-zinc-500">
                    {{ editingSlot
                        ? 'Sélectionne un nouveau jour pour déplacer ce créneau'
                        : 'Sélectionne un ou plusieurs jours pour ce créneau' }}
                </span>
                <SelectButton v-model="selectedDays" :options="daysOptions" optionLabel="label" :multiple="!editingSlot"
                    aria-labelledby="multiple" class="flex flex-wrap gap-1" />
            </div>

            <!-- Horaires -->
            <div class="flex flex-col gap-2">
                <label class="font-semibold text-sm flex items-center gap-2">
                    <Icon name="lucide:clock" size="18" />
                    Horaires
                    <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                    <div class="flex flex-col gap-1">
                        <label for="start-time" class="text-xs text-zinc-500">Début</label>
                        <InputText id="start-time" type="time" v-model="startTime"
                            style="--p-inputtext-focus-border-color:white" />
                    </div>
                    <Icon name="lucide:arrow-right" size="20" class="text-zinc-500 mt-5" />
                    <div class="flex flex-col gap-1">
                        <label for="end-time" class="text-xs text-zinc-500">Fin</label>
                        <InputText id="end-time" type="time" v-model="endTime"
                            style="--p-inputtext-focus-border-color:white" />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex gap-2 w-full">
                <Button type="button" label="Annuler" severity="secondary" @click="visible = false" outlined
                    class="flex-1">
                    <template #icon>
                        <Icon name="lucide:x" size="18" />
                    </template>
                </Button>
                <Button type="button" :label="editingSlot ? 'Mettre à jour' : 'Enregistrer'" severity="contrast"
                    @click="saveSlot"
                    :disabled="isColorInvalid || !selectedGame?.label || !startTime || !endTime || selectedDays.length === 0"
                    class="flex-1">
                    <template #icon>
                        <Icon :name="editingSlot ? 'lucide:check' : 'lucide:save'" size="18" />
                    </template>
                </Button>
            </div>
        </template>
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

function formatTime(time: string) {
    if (!time) return ''
    const [h, m] = time.split(':')
    return `${h}h${m}`
}

// Gestion de la modal de créneau
const {
    visible,
    selectedGame,
    title,
    slotColor,
    colorInput,
    isColorInvalid,
    useGameColor,
    resetColor,
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

// Fonction pour générer le style d'un slot
const slotStyle = (slot: any) => {
    if (slot.game.cover) {
        return {
            borderColor: `#${slot.color}`,
            backgroundImage: `url(${slot.game.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }
    }
    return {}
}

onMounted(async () => {
    await loadSlots()
})
</script>
