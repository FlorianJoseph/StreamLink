import type { Tables } from '~/types/database.types'
import type { LiveStatus } from '~/server/utils/twitchLive'

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
        const [startH, startM] = slot.start_at.split(':').map(Number)

        const targetDay = dayMap[slot.day]
        if (targetDay === undefined) return null

        // Calcul du prochain jour correspondant
        const slotDate = new Date(now)
        const diff = targetDay - now.getDay()
        slotDate.setDate(now.getDate() + diff)
        slotDate.setHours(startH, startM, 0, 0)

        const isToday = slotDate.toDateString() === now.toDateString()
        const tomorrow = new Date(now)
        tomorrow.setDate(now.getDate() + 1)
        const isTomorrow = slotDate.toDateString() === tomorrow.toDateString()

        return {
          ...slot,
          slotDate,
          isToday,
          isTomorrow,
        }
      })
      .filter(slot => slot && slot.slotDate > now)
      .sort((a, b) => a.slotDate.getTime() - b.slotDate.getTime())

    return upcoming[0] || null
  }

  // Fonction pour récupérer les streamers et calculer leur prochain stream
  const fetchStreamersWithNextSlot = async () => {
    loading.value = true
    try {
      // 1. Récupération Supabase — inchangé
      const allStreamers = await $fetch('/api/streamers/visible')

      // 2. Calcul des nextSlots depuis le planning local
      const mapped = allStreamers
        .map(streamer => {
          let nextSlot = null
          if (streamer.Schedule?.length && streamer.Schedule[0].ScheduleSlot?.length) {
            nextSlot = getNextSlot(streamer.Schedule[0].ScheduleSlot)
          }
          return { ...streamer, nextSlot }
        })
        .sort((a, b) => {
          if (!a.nextSlot && b.nextSlot) return 1
          if (a.nextSlot && !b.nextSlot) return -1
          if (!a.nextSlot && !b.nextSlot) return a.username.localeCompare(b.username)
          return (a.nextSlot.slotDate?.getTime() ?? 0) - (b.nextSlot.slotDate?.getTime() ?? 0)
        })

      // Affichage immédiat avec le isLive planning (pas d'attente Twitch)
      streamers.value = mapped

      // 3. Enrichissement Twitch en arrière-plan
      const usernames = mapped
        .map(s => s.username)
        .filter(Boolean)

      if (usernames.length > 0) {
        const liveStatuses = await $fetch<Record<string, LiveStatus>>(
          '/api/twitch/live-batch',
          {
            method: 'POST',
            body: { usernames },
          }
        ).catch(err => {
          // Echec silencieux : on garde le isLive planning comme fallback
          console.warn('[useDiscoverStreamers] Twitch live-batch échoué, fallback planning', err)
          return null
        })
        if (liveStatuses) {
          // 4. Merge : on écrase isLive + on ajoute gameName/viewerCount/title depuis Twitch
          const merged = mapped.map(streamer => {
            const twitchStatus = liveStatuses[streamer.username?.toLowerCase()]
            if (!twitchStatus) return streamer

            return {
              ...streamer,
              nextSlot: streamer.nextSlot
                ? {
                  ...streamer.nextSlot,
                  isLive: twitchStatus.isLive,
                  // Nouvelles données Twitch disponibles sur la carte
                  twitchGameName: twitchStatus.gameName,
                  twitchViewerCount: twitchStatus.viewerCount,
                  twitchTitle: twitchStatus.title,
                  twitchThumbnailUrl: twitchStatus.thumbnailUrl,
                  twitchStartedAt: twitchStatus.startedAt,
                }
                : streamer.nextSlot,
            }
          })
          // 5. Tri final : lives en premier (par heure de début Twitch asc), puis prochain slot asc, puis sans planning
          streamers.value = merged.sort((a, b) => {
            const aLive = a.nextSlot?.isLive === true
            const bLive = b.nextSlot?.isLive === true
            if (aLive && !bLive) return -1
            if (!aLive && bLive) return 1
            if (aLive && bLive) {
              return (a.nextSlot?.twitchViewerCount ?? 0) - (b.nextSlot?.twitchViewerCount ?? 0)
            }
            if (!a.nextSlot && b.nextSlot) return 1
            if (a.nextSlot && !b.nextSlot) return -1
            return (a.nextSlot?.slotDate?.getTime() ?? 0) - (b.nextSlot?.slotDate?.getTime() ?? 0)
          })
        }
      }
    } finally {
      loading.value = false
    }
  }

  return {
    streamers,
    loading,
    fetchStreamersWithNextSlot
  }
}
