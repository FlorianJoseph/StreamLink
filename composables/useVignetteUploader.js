export function useVignetteUploader(linkRef) {
    const supabase = useSupabaseClient()
    const linkStore = useLinkStore()

    const imageUrl = ref(null)
    const croppedImage = ref(null)

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

    // Étape 3 : Sauvegarde sur Supabase
    const saveCroppedImage = async () => {
        if (!croppedImage.value) return
        if (!linkRef?.value?.id) {
            console.error("linkRef ou linkRef.id est manquant !")
            return
        }
        
        // Supprime l’ancienne image si elle existe
        croppedImage.value.toBlob(async (blob) => {
            const oldPath = linkRef.value?.vignette_url
                ? linkRef.value.vignette_url.split('/Vignette/')[1]
                : null

            const filePath = `Vignette/${crypto.randomUUID()}.png`

            const { error } = await supabase.storage
                .from('Streamlink')
                .upload(filePath, blob, { upsert: true })

            if (error) {
                console.error('Erreur upload:', error)
                return
            }

            const publicUrl = supabase.storage
                .from('Streamlink')
                .getPublicUrl(filePath).data.publicUrl

            // Suppression de l’ancienne image
            if (oldPath) {
                await supabase.storage.from('Streamlink').remove([`Vignette/${oldPath}`])
            }

            // Mise à jour du lien
            await linkStore.updateLink(linkRef.value.id, { vignette_url: publicUrl })
        }, 'image/png')
    }

    // Supprimer la vignette
    const removeVignette = async () => {
        if (!linkRef.value?.vignette_url) return

        const oldPath = linkRef.value.vignette_url.split('/Vignette/')[1]
        await supabase.storage.from('Streamlink').remove([`Vignette/${oldPath}`])
        await linkStore.updateLink(linkRef.value.id, { vignette_url: '' })
    }

    return {
        imageUrl,
        croppedImage,
        onFileSelect,
        onCropChange,
        saveCroppedImage,
        removeVignette,
    }
}
