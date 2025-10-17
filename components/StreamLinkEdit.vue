<template>
    <div class="flex flex-col gap-4 lg:w-[650px]">
        <!-- En-tête -->
        <div class="py-4">
            <div class="flex items-center flex-col lg:items-start h-12 justify-end">
                <h1 class="text-3xl font-bold">Modifier mon StreamLink</h1>
                <p class="text-center lg:text-left">Créez votre page de liens personnalisée à partager avec
                    votre
                    audience</p>
            </div>
        </div>
        <!-- Avatar et bouton de modification -->
        <div class="flex flex-row gap-4 items-center max-w-[650px]">
            <AvatarUploader />
            <div class="min-w-0">
                <div class="flex flex-col" @click="openStreamerModal()">
                    <span class="text-lg font-medium hover:underline cursor-pointer">
                        {{ streamer?.username }}
                    </span>
                    <span class="block text-sm font-medium text-gray-400 hover:underline cursor-pointer truncate">
                        {{ streamer?.bio || 'Ajouter une description' }}
                    </span>
                </div>
                <Dialog v-model:visible="streamerModal" modal dismissableMask header="Nom et description"
                    :style="{ width: '25rem' }">
                    <div class="flex flex-col gap-4">
                        <!-- Nom -->
                        <div class="flex flex-col gap-2 relative">
                            <label for="username">Nom</label>
                            <InputText id="username" v-model="username" maxlength="30" placeholder="Entrez votre nom"
                                class="w-full" style="--p-inputtext-focus-border-color : #ffffff" />
                            <span class="absolute right-2 bottom-1 text-xs text-gray-500">
                                {{ username.length }}/30
                            </span>
                        </div>
                        <!-- Message d'erreur -->
                        <span v-if="usernameError" class="text-xs text-red-500">
                            {{ usernameError }}
                        </span>
                        <!-- Description -->
                        <div class="flex flex-col gap-2 relative">
                            <label for="description">Description</label>
                            <Textarea id="description" v-model="bio" rows="5" autoResize maxlength="160"
                                placeholder="Écrivez une courte description..." class="w-full"
                                style="--p-textarea-focus-border-color : #ffffff" />
                            <span class="absolute right-2 bottom-1 text-xs text-gray-500">
                                {{ bio.length }}/160
                            </span>
                        </div>
                        <Button type="button" label="Sauvegarder" severity="contrast" @click="handleSave" class="w-full"
                            :disabled="!username || !!usernameError" />
                    </div>
                </Dialog>
            </div>
        </div>

        <!-- Bouton Ajouter un lien -->
        <Button class="w-full" severity="contrast" @click="newlinkModal = true">
            <Icon name="lucide:plus" size="20" />
            <span class="font-medium">Ajouter un lien</span>
        </Button>

        <!-- Gérer les liens -->
        <div class="mb-8">
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-2 w-full ">
                    <!-- Liste des liens -->
                    <div v-if="links.length === 0" class="text-gray-400 text-sm text-center py-4">
                        Aucun lien pour l’instant. Cliquez sur "Ajouter un lien" pour commencer
                    </div>
                    <Draggable v-model="links" item-key="id" handle=".drag-handle" @end="saveOrder"
                        class="flex flex-col gap-2">
                        <template #item="{ element }">
                            <div class="rounded-3xl pt-3 pb-2 px-2 bg-gray-100/10">
                                <div class="flex flex-row gap-4 items-center">
                                    <!-- Drag handle avec icône GripVertical -->
                                    <div class="drag-handle cursor-grab flex-shrink-0">
                                        <Icon name="lucide:grip-vertical" size="20" />
                                    </div>
                                    <div class="flex flex-col flex-grow">
                                        <div class="flex justify-between items-center">
                                            <div class="flex flex-col w-full">
                                                <!-- Titre -->
                                                <template v-if="editing.id === element.id && editing.field === 'title'">
                                                    <input :ref="el => inputRefs[`${element.id}-title`] = el"
                                                        v-model="editing.value" @blur="saveEdit(element)"
                                                        @keyup.enter="saveEdit(element)"
                                                        class="bg-transparent border-none focus:outline-none font-medium w-full mb-2 truncate max-w-[500px]" />
                                                </template>
                                                <template v-else>
                                                    <div class="flex items-center mb-2 gap-2 hover:cursor-pointer w-max"
                                                        @click="editField(element, 'title')">
                                                        <span class="font-medium truncate max-w-[500px]">
                                                            {{ element.title }}
                                                        </span>
                                                        <Icon name="lucide:pencil" size="16" />
                                                    </div>
                                                </template>
                                                <!-- URL -->
                                                <template v-if="editing.id === element.id && editing.field === 'url'">
                                                    <input :ref="el => inputRefs[`${element.id}-url`] = el"
                                                        v-model="editing.value" @blur="saveEdit(element)"
                                                        @keyup.enter="saveEdit(element)"
                                                        class="bg-transparent border-none focus:outline-none text-sm w-full truncate max-w-[500px]" />
                                                </template>
                                                <template v-else>
                                                    <div class="flex items-center gap-2 hover:cursor-pointer w-max"
                                                        @click="editField(element, 'url')">
                                                        <span class="text-sm truncate max-w-[500px]">
                                                            {{ element.url }}
                                                        </span>
                                                        <Icon name="lucide:pencil" size="16" />
                                                    </div>
                                                </template>
                                            </div>
                                            <div>
                                                <ToggleSwitch v-model="element.visible" class="mr-1"
                                                    style="--p-toggleswitch-checked-background: #ffffff;--p-toggleswitch-checked-hover-background: #f3f4f6;"
                                                    @change="() => linkStore.toggleVisibility(element.id, element.visible)" />
                                            </div>
                                        </div>
                                        <!-- Actions -->
                                        <div class="flex justify-between items-center">
                                            <div class="mt-2 hover:cursor-pointer w-max">
                                                <Button severity="secondary"
                                                    v-tooltip.bottom="{ value: 'Modifier l\'icone' }"
                                                    @click="openVignetteModal(element)">
                                                    <Icon name="lucide:image" size="16" />
                                                </Button>
                                            </div>
                                            <Button severity="secondary" v-tooltip.bottom="{ value: 'Supprimer' }"
                                                @click="confirmDeletePopup($event, element.id)">
                                                <Icon name="lucide:trash-2" size="20" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Draggable>

                    <!-- Modal Icone ou image -->
                    <Dialog v-model:visible="thumbnailModal" dismissableMask modal header="Modifier l'icone"
                        :style="{ width: '30rem' }">
                        <Stepper value="1">
                            <StepPanels>
                                <StepPanel v-slot="{ activateCallback }" value="1">
                                    <div class="flex flex-col gap-4 items-center">
                                        <!-- Étape 1 : Upload -->
                                        <div v-if="!imageUrl" class="flex flex-col gap-2">
                                            <div class="flex flex-row gap-2">
                                                <FileUpload mode="basic" @select="onFileSelect" auto
                                                    chooseLabel="Choisir une image" class="p-button-contrast"
                                                    accept="image/*" @click="showIcons = false" />
                                                <Button severity="contrast" variant="outlined"
                                                    @click="activateCallback('2')">
                                                    <Icon name="lucide:layout-grid" size="20px" />
                                                    <span>Choisir une icone</span>
                                                </Button>
                                            </div>
                                            <Button severity="danger" @click="deleteIcon"
                                                :disabled="!currentLinkRef.icon_url">
                                                <Icon name="lucide:trash-2" size="20px" />
                                                <span>Supprimer l'icone</span>
                                            </Button>
                                        </div>
                                        <!-- Étape 2 : Crop -->
                                        <div v-else class="w-full max-h-[60vh]">
                                            <div class="relative w-full flex justify-center items-center overflow-hidden"
                                                style="aspect-ratio: 1 / 1">
                                                <Cropper :src="imageUrl" :stencil-props="{ aspectRatio: 1 }"
                                                    @change="onCropChange" image-restriction="fit-area"
                                                    :stencil-component="CircleStencil"
                                                    :style="{ width: '100%', height: '100%' }"
                                                    :default-size="defaultSize" />
                                            </div>
                                            <div class="flex flex-col w-full mt-4 gap-2">
                                                <Button label="Sauvegarder" severity="contrast" @click="saveImage"
                                                    :disabled="!croppedImage" />
                                                <Button label="Retour" severity="secondary"
                                                    @click="imageUrl = null, croppedImage = null" />
                                            </div>
                                        </div>
                                    </div>
                                </StepPanel>
                                <StepPanel v-slot="{ activateCallback }" value="2">
                                    <div class="flex flex-col h-full gap-4">
                                        <!-- Barre de recherche -->
                                        <div class="mb-2 relative">
                                            <IconField>
                                                <InputIcon>
                                                    <Icon name="lucide:search" />
                                                </InputIcon>
                                                <InputText v-model="searchIcon" placeholder="Rechercher une icône..."
                                                    class="w-full" />
                                            </IconField>
                                        </div>
                                        <!-- Liste des icônes filtrées -->
                                        <div class="flex flex-wrap gap-6 overflow-y-auto h-[35vh]">
                                            <div v-for="(icons, category) in filteredIconsByCategory" :key="category"
                                                class="flex flex-col gap-3">
                                                <!-- Titre de la catégorie -->
                                                <h3 class="text-lg font-semibold text-left">
                                                    {{ category }}
                                                </h3>

                                                <!-- Icônes -->
                                                <div class="flex flex-wrap gap-3 justify-start p-2">
                                                    <div v-for="icon in icons" :key="icon" class="flex justify-center items-center p-8
                                                         cursor-pointer hover:bg-gray-400/10 rounded-md transition"
                                                        :class="selectedIcon === icon ? 'outline outline-2 border-gray-500' : ''"
                                                        @click="selectIcon(icon)">
                                                        <Icon :name="icon" size="24" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col justify-between w-full mt-4 gap-2">
                                        <Button label="Sauvegarder" severity="contrast" :disabled="!selectedIcon"
                                            @click="saveImage" />
                                        <Button label="Retour" severity="secondary" @click="activateCallback('1')" />
                                    </div>
                                </StepPanel>
                            </StepPanels>
                        </Stepper>
                    </Dialog>

                    <!-- Modal Ajouter / Modifier -->
                    <Dialog v-model:visible="newlinkModal" dismissableMask modal header="Ajouter un lien"
                        :style="{ width: '25rem' }">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label for="title">Titre</label>
                                <InputText id="title" v-model="form.title" placeholder="Ex: Twitch"
                                    style="--p-inputtext-focus-border-color : #ffffff" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="url">URL</label>
                                <InputText id="url" v-model="form.url" placeholder="https://..."
                                    style="--p-inputtext-focus-border-color : #ffffff" />
                            </div>
                            <Button type="button" label="Sauvegarder" severity="contrast"
                                :disabled="!form.title || !form.url" @click="saveNewLink()" class="w-full" />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Draggable from 'vuedraggable'

// Stores
const linkStore = useLinkStore()
const { links } = storeToRefs(linkStore)
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)

// Actions de modification du Streamer
const streamerModal = ref(false)
const username = ref('')
const bio = ref('')
const usernameError = ref('')

watchEffect(() => {
    username.value = streamer?.value?.username || ''
    bio.value = streamer?.value?.bio || ''
})

watch(username, () => {
    usernameError.value = ''
})

const openStreamerModal = async () => {
    username.value = streamer?.value?.username
    streamerModal.value = true;
}

const handleSave = async () => {
    const { data, error } = await streamerStore.updateStreamer({
        username: username.value,
        bio: bio.value
    })
    // Gestion de l'erreur
    if (error) {
        if (error.code === '23505') {
            // Conflit unique Postgres
            usernameError.value = 'Ce pseudo est déjà utilisé !'
        } else {
            usernameError.value = error.message
        }
        return
    }

    usernameError.value = ''
    streamerModal.value = false;
};

// Draggable
const localLinks = ref([])
watchEffect(() => {
    localLinks.value = [...links.value]
})
const saveOrder = async () => {
    await linkStore.updateOrder(localLinks.value)
}

// Actions de modification du lien
const newlinkModal = ref(false);
const form = reactive({ title: '', url: '', icon: 'link' })
const newLink = ref(null)
const inputRefs = ref({})
const { getDefaultIcon } = useLinkIcon()

const saveNewLink = async () => {
    const icon = getDefaultIcon(form.url)
    const maxOrder = links.value.length ? Math.max(...links.value.map(l => l.order || 0)) : 0
    const newLink = await linkStore.addLink({ title: form.title, url: form.url, icon, order: maxOrder + 1 })
    localLinks.value.push(newLink.data)
    resetForm()
}

const editing = ref({
    id: null,
    field: null,
    value: ''
})

const editField = (link, field) => {
    editing.value.id = link.id
    editing.value.field = field
    editing.value.value = link[field]

    nextTick(() => {
        const key = `${link.id}-${field}`
        if (inputRefs.value[key]) {
            inputRefs.value[key].focus()
        }
    })
}

const saveEdit = async (link) => {
    if (!editing.value.id || !editing.value.field) return

    const field = editing.value.field
    const newValue = editing.value.value

    let icon = link.icon
    if (field === 'url' && !link.icon_url && link.custom_icon === false) {
        icon = getDefaultIcon(newValue)
    }

    if (newValue !== link[field] || icon !== link.icon) {
        await linkStore.updateLink(link.id, {
            [field]: newValue,
            icon
        })

        link[field] = newValue
        link.icon = icon
    }

    editing.value = { id: null, field: null, value: '' }
}

const resetForm = () => {
    form.title = ''
    form.url = ''
    form.icon = 'link'
    newLink.value = null
    newlinkModal.value = false
}

const confirm = useConfirm();
const confirmDeletePopup = (event, id) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Êtes vous sûr de vouloir supprimer ce lien ?',
        rejectProps: {
            label: 'Annuler',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Supprimer',
            severity: 'danger'
        },
        accept: async () => {
            linkStore.deleteLink(id)
        },
        reject: () => {
        }
    });
};

// Changer l'icone
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

const thumbnailModal = ref(false);
const iconModal = ref(false)
const currentLinkRef = ref(null)
const showIcons = ref(false)

// Composable VignetteUploader
const {
    imageUrl,
    croppedImage,
    selectedIcon,
    onFileSelect,
    onCropChange,
    selectIcon,
    saveVignette,
    searchIcon,
    filteredIconsByCategory,
    removeVignette
} = useVignetteUploader(currentLinkRef)

const openVignetteModal = (link) => {
    currentLinkRef.value = link
    thumbnailModal.value = true
    showIcons.value = false
    imageUrl.value = null
}

const closeModal = () => {
    thumbnailModal.value = false
    imageUrl.value = null
    croppedImage.value = null
    iconModal.value = false
}

const saveImage = async () => {
    await saveVignette()
    closeModal()
}

const deleteIcon = async () => {
    await removeVignette()
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