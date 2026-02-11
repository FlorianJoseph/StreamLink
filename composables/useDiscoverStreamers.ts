import type { Tables } from '~/types/database.types'

type ScheduleSlot = Tables<'ScheduleSlot'>

// Composable pour gérer la logique de découverte des streamers et de leur prochain stream
export function useDiscoverStreamers() {
  const streamers = ref<any[]>([])
  const loading = ref(false)

  // Fonction pour récupérer le prochain slot d'aujourd'hui ou futur
  function getNextSlot(slots: ScheduleSlot[]): ScheduleSlot | null {
    const now = new Date()

    const dayMap: Record<string, number> = {
      Dimanche: 0,
      Lundi: 1,
      Mardi: 2,
      Mercredi: 3,
      Jeudi: 4,
      Vendredi: 5,
      Samedi: 6,
    }

    // Transforme les slots en objets avec une date complète pour le tri
    const upcoming = slots
      .map(slot => {
        const [hours, minutes] = slot.start_at.split(':').map(Number)
        const targetDay = dayMap[slot.day]
        if (targetDay === undefined) return null

        // Calcul du prochain jour correspondant
        const slotDate = new Date()
        const diffDays = (targetDay + 7 - slotDate.getDay()) % 7
        slotDate.setDate(slotDate.getDate() + diffDays)
        slotDate.setHours(hours, minutes, 0, 0)

        return { ...slot, slotDate }
      })
      .filter(slot => slot && slot.slotDate.getTime() > now.getTime())
      .sort((a, b) => a.slotDate.getTime() - b.slotDate.getTime())

    return upcoming[0] || null
  }

  // Fonction pour récupérer les streamers et calculer leur prochain stream
  const fetchStreamersWithNextSlot = async () => {
    loading.value = true
    const streamerStore = useStreamerStore()
    const allStreamers = await streamerStore.fetchAllStreamers()

    // Parcours chaque streamer et calcule nextSlot puis trie les streamers en fonction de nextSlot
    streamers.value = allStreamers
      .map(streamer => {
        let nextSlot = null

        if (streamer.Schedule?.length && streamer.Schedule[0].ScheduleSlot?.length) {
          nextSlot = getNextSlot(streamer.Schedule[0].ScheduleSlot)
        }

        return {
          ...streamer,
          nextSlot
        }
      })
      .sort((a, b) => {
        if (!a.nextSlot && b.nextSlot) return 1
        if (a.nextSlot && !b.nextSlot) return -1
        if (!a.nextSlot && !b.nextSlot)
          return a.username.localeCompare(b.username)

        return (
          (a.nextSlot.slotDate?.getTime() ?? 0) -
          (b.nextSlot.slotDate?.getTime() ?? 0)
        )
      })

    loading.value = false
  }

  return {
    streamers,
    loading,
    fetchStreamersWithNextSlot
  }
}
