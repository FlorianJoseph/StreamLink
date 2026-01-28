import type { Tables } from '~/types/database.types'

type ScheduleSlot = Tables<'ScheduleSlot'>

export const useSlotModal = (scheduleId: string, slots: Ref<ScheduleSlot[]>, scheduleSlotStore: any, loadSlots: () => Promise<void>) => {
    const visible = ref(false)
    const selectedGame = ref<{ label: string; cover?: string } | null>({ label: '', cover: '' })
    const gameSuggestions = ref<{ label: string; cover?: string }[]>([])
    const title = ref('')
    const daysOptions = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(label => ({ label }))
    const selectedDays = ref<{ label: string }[]>([...daysOptions])
    const startTime = ref('12:00')
    const endTime = ref('14:00')
    const editingSlot = ref<ScheduleSlot | null>(null)

    async function searchGames(event: { query: string }) {
        if (!event.query) {
            gameSuggestions.value = []
            return
        }
        const res = await $fetch('/api/IGDBgames', { params: { search: event.query } })
        gameSuggestions.value = res
    }

    // Watch pour s'assurer que endTime >= startTime
    watch(startTime, (newStart) => {
        const [sh, sm] = newStart.split(':').map(Number)
        const [eh, em] = endTime.value.split(':').map(Number)
        const startMins = sh * 60 + sm
        const endMins = eh * 60 + em
        if (endMins > startMins) return
        endTime.value = addMinutes(newStart, 60)
    })

    // Ajoute des minutes à une heure au format "HH:MM"
    function addMinutes(time: string, minutes: number) {
        const [h, m] = time.split(':').map(Number)
        const total = h * 60 + m + minutes
        const nh = Math.floor(total / 60) % 24
        const nm = total % 60
        return `${nh.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}`
    }

    // Soustrait des minutes à une heure au format "HH:MM"
    function subMinutes(time: string, minutes: number) {
        return addMinutes(time, -minutes)
    }

    // Ouvre la modal pour ajouter ou éditer un slot
    function openSlotModal(day: string, slot?: ScheduleSlot, position?: 'before' | 'after') {
        const daySlots = slots.value.filter(s => s.day === day)

        if (slot) {
            editingSlot.value = slot
            title.value = slot.title
            selectedGame.value = slot.game
            startTime.value = slot.start_at
            endTime.value = slot.end_at
            selectedDays.value = daysOptions.find(d => d.label === slot.day)
        } else {
            editingSlot.value = null
            selectedDays.value = [{ label: day }]
            selectedGame.value = { label: '', cover: '' }
            title.value = ''

            if (!daySlots.length) {
                startTime.value = '12:00'
                endTime.value = '14:00'
            } else if (position === 'after') {
                // Après le dernier créneau
                const last = daySlots[daySlots.length - 1]
                startTime.value = last.end_at
                endTime.value = addMinutes(last.end_at, 60)
            } else {
                // Avant le premier créneau
                const first = daySlots[0]
                startTime.value = subMinutes(first.start_at, 60)
                endTime.value = first.start_at
            }
        }

        visible.value = true
    }

    // Sauvegarde le slot (création ou mise à jour)
    async function saveSlot() {
        const dayValue = Array.isArray(selectedDays.value)
            ? selectedDays.value.map(d => d.label)
            : [selectedDays.value.label]

        const slotData = {
            schedule_id: scheduleId,
            title: title.value || selectedGame.value?.label || 'Titre du stream',
            game: selectedGame.value,
            start_at: startTime.value,
            end_at: endTime.value,
            day: dayValue[0]
        }

        if (editingSlot.value) {
            await scheduleSlotStore.updateSlot(editingSlot.value.id, slotData)
        } else {
            for (const d of selectedDays.value.map(d => d.label)) {
                await scheduleSlotStore.createSlot({ ...slotData, day: d })
            }
        }

        // Recharger les slots pour actualiser l'affichage
        await loadSlots()
        visible.value = false
    }

    return {
        visible,
        selectedGame,
        title,
        startTime,
        endTime,
        selectedDays,
        daysOptions,
        editingSlot,
        openSlotModal,
        saveSlot,
        addMinutes,
        subMinutes,
        searchGames,
        gameSuggestions
    }
}
