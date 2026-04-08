import { serverSupabaseClient } from '#supabase/server'
import { fetchLiveStatuses } from '~/server/utils/twitchLive'

const TWITCH_LOGIN_REGEX = /^[a-zA-Z0-9_]{1,25}$/

// Mélange un tableau (Fisher-Yates) pour éviter les biais de position
function shuffle<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

// Sélectionne de manière pondérée en évitant les doublons (max 1 par username)
function weightedPick<T extends { weight: number; username: string }>(items: T[], count: number): T[] {
    const result: T[] = []
    const used = new Set<string>()

    while (result.length < count && used.size < items.length) {
        const available = items.filter(i => !used.has(i.username.toLowerCase()))
        if (!available.length) break

        const total = available.reduce((sum, i) => sum + i.weight, 0)
        if (total === 0) {
            result.push(...shuffle(available).slice(0, count - result.length))
            break
        }

        let r = Math.random() * total
        for (const item of available) {
            r -= item.weight
            if (r <= 0) {
                result.push(item)
                used.add(item.username.toLowerCase())
                break
            }
        }
    }

    return result
}

// Score basé sur : jeux partagés, heures proches, même langue, live
function computeScore(
    s: any,
    targetGames: string[],
    targetHours: number[],
    targetLang: string,
    liveStatuses: Record<string, { isLive: boolean }>
): number {
    const games: string[] = s.Schedule?.[0]?.ScheduleSlot
        ?.map((slot: any) => slot.game?.label)
        .filter(Boolean) ?? []

    const otherHours: number[] = s.Schedule?.[0]?.ScheduleSlot
        ?.map((slot: any) => parseInt(slot.start_at?.split(':')[0]))
        .filter((h): h is number => !isNaN(h)) ?? []

    const sharedGames = games.filter(g => targetGames.includes(g)).length
    const sameLanguage = s.language === targetLang ? 1 : 0
    const overlappingHours = otherHours.filter(h =>
        targetHours.some(th => Math.abs(th - h) <= 2)
    ).length
    const isLive = liveStatuses[s.username?.toLowerCase()]?.isLive ?? false

    return sharedGames * 3 + overlappingHours * 2 + sameLanguage + (isLive ? 2 : 0)
}

// Formate la réponse pour ne renvoyer que les champs nécessaires
function format(pool: any[], liveStatuses: Record<string, any>) {
    return pool.map(s => ({
        username: s.username,
        avatar_url: s.avatar_url,
        isLive: s.isLive,
        twitchGameName: s.isLive ? (liveStatuses[s.username?.toLowerCase()]?.gameName ?? null) : null,
        nextSlot: s.nextSlot ? {
            day: s.nextSlot.day,
            start_at: s.nextSlot.start_at,
            isToday: s.nextSlot.isToday,
            isTomorrow: s.nextSlot.isTomorrow,
            game: s.nextSlot.game,
        } : null,
    }))
}

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { username } = event.context.params as { username: string }
    const body = await readBody(event)
    const exclude: string[] = body?.exclude ?? []

    // Récupère le profil du streamer cible
    const { data: target } = await client
        .from('users_visible')
        .select(`
            username,
            language,
            Schedule (
                ScheduleSlot ( game, start_at )
            )
        `)
        .eq('username', username)
        .maybeSingle()

    if (!target) return []

    const targetGames: string[] = target.Schedule?.[0]?.ScheduleSlot
        ?.map((s: any) => s.game?.label)
        .filter(Boolean) ?? []

    const targetHours: number[] = target.Schedule?.[0]?.ScheduleSlot
        ?.map((s: any) => parseInt(s.start_at?.split(':')[0]))
        .filter((h): h is number => !isNaN(h)) ?? []

    // Récupère tous les autres streamers visibles
    const { data: others } = await client
        .from('users_visible')
        .select(`
            username,
            avatar_url,
            language,
            Schedule (
                ScheduleSlot ( game, day, start_at )
            )
        `)
        .neq('username', username)

    if (!others?.length) return []

    const allUsernames = others
        .map((s: any) => s.username)
        .filter((u): u is string => typeof u === 'string' && TWITCH_LOGIN_REGEX.test(u))
    const liveStatuses = await fetchLiveStatuses(allUsernames)

    // Score + poids softmax normalisé
    const rawScores = others.map((s: any) =>
        computeScore(s, targetGames, targetHours, target.language, liveStatuses)
    )
    const maxScore = Math.max(...rawScores, 0)

    const scored = others.map((s: any, i: number) => ({
        ...s,
        score: rawScores[i],
        weight: Math.exp((rawScores[i] - maxScore) / 1.2),
        nextSlot: getNextSlot(s.Schedule?.[0]?.ScheduleSlot ?? []),
        isLive: liveStatuses[s.username?.toLowerCase()]?.isLive ?? false,
    }))

    // Filtre : actifs uniquement + pas dans l'exclude
    const relevant = scored.filter(s =>
        (s.isLive || s.nextSlot !== null) && !exclude.includes(s.username)
    )

    // Sélection pondérée
    const finalPool = weightedPick(relevant, 3)

    // Fallback si moins de 3
    if (finalPool.length < 3) {
        const used = new Set(finalPool.map(f => f.username.toLowerCase()))
        const sameLang = shuffle(
            scored.filter(s =>
                s.language === target.language &&
                (s.isLive || s.nextSlot !== null) &&
                !used.has(s.username.toLowerCase())
            )
        ).slice(0, 3 - finalPool.length)
        finalPool.push(...sameLang)
    }

    return format(finalPool.slice(0, 3), liveStatuses)
})

// Trouve le prochain slot à venir pour un streamer
function getNextSlot(slots: any[]) {
    const now = new Date()
    const DAY_MAP: Record<string, number> = {
        Dimanche: 0, Lundi: 1, Mardi: 2, Mercredi: 3,
        Jeudi: 4, Vendredi: 5, Samedi: 6,
    }

    const upcoming = slots
        .map((slot: any) => {
            if (!slot.start_at || !slot.day) return null
            const [startH, startM] = slot.start_at.split(':').map(Number)
            const targetDay = DAY_MAP[slot.day]
            if (targetDay === undefined) return null
            const slotDate = new Date(now)
            slotDate.setDate(now.getDate() + (targetDay - now.getDay()))
            slotDate.setHours(startH, startM, 0, 0)
            if (slotDate <= now) slotDate.setDate(slotDate.getDate() + 7)
            const isToday = slotDate.toDateString() === now.toDateString()
            const tomorrow = new Date(now)
            tomorrow.setDate(now.getDate() + 1)
            const isTomorrow = slotDate.toDateString() === tomorrow.toDateString()
            return { ...slot, slotDate, isToday, isTomorrow }
        })
        .filter(s => s && s.slotDate > now)
        .sort((a, b) => a.slotDate.getTime() - b.slotDate.getTime())

    return upcoming[0] || null
}