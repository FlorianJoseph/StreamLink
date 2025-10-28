export function useAvatarUploader(streamer) {
    const supabase = useSupabaseClient()
    const streamerStore = useStreamerStore()

    const imageUrl = ref(null)
    const previewUrl = ref(null)
    const croppedImage = ref(null)

    const defaultAvatar = "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png"

    const onFileSelect = (event) => {
        const file = event.files?.[0]
        if (!file) return
        const localUrl = URL.createObjectURL(file)
        imageUrl.value = localUrl
    }

    const onCropChange = ({ canvas }) => {
        if (canvas) croppedImage.value = canvas
    }

    const saveCroppedImage = async () => {
        if (!croppedImage.value) return

        croppedImage.value.toBlob(async (blob) => {
            const filePath = `Avatar/${crypto.randomUUID()}.png`

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

            await removeAvatar()

            await streamerStore.updateStreamer({ avatar_url: publicUrl })
            previewUrl.value = publicUrl
        }, 'image/png')
    }

    // Supprimer l'avatar actuel
    const removeAvatar = async () => {
        if (!streamer.value?.avatar_url) return

        const oldAvatarPath = streamer.value.avatar_url.split('/Avatar/')[1]
        await supabase.storage.from('Streamlink').remove([`Avatar/${oldAvatarPath}`])
        await streamerStore.updateStreamer({ avatar_url: '' })
        previewUrl.value = defaultAvatar
    }

    return {
        defaultAvatar,
        imageUrl,
        previewUrl,
        croppedImage,
        onFileSelect,
        onCropChange,
        saveCroppedImage,
        removeAvatar
    }
}
