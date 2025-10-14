<template>
    <!-- Avatar avec preview -->
    <img :src="previewUrl || streamer?.avatar_url || defaultAvatar" alt="Avatar"
        class="w-16 h-16 rounded-full object-cover flex-shrink-0 hover:cursor-pointer hover:opacity-75 transition-opacity duration-200"
        @click="openModal" />

    <!-- Modal -->
    <Dialog v-model:visible="visible" modal header="Changer l’avatar" :style="{ width: '30rem' }">
        <div class="flex flex-col gap-4 items-center">

            <!-- Étape 1 : Upload -->
            <div v-if="!imageUrl" class="flex flex-row gap-2">
                <FileUpload mode="basic" @select="onFileSelect" customUpload auto chooseLabel="Choisir une image"
                    class="p-button-contrast" accept="image/*" />
                <Button label="Supprimer l’avatar" severity="danger" @click="deleteAvatar"
                    :disabled="!streamer?.avatar_url" />
            </div>

            <!-- Étape 2 : Crop -->
            <div v-else class="mt-4 w-full">
                <Cropper :src="imageUrl" :stencil-props="{ aspectRatio: 1 }" @change="onCropChange"
                    image-restriction="fit-area" />
                <div class="flex justify-between gap-2 mt-4">
                    <Button label="Annuler" severity="secondary" @click="closeModal" />
                    <Button label="Sauvegarder" severity="contrast" @click="saveAvatar" :disabled="!croppedImage" />
                </div>
            </div>

        </div>
    </Dialog>
</template>

<script setup>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)


// Modal control
const visible = ref(false)
const openModal = () => (visible.value = true)
const closeModal = () => {
    visible.value = false
    imageUrl.value = null
    previewUrl.value = null
}

// Composable AvatarUploader
const {
    defaultAvatar,
    imageUrl,
    previewUrl,
    croppedImage,
    onFileSelect,
    onCropChange,
    saveCroppedImage,
    removeAvatar
} = useAvatarUploader(streamer)

const saveAvatar = async () => {
    await saveCroppedImage()
    closeModal()
}

const deleteAvatar = async () => {
    await removeAvatar()
    closeModal()
}

</script>