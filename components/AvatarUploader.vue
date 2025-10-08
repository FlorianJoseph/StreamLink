<template>
    <img :src="previewUrl || streamer?.avatar_url || defaultAvatar" alt="Avatar"
        class="w-16 h-16 rounded-full object-cover flex-shrink-0 hover:cursor-pointer hover:opacity-75 transition-opacity duration-200" @click="openModal" />
    <Dialog v-model:visible="visible" modal header="Changer l’avatar" :style="{ width: '30rem' }">
        <div class="flex flex-col gap-4 items-center">

            <!-- Étape 1 : Upload -->
            <div v-if="!imageUrl" class="flex flex-row gap-2">
                <FileUpload mode="basic" @select="onFileSelect" customUpload auto chooseLabel="Choisir une image"
                    class="p-button-contrast" accept="image/*" />
                <Button label="Supprimer l’avatar" severity="danger" />
            </div>

            <!-- Étape 2 : Crop -->
            <div v-else class="mt-4 w-full">
                <Cropper :src="imageUrl" :stencil-props="{ aspectRatio: 1 }" @change="onCropChange"
                    image-restriction="fit-area" />
                <div class="flex justify-between gap-2 mt-4">
                    <Button label="Annuler" severity="secondary" @click="closeModal" />
                    <Button label="Sauvegarder" severity="contrast" @click="saveCroppedImage"
                        :disabled="!croppedImage" />
                </div>
            </div>

        </div>
    </Dialog>
</template>

<script setup>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/sign/Streamlink/Avatar/default.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NDMzZjlmNi01NGMzLTQxNzQtYmY0ZC01YzVjZDliNmI2MjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTdHJlYW1saW5rL0F2YXRhci9kZWZhdWx0LnBuZyIsImlhdCI6MTc1OTc0NTEzMCwiZXhwIjoyMDc1MTA1MTMwfQ.IppJUbOxBC5Nihi0dUVSS_bNYmdvWEi5VzzRl5xyAng"

const supabase = useSupabaseClient()
const { streamer, updateStreamer } = useStreamer();

const visible = ref(false)
const imageUrl = ref(null)
const previewUrl = ref(null)
const croppedImage = ref(null)

const openModal = () => (visible.value = true)
const closeModal = () => {
    visible.value = false
    imageUrl.value = null
    previewUrl.value = null
}

const onFileSelect = (event) => {
    const file = event.files?.[0]
    if (file) imageUrl.value = URL.createObjectURL(file)
}

const onCropChange = ({ canvas }) => {
    if (canvas) croppedImage.value = canvas
}

const saveCroppedImage = async () => {
    if (!croppedImage.value) return

    croppedImage.value.toBlob(async (blob) => {
        const oldAvatarPath = streamer.value.avatar_url
            ? streamer.value.avatar_url.split('/Avatar/')[1] // récupère le path après /Avatar/
            : null

        const filePath = `Avatar/${crypto.randomUUID()}.png`

        // Upload le nouveau
        const { data, error } = await supabase.storage
            .from('Streamlink')
            .upload(filePath, blob, { upsert: true })

        if (!error) {
            const publicUrl = supabase.storage
                .from('Streamlink')
                .getPublicUrl(filePath).data.publicUrl

            // Supprime l'ancien fichier si il existe
            if (oldAvatarPath) {
                await supabase.storage.from('Streamlink').remove([`Avatar/${oldAvatarPath}`])
            }

            // Met à jour le streamer
            await updateStreamer({ avatar_url: publicUrl })
            closeModal()
        }
    })
}
</script>