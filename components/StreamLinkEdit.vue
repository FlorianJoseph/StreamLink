<template>
    <div class="flex flex-col gap-4 min-w-[650px]">
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
        <div class="flex flex-row gap-4 items-center">
            <AvatarUploader />
            <div>
                <div class="flex flex-col" @click="streamerModal = true">
                    <span class="text-lg font-medium hover:underline cursor-pointer">
                        {{ streamer?.username }}
                    </span>
                    <span class="text-sm text-gray-400 hover:underline cursor-pointer line-clamp-1">
                        {{ streamer?.bio || 'Ajouter une description' }}
                    </span>
                </div>
                <Dialog v-model:visible="streamerModal" modal header="Nom et description" :style="{ width: '25rem' }">
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="username">Nom</label>
                            <InputText id="username" v-model="username" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="description">Description</label>
                            <Textarea id="description" v-model="bio" rows="5" cols="30" autoResize />
                        </div>
                        <div class="flex justify-end gap-2">
                            <Button type="button" label="Annuler" severity="secondary"
                                @click="streamerModal = false"></Button>
                            <Button type="button" label="Sauvegarder" severity="contrast" @click="handleSave"></Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
        <!-- Bouton Ajouter un lien -->
        <Button class="w-full" severity="contrast" @click="newlinkModal = true">
            <Icon name="lucide:plus" size="20" />
            <span class="font-medium">Ajouter un lien</span>
        </Button>

        <!-- Aperçu du lien -->
        <!-- <NuxtLink :to="{ path: `/${streamer?.username}` }" target="_blank">
            <Button class="whitespace-nowrap w-full" severity="contrast" variant="outlined">
                <span>Voir mon StreamLink</span>
                <Icon name="lucide:external-link" size="16" />
            </Button>
        </NuxtLink>
        <div class="flex items-center bg-gray-100/10 rounded justify-between pr-4 cursor-pointer" @click="copyText">
            <p ref="linkText" class="m-4">
                streamlink.com/{{ streamer?.username }}
            </p>
            <Tag :severity="copied ? 'success' : 'secondary'" class="transition-all duration-300">
                {{ copied ? 'Copié !' : 'Copier' }}
            </Tag>
        </div> -->

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
                                                <div class="flex mb-2 hover:cursor-pointer w-max">
                                                    <template
                                                        v-if="editing.id === element.id && editing.field === 'title'">
                                                        <input :ref="el => inputRefs[`${element.id}-title`] = el"
                                                            v-model="editing.value" @blur="saveEdit(element)"
                                                            @keyup.enter="saveEdit(element)"
                                                            class="bg-transparent border-none focus:outline-none font-medium" />
                                                    </template>
                                                    <template v-else>
                                                        <div class="flex items-center gap-2"
                                                            @click="editField(element, 'title')">
                                                            <span class="font-medium hover:cursor-pointer">
                                                                {{ element.title }}
                                                            </span>
                                                            <Icon name="lucide:pencil" size="16" />
                                                        </div>
                                                    </template>
                                                </div>
                                                <!-- URL -->
                                                <div class="flex hover:cursor-pointer">
                                                    <template
                                                        v-if="editing.id === element.id && editing.field === 'url'">
                                                        <input :ref="el => inputRefs[`${element.id}-url`] = el"
                                                            v-model="editing.value" @blur="saveEdit(element)"
                                                            @keyup.enter="saveEdit(element)"
                                                            class="bg-transparent border-none focus:outline-none text-sm" />
                                                    </template>
                                                    <template v-else>
                                                        <div class="flex items-center gap-2"
                                                            @click="editField(element, 'url')">
                                                            <span class="text-sm hover:cursor-pointer">
                                                                {{ element.url }}
                                                            </span>
                                                            <Icon name="lucide:pencil" size="16" />
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                            <ToggleSwitch v-model="element.visible" class="mr-1"
                                                style="--p-toggleswitch-checked-background: #ffffff;--p-toggleswitch-checked-hover-background: #f3f4f6;"
                                                @change="() => linkStore.toggleVisibility(element.id, element.visible)" />
                                        </div>
                                        <!-- Actions -->
                                        <div class="flex justify-between items-center">
                                            <div class="text-sm text-gray-400 mt-2 italic hover:cursor-pointer w-max">
                                                <Button severity="secondary" variant="text"
                                                    v-tooltip.bottom="{ value: 'Vignette' }"
                                                    @click="openVignetteModal(element)">
                                                    <Icon name="lucide:image" size="16" />
                                                </Button>

                                                <!-- Modal Icone ou image -->
                                                <Dialog v-model:visible="thumbnailModal" modal
                                                    header="Modifier la vignette" :style="{ width: '25rem' }">

                                                    <div class="flex flex-col gap-4 items-center">

                                                        <!-- Étape 1 : Upload -->
                                                        <div v-if="!imageUrl" class="flex flex-col gap-2">
                                                            <FileUpload mode="basic" @select="onFileSelect" customUpload
                                                                auto chooseLabel="Choisir une image"
                                                                class="p-button-contrast" accept="image/*"
                                                                @click="showIcons = false" />
                                                            <Button severity="contrast" variant="outlined"
                                                                @click="iconModal = true, thumbnailModal = false">
                                                                <Icon name="lucide:layout-grid" size="20px" />
                                                                <span>Choisir une icone</span>
                                                            </Button>
                                                        </div>

                                                        <!-- Étape 2 : Crop -->
                                                        <div v-else class="mt-4 w-full">
                                                            <Cropper :src="imageUrl" :stencil-props="{ aspectRatio: 1 }"
                                                                @change="onCropChange" image-restriction="fit-area" />
                                                            <div class="flex justify-between gap-2 mt-4">
                                                                <Button label="Annuler" severity="secondary"
                                                                    @click="closeModal()" class="mt-2" />
                                                                <Button label="Sauvegarder" severity="contrast"
                                                                    :disabled="!croppedImage" @click="saveImage" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Dialog>

                                                <Dialog v-model:visible="iconModal" modal
                                                    header="Sélectionner une icône" :style="{ width: '25rem' }">
                                                    <div class="flex flex-wrap gap-3 justify-center p-4">
                                                        <div v-for="icon in availableIcons" :key="icon"
                                                            class="p-2 cursor-pointer hover:bg-gray-400/10"
                                                            :class="{ 'border border-gray-500': selectedIcon === icon }"
                                                            @click="selectIcon(icon)">
                                                            <Icon :name="icon" size="24" />
                                                        </div>
                                                        <div class="flex justify-between w-full mt-4">
                                                            <Button label="Retour" severity="secondary"
                                                                @click="iconModal = false, thumbnailModal = true" />
                                                            <Button label="Sauvegarder" severity="contrast"
                                                                :disabled="!selectedIcon" @click="saveImage" />
                                                        </div>
                                                    </div>
                                                </Dialog>

                                            </div>
                                            <Button severity="secondary" variant="text"
                                                v-tooltip.bottom="{ value: 'Supprimer' }"
                                                @click="confirmDeletePopup($event, element.id)">
                                                <Icon name="lucide:trash-2" size="20" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Draggable>

                    <!-- Modal Ajouter / Modifier -->
                    <Dialog v-model:visible="newlinkModal" modal header="Ajouter un lien" :style="{ width: '25rem' }">
                        <div class="flex flex-col gap-4">

                            <div class="flex flex-col gap-2">
                                <label for="title">Titre</label>
                                <InputText id="title" v-model="form.title" placeholder="Ex: Twitch" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="url">URL</label>
                                <InputText id="url" v-model="form.url" placeholder="https://..." />
                            </div>

                            <div class="flex justify-end gap-2">
                                <Button type="button" label="Annuler" severity="secondary" @click="resetForm()" />
                                <Button type="button" label="Sauvegarder" severity="contrast"
                                    :disabled="!form.title || !form.url" @click="saveNewLink()" />
                            </div>
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

watchEffect(() => {
    username.value = streamer?.value?.username || ''
    bio.value = streamer?.value?.bio || ''
})
const handleSave = async () => {
    await streamerStore.updateStreamer({ username: username.value, bio: bio.value })
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

// Copier le lien
const linkText = ref(null)
const copied = ref(false)
const copyText = () => {
    if (linkText.value) navigator.clipboard.writeText(`https://${linkText.value.innerText}`)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
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
    if (field === 'url' && !link.vignette_url) {
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
import { Cropper } from 'vue-advanced-cropper'
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
    availableIcons,
    onFileSelect,
    onCropChange,
    selectIcon,
    saveVignette,
} = useVignetteUploader(currentLinkRef)

const openVignetteModal = (link) => {
    currentLinkRef.value = link
    thumbnailModal.value = true
    showIcons.value = false
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

</script>