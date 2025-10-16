export function useVignetteUploader(linkRef) {
    const supabase = useSupabaseClient()
    const linkStore = useLinkStore()

    const imageUrl = ref(null)
    const croppedImage = ref(null)
    const selectedIcon = ref(null)

    // Liste d'icônes disponibles
    const availableIcons = [
        'simple-icons:twitch',
        'simple-icons:youtube',
        'simple-icons:instagram',
        'simple-icons:twitter',
        'simple-icons:facebook',
        'simple-icons:discord',
        'simple-icons:tiktok',
        'simple-icons:kick',
        'simple-icons:spotify',
        'simple-icons:steam',
        'simple-icons:amazon',
    ]

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

    const selectIcon = (iconName) => {
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
                await linkStore.updateLink(linkRef.value.id, { icon_url: publicUrl, custom_icon: true })
            }, 'image/png')
        }
        // Si une icône est choisie
        else if (selectedIcon.value) {
            await linkStore.updateLink(linkRef.value.id, { icon: selectedIcon.value, icon_url: null, custom_icon: true })
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
        await linkStore.updateLink(linkRef.value.id, { icon_url: null, custom_icon: false })
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
        removeVignette
    }
}
