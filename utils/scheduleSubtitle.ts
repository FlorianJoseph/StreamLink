// Génère le sous-titre pour la semaine en cours
export const getCurrentWeekSubtitle = () => {
    const today = new Date()

    // Jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
    const day = today.getDay()

    // Calcul du lundi et dimanche de la semaine en cours
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((day + 6) % 7))

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    // Format de date (ex: 23/01/2026)
    const options = { day: '2-digit', month: 'long' } as const
    const mondayStr = monday.toLocaleDateString('fr-FR', options)
    const sundayStr = sunday.toLocaleDateString('fr-FR', options)

    return `Du ${mondayStr} au ${sundayStr}`
}