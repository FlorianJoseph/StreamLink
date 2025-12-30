<template>
    <!-- Boutton -->
    <Button variant="outlined" severity="contrast" @click="openModal">
        <Icon name="lucide:pencil" size="18" />
        <span class="text-xs sm:text-base">Modifier l'avatar</span>
    </Button>
    <!-- Modal -->
    <Dialog v-model:visible="visible" dismissableMask modal header="Modifier l’avatar" :style="{ width: '30rem' }">
        <div class="flex flex-col gap-4 items-center">

            <!-- Étape 1 : Upload -->
            <div v-if="!imageUrl" class="flex flex-row gap-2">
                <FileUpload mode="basic" @select="onFileSelect" auto chooseLabel="Choisir une image"
                    class="p-button-contrast" accept="image/*" />
                <Button severity="danger" @click="deleteAvatar" :disabled="!streamer?.avatar_url">
                    <Icon name="lucide:trash-2" size="20px" />
                    <span>Supprimer l’avatar</span>
                </Button>
            </div>

            <!-- Étape 2 : Crop -->
            <div v-else class="w-full max-h-[60vh]">
                <div class="relative w-full flex justify-center items-center overflow-hidden"
                    style="aspect-ratio: 1 / 1">
                    <Cropper :src="imageUrl" :stencil-props="{ aspectRatio: 1 }" @change="onCropChange"
                        image-restriction="fit-area" :stencil-component="CircleStencil"
                        :style="{ width: '100%', height: '100%' }" :default-size="defaultSize" />
                </div>
                <Button label="Sauvegarder" severity="contrast" @click="saveAvatar" :disabled="!croppedImage"
                    class="w-full mt-4" />
            </div>

        </div>
    </Dialog>
</template>

<script setup>
import { Cropper, CircleStencil } from 'vue-advanced-cropper'

const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)


// Modal control
const visible = ref(false)
const openModal = () => {
    visible.value = true
    imageUrl.value = null
}
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

// Cropper
const defaultSize = ({ imageSize, visibleArea }) => {
    return {
        width: (visibleArea || imageSize).width,
        height: (visibleArea || imageSize).height,
    };
};

</script>