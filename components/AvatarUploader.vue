<template>
    <!-- Avatar avec preview -->
    <img :src="previewUrl || streamer?.avatar_url || defaultAvatar" alt="Avatar"
        class="w-16 h-16 rounded-full object-cover shrink-0 hover:cursor-pointer hover:opacity-75 transition-opacity"
        @click="openModal" />

    <!-- Modal -->
    <Dialog v-model:visible="visible" dismissableMask modal :draggable="false"
        :style="{ width: '30rem', margin: '1rem' }"
        :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
        <template #container>
            <div class="flex flex-col gap-5 p-5 rounded-xl border border-white/8 bg-dark">

                <!-- Header -->
                <div class="flex items-center justify-between">
                    <h2 class="font-heading text-xl font-bold text-white">Modifier l'avatar</h2>
                    <button @click="closeModal"
                        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/8 text-muted hover:text-white transition-colors">
                        <Icon name="lucide:x" size="22" />
                    </button>
                </div>

                <!-- Étape 1 : Upload -->
                <div v-if="!imageUrl" class="flex flex-col gap-2">
                    <FileUpload mode="basic" @select="onFileSelect" auto chooseLabel="Choisir une image"
                        class="p-button-contrast w-full" accept="image/*" />
                    <button @click="deleteAvatar" :disabled="!streamer?.avatar_url"
                        class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-400 text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none">
                        <Icon name="lucide:trash-2" size="16" class="shrink-0" />
                        Supprimer l'avatar
                    </button>
                </div>

                <!-- Étape 2 : Crop -->
                <div v-else class="w-full max-h-[60vh]">
                    <div class="relative w-full flex justify-center items-center overflow-hidden"
                        style="aspect-ratio: 1 / 1">
                        <Cropper :src="imageUrl" :stencil-props="{ aspectRatio: 1 }" @change="onCropChange"
                            image-restriction="fit-area" :stencil-component="CircleStencil"
                            :style="{ width: '100%', height: '100%' }" :default-size="defaultSize" />
                    </div>
                    <button @click="saveAvatar" :disabled="!croppedImage"
                        class="flex items-center justify-center gap-2 w-full mt-4 px-4 py-2.5 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <Icon name="lucide:check" size="16" class="shrink-0" />
                        Enregistrer
                    </button>
                </div>
            </div>
        </template>
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