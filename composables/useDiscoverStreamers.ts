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

        // Si la date calculée est dans le passé, reporter à la semaine prochaine
        if (slotDate <= now) {
          slotDate.setDate(slotDate.getDate() + 7)
        }

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

      // 3. Enrichissement Twitch
      const usernames = mapped.map(s => s.username).filter(Boolean)

      if (usernames.length > 0) {
        let liveStatuses: Record<string, LiveStatus> | null = null
        try {
          liveStatuses = await $fetch<Record<string, LiveStatus>>(
            '/api/twitch/live-batch',
            { method: 'POST', body: { usernames } }
          )
        } catch (err) {
          console.warn('[useDiscoverStreamers] Twitch live-batch échoué', err)
        }

        if (liveStatuses) {
          // 4. Merge
          const merged = mapped.map(streamer => {
            const twitchStatus = liveStatuses[streamer.username?.toLowerCase()]
            if (!twitchStatus) return streamer

            return {
              ...streamer,
              nextSlot: streamer.nextSlot
                ? {
                  ...streamer.nextSlot,
                  isLive: twitchStatus.isLive,
                  twitchGameName: twitchStatus.gameName,
                  twitchViewerCount: twitchStatus.viewerCount,
                  twitchTitle: twitchStatus.title,
                  twitchThumbnailUrl: twitchStatus.thumbnailUrl,
                  twitchGameId: twitchStatus.gameId,
                  twitchStartedAt: twitchStatus.startedAt,
                }
                : streamer.nextSlot,
            }
          })

          // 5. Enrichissement covers + catégories IGDB pour les streamers en live
          const liveGameIds = merged
            .filter(s => s.nextSlot?.isLive && s.nextSlot?.twitchGameId)
            .map(s => s.nextSlot.twitchGameId)
            .filter((id, i, arr) => arr.indexOf(id) === i)

          if (liveGameIds.length > 0) {
            let covers: Record<string, { cover: string | null; category: string | null }> = {}
            try {
              covers = await $fetch('/api/twitch/game-covers',
                { method: 'POST', body: { gameIds: liveGameIds } }
              )
            } catch (err) {
              console.warn('[useDiscoverStreamers] Twitch game-covers échoué', err)
            }

            for (const streamer of merged) {
              const gameId = streamer.nextSlot?.twitchGameId
              if (gameId && covers[gameId]) {
                const { cover, category } = covers[gameId]
                if (cover) streamer.nextSlot.twitchGameCover = cover
                if (category) streamer.nextSlot.twitchGameCategory = category
              }
            }
          }

          // 6. Catégories IGDB pour les streamers offline (par nom de jeu)
          const offlineGameNames = merged
            .filter(s => !s.nextSlot?.isLive && s.nextSlot?.game?.label && !s.nextSlot?.twitchGameCategory)
            .map(s => s.nextSlot.game.label as string)
            .filter((name, i, arr) => arr.indexOf(name) === i)

          if (offlineGameNames.length > 0) {
            let nameCategories: Record<string, string | null> = {}
            try {
              nameCategories = await $fetch('/api/igdb/categories-by-name',
                { method: 'POST', body: { gameNames: offlineGameNames } }
              )
            } catch (err) {
              console.warn('[useDiscoverStreamers] IGDB categories-by-name échoué', err)
            }

            for (const streamer of merged) {
              if (!streamer.nextSlot?.isLive && !streamer.nextSlot?.twitchGameCategory) {
                const gameName = streamer.nextSlot?.game?.label
                if (gameName && nameCategories[gameName]) {
                  streamer.nextSlot.twitchGameCategory = nameCategories[gameName]
                }
              }
            }
          }

          // 7. Tri final : lives en premier (par viewers asc), puis prochain slot asc, puis sans planning
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
    fetchStreamersWithNextSlot,
  }
}