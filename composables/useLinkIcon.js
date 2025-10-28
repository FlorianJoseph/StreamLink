export const iconMapping = {
    twitch: 'simple-icons:twitch',
    youtube: 'simple-icons:youtube',
    youtu: 'simple-icons:youtube', // pour youtu.be
    instagram: 'simple-icons:instagram',
    twitter: 'simple-icons:twitter',
    facebook: 'simple-icons:facebook',
    discord: 'simple-icons:discord',
    tiktok: 'simple-icons:tiktok',
    kick: 'simple-icons:kick',
    spotify: 'simple-icons:spotify',
    steam: 'simple-icons:steam',
    amazon: 'simple-icons:amazon',
    shop: 'simple-icons:amazon'
}

// Fonction pour obtenir une icône par défaut en fonction de l'URL
export const useLinkIcon = () => {
    const getDefaultIcon = (url) => {
        if (!url) return 'lucide:link-2'
        const lower = url.toLowerCase()
        for (const key in iconMapping) {
            if (lower.includes(key)) return iconMapping[key]
        }
        return 'lucide:link-2'
    }

    return { getDefaultIcon }
}