export const useVignetteUploader = (linkRef) => {
    const supabase = useSupabaseClient()
    const linkStore = useLinkStore()

    const imageUrl = ref(null)
    const croppedImage = ref(null)
    const selectedIcon = ref(null)
    const searchIcon = ref('')

    // Liste d'icônes disponibles
    const availableIcons = ({
        'Réseaux sociaux': [
            'simple-icons:facebook',
            'simple-icons:twitter',
            'simple-icons:instagram',
            'simple-icons:linkedin',
            'simple-icons:tiktok',
            'simple-icons:snapchat',
            'simple-icons:reddit',
            'simple-icons:threads',
            'simple-icons:youtube',
            'simple-icons:twitch',
            'simple-icons:discord',
            'simple-icons:kick',
            'simple-icons:steam',
            'simple-icons:xbox',
            'simple-icons:playstation',
            'simple-icons:nintendo',
            'simple-icons:roblox',
        ],
        'Paiement & soutien': [
            'simple-icons:paypal',
            'simple-icons:patreon',
            'simple-icons:kofi',
            'simple-icons:buymeacoffee',
            'simple-icons:amazon',
            'simple-icons:cashapp',
        ],
        'Musique & audio': [
            'simple-icons:spotify',
            'simple-icons:soundcloud',
            'simple-icons:applemusic',
            'simple-icons:bandcamp',
            'simple-icons:deezer',
        ],
        'Autres': [
            'lucide:mail',
            'lucide:phone',
            'lucide:globe',
            'lucide:link',
            'lucide:map-pin',
            'lucide:calendar',
            'lucide:file-text',
            'lucide:shopping-cart',
            'lucide:credit-card',
            'lucide:bell',
            'lucide:user',
            'lucide:users',
            'lucide:heart',
            'lucide:star',
            'lucide:check',
            'lucide:x',
            'lucide:search',
            'lucide:settings',
            'lucide:share',
            'lucide:lock',
            'lucide:unlock',
            'lucide:upload',
            'lucide:download',
            'lucide:home',
            'lucide:info',
            'lucide:alert-triangle',
            'lucide:alert-circle'
        ],
    })

    // Filtrer les icônes selon la recherche
    const filteredIconsByCategory = computed(() => {
        const query = searchIcon.value.trim().toLowerCase()
        if (!query) return availableIcons

        const result = {}
        for (const [category, icons] of Object.entries(availableIcons)) {
            const filtered = icons.filter(icon => icon.toLowerCase().includes(query))
            if (filtered.length) result[category] = filtered
        }
        return result
    })

    // Étape 1 : Fichier sélectionné
    const onFileSelect = (event) => {
        const file = event.files?.[0]
        if (!file) return
        const localUrl = URL.createObjectURL(file)
        imageUrl.value = localUrl
    }

    // Étape 2 : Crop
    const onCropChange = ({ canvas }) => {
        if (canvas) croppedImage.value = canvas
    }

    const selectIcon = async (iconName) => {
        selectedIcon.value = iconName
        imageUrl.value = null // supprime l'image si icône choisie
    }

    // Étape 3 : Sauvegarde sur Supabase
    const saveVignette = async () => {
        if (!linkRef.value) {
            console.warn('linkRef ou linkRef.id est manquant !')
            return
        }

        // Si une image est uploadée
        if (croppedImage.value) {
            croppedImage.value.toBlob(async (blob) => {
                const filePath = `Vignette/${linkRef.value.id}_${crypto.randomUUID()}.png`
                const { error } = await supabase.storage.from('Streamlink').upload(filePath, blob, { upsert: true })

                if (error) {
                    console.error('Erreur upload:', error)
                    return
                }

                const publicUrl = supabase.storage.from('Streamlink').getPublicUrl(filePath).data.publicUrl
                await removeVignette()
                await linkStore.updateLink(linkRef.value.id, { icon_url: publicUrl, custom_icon: true })
            }, 'image/png')
        }
        // Si une icône est choisie
        else if (selectedIcon.value) {
            await linkStore.updateLink(linkRef.value.id, { icon: selectedIcon.value, icon_url: null, custom_icon: true })
            if (linkRef.value.icon_url) {
                const path = linkRef.value.icon_url.split('/Vignette/')[1]
                await supabase.storage.from('Streamlink').remove([`Vignette/${path}`])
            }
        }

        // Reset
        imageUrl.value = null
        croppedImage.value = null
        selectedIcon.value = null
    }

    // Supprimer la vignette
    const removeVignette = async () => {
        if (!linkRef.value) return
        if (linkRef.value.icon_url) {
            const path = linkRef.value.icon_url.split('/Vignette/')[1]
            await supabase.storage.from('Streamlink').remove([`Vignette/${path}`])
        }
        await linkStore.updateLink(linkRef.value.id, { icon_url: null, custom_icon: true })
        imageUrl.value = null
        croppedImage.value = null
        selectedIcon.value = null
    }

    return {
        imageUrl,
        croppedImage,
        selectedIcon,
        availableIcons,
        onFileSelect,
        onCropChange,
        selectIcon,
        saveVignette,
        removeVignette,
        searchIcon,
        filteredIconsByCategory,
    }
}
