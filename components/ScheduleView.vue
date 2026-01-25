<template>
    <Card class="p-4 relative" :style="{ backgroundColor: schedule?.style?.bgColor || '' }">
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
            <div class="flex gap-2 p-3">
                <div v-for="day in daysOptions" :key="day.label" class="flex-1" @click="openSlotModal(day.label)">
                    <div class="flex gap-2 p-3">
                        <div class="flex-1 text-center rounded-lg font-bold text-lg">
                            {{ day.label }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <!-- Si des créneaux existent pour ce jour, on les affiche -->
                        <Card v-for="slot in slotsForDay(day.label)" :key="slot.id"
                            class="p-2 border border-zinc-600 rounded-md">
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="font-semibold">{{ slot.title }}</div>
                                    <div class="text-sm text-zinc-500">
                                        {{ typeof slot.game === 'string' ? slot.game : slot.game.name }}
                                    </div>
                                    <div class="text-sm text-zinc-500">
                                        {{ formatTime(slot.start_at) }} - {{ formatTime(slot.end_at) }}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <!-- Sinon, on affiche le bouton + pour ajouter un créneau -->
                        <Card v-if="slotsForDay(day.label).length === 0"
                            class="h-110 border border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition"
                            @click="openSlotModal(day.label)">
                            <template #content>
                                <div class="border-zinc-700">
                                    <Icon name="lucide:plus" size="32" />
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="absolute bottom-3 right-3 text-xs text-zinc-400/60 select-none pointer-events-none">
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
            <span class="font-semibold">Sélectionne les jours de stream</span>
            <SelectButton v-model="selectedDays" :options="daysOptions" optionLabel="label" multiple
                aria-labelledby="multiple" class="flex flex-wrap gap-1 rounded" />
            <div class="flex gap-2">
                <span class="flex items-center">Horaire :</span>
                <InputText type="time" v-model="startTime" />
                <span class="flex items-center">-></span>
                <InputText type="time" v-model="endTime" />
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Annuler" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Enregistrer" severity="contrast" @click="saveSlot"></Button>
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

type GameInfo = {
    id?: string | number
    name: string
    cover?: string
    color?: string
}

// Gestion de l’ajout de créneaux
type StreamSlot = {
    game: GameInfo | string
    title: string
    day: string[]
    start_at: string
    end_at: string
    schedule_id: string
}

function gameFromSlot(slot: StreamSlot) {
    return typeof slot.game === 'string' ? { name: slot.game } : slot.game
}

// Modal d’ajout de créneau
const visible = ref(false)
const game = ref<StreamSlot['game']>('Jeu vidéo')
const title = ref<StreamSlot['title']>('Titre du stream')
const daysOptions = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(label => ({ label }))
const selectedDays = ref([...daysOptions])
const startTime = ref<StreamSlot['start_at']>('12:00')
const endTime = ref<StreamSlot['end_at']>('14:00')
watch([startTime, endTime], () => {
    if (endTime.value < startTime.value) {
        endTime.value = startTime.value
    }
})

function openSlotModal(day: string) {
    selectedDays.value = [{ label: day }]
    game.value = 'Jeu vidéo'
    title.value = 'Titre du stream'
    startTime.value = '12:00'
    endTime.value = '14:00'
    visible.value = true
}

function toTimestamptz(time: string) {
    const today = new Date()
    const [hours, minutes] = time.split(':').map(Number)
    today.setHours(hours, minutes, 0, 0)
    return today.toISOString() // renvoie un timestamp ISO compatible Postgres
}

const slots = ref<StreamSlot[]>([])

async function saveSlot() {
    if (!schedule.value) return
    await scheduleSlotStore.createSlot({
        schedule_id: schedule.value.id!,
        game: game.value,
        title: title.value,
        day: selectedDays.value.map(d => d.label),
        start_at: toTimestamptz(startTime.value),
        end_at: toTimestamptz(endTime.value)
    })
    await loadSlots()
    visible.value = false
}

async function loadSlots() {
    if (!schedule.value) return
    const { data } = await scheduleSlotStore.fetchSlots(schedule.value.id!)
    if (data) slots.value = data
}

function slotsForDay(day: string) {
    return slots.value.filter(slot => slot.day.includes(day))
}

function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(async () => {
    await loadSlots()
})
</script>