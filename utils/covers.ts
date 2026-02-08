export const CUSTOM_CATEGORY_COVERS: Record<string, string> = {
    'Just Chatting': '/covers/just-chatting.jpg',
    'IRL': '/covers/irl.jpg',
    'Music': '/covers/music.jpg',
    'Talk Shows & Podcasts': '/covers/podcasts.jpg',
    'Special Events': '/covers/events.jpg',
    'Food & Drink': '/covers/food.jpg',
    'ASMR': '/covers/asmr.jpg',
    'Fitness & Health': '/covers/fitness.jpg',
    'Science & Technology': '/covers/science.jpg',
    'Sports': '/covers/sports.jpg',
}

export const resolveCategoryCover = ({
    igdbCover,
    categoryName,
}: {
    igdbCover?: string | null
    categoryName: string
}) => {
    // IGDB (meilleur rendu)
    if (igdbCover) return igdbCover

    // Cover custom StreamLink
    const custom = CUSTOM_CATEGORY_COVERS[categoryName]
    if (custom) return custom

    // Si pas de cover IGDB et pas de cover custom, on retourne une cover fallback générique
    return '/covers/fallback.jpg'
}
