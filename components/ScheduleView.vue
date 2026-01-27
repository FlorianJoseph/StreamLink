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
                        <div class="font-semibold mb-2 text-center">{{ day.label }}</div>
                        <div class="grid grid-rows-[auto_1fr_auto] gap-2 lg:h-110 w-full">

                            <!-- CAS : aucun créneau -->
                            <Card v-if="slotsForDay(day.label).length === 0"
                                class="row-span-3 border border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition h-full w-full"
                                @click="openSlotModal(day.label)">
                                <template #content>
                                    <Icon name="lucide:plus" size="18" />
                                </template>
                            </Card>

                            <!-- CAS : il y a des créneaux -->
                            <template v-else>
                                <!-- Zone + en haut -->
                                <Card
                                    class="h-6 border border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition w-full"
                                    @click="openSlotModal(day.label)">
                                    <template #content>
                                        <Icon name="lucide:plus" size="14" />
                                    </template>
                                </Card>

                                <!-- Créneaux -->
                                <div class="flex flex-col gap-1 overflow-hidden w-full">
                                    <Card v-for="slot in slotsForDay(day.label)" :key="slot.id"
                                        class="border border-zinc-600 rounded flex-1 min-h-0 w-full relative">
                                        <template #content>
                                            <div class="flex flex-col justify-between h-full">
                                                <div class="font-semibold truncate">{{ slot.title }}</div>
                                                <div class="text-sm text-zinc-500 truncate">{{ slot.game }}</div>
                                                <div class="text-sm text-zinc-500">
                                                    {{ formatTime(slot.start_at) }} - {{ formatTime(slot.end_at) }}
                                                </div>
                                                <!-- Icônes hover -->
                                                <div
                                                    class="absolute flex opacity-0 hover:opacity-100 transition-opacity h-full w-full top-0 left-0 bg-black/30 items-center justify-center rounded-xl">
                                                    <button @click.prevent="openSlotModal(day.label, slot)"
                                                        class="p-1 rounded hover:bg-black/30 flex-1 h-full transition rounded-xl">
                                                        <Icon name="lucide:edit-2" size="20" />
                                                    </button>
                                                    <button @click.prevent="deleteSlot(slot)"
                                                        class="p-1 rounded hover:bg-black/30 flex-1 h-full transition rounded-xl">
                                                        <Icon name="lucide:trash-2" size="20" />
                                                    </button>
                                                </div>
                                            </div>
                                        </template>
                                    </Card>
                                </div>

                                <!-- Zone + en bas -->
                                <Card
                                    class="h-6 border border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition w-full"
                                    @click="openSlotModal(day.label)">
                                    <template #content>
                                        <Icon name="lucide:plus" size="14" />
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
                <InputText type="text" v-model="game" />
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-semibold">Titre du stream</span>
                <InputText type="text" v-model="title" />
            </div>
            <div class="flex flex-col">
                <span class="font-semibold">Sélectionne les jours de stream</span>
                <span class="text-sm text-zinc-500">Tu peux ajouter le même créneau à plusieurs jours en même
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

// Modal d’ajout de créneau
const visible = ref(false)
const game = ref('Jeu vidéo')
const title = ref('Titre du stream')
const daysOptions = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(label => ({ label }))
const selectedDays = ref([...daysOptions])
const startTime = ref('12:00')
const endTime = ref('14:00')

// Slots
const slots = ref([])

async function loadSlots() {
    if (!schedule.value) return
    const { data } = await scheduleSlotStore.fetchSlots(schedule.value.id)
    if (data) slots.value = data
}

function slotsForDay(day: string) {
    return slots.value.filter(slot => slot.day.includes(day))
}

// Assure que endTime >= startTime
watch(startTime, (newStart) => {
    const [h, m] = newStart.split(':').map(Number)
    let endH = h + 1
    let endM = m

    // Gestion du dépassement de 24h
    if (endH >= 24) endH -= 24

    // Formatage en "HH:MM"
    const pad = (n: number) => n.toString().padStart(2, '0')
    endTime.value = `${pad(endH)}:${pad(endM)}`
})

const editingSlot = ref(null)

function openSlotModal(day: string, slot?: any) {
    if (slot) {
        // Edition d'un slot existant
        editingSlot.value = slot
        title.value = slot.title
        game.value = slot.game
        startTime.value = slot.start_at.slice(11, 16)
        endTime.value = slot.end_at.slice(11, 16)
        selectedDays.value = daysOptions.find(d => d.label === slot.day)

    } else {
        // Nouveau slot
        editingSlot.value = null
        selectedDays.value = [{ label: day }]
        game.value = 'Jeu vidéo'
        title.value = 'Titre du stream'
        startTime.value = '12:00'
        endTime.value = '14:00'
    }
    visible.value = true
}

function toTimestamptz(time: string) {
    const d = new Date()
    const [h, m] = time.split(':').map(Number)
    d.setHours(h, m, 0, 0)
    return d.toISOString()
}

async function saveSlot() {
    if (!schedule.value) return

    const dayValue = Array.isArray(selectedDays.value)
        ? selectedDays.value.map(d => (typeof d === 'string' ? d : d.label))
        : [selectedDays.value.label]

    const slotData = {
        schedule_id: schedule.value.id!,
        title: title.value,
        game: game.value,
        start_at: toTimestamptz(startTime.value),
        end_at: toTimestamptz(endTime.value),
        day: dayValue[0]
    }

    if (editingSlot.value) {
        // Mise à jour
        await scheduleSlotStore.updateSlot(editingSlot.value.id, slotData)
    } else {
        // Création de nouveaux slots
        for (const d of selectedDays.value.map(d => d.label)) {
            await scheduleSlotStore.createSlot({ ...slotData, day: d })
        }
    }
    await loadSlots()
    visible.value = false
}

function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

async function deleteSlot(slot: any) {
    if (!schedule.value) return
    const confirmed = confirm(`Es-tu sûr de vouloir supprimer le créneau "${slot.title}" ?`)
    if (!confirmed) return
    await scheduleSlotStore.deleteSlot(slot.id)
    await loadSlots()
}

onMounted(async () => {
    await loadSlots()
})
</script>