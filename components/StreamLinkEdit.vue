<template>
    <div class="flex flex-col gap-4">
        <!-- En-tête -->
        <div class="py-4">
            <div class="flex flex-col lg:items-start items-center justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                    Modifier ma page de liens
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center lg:text-left max-w-xl">
                    Crée ta page de liens personnalisée à partager avec ton audience
                </p>
            </div>
        </div>
        <!-- Avatar et bouton de modification -->
        <div class="flex flex-row gap-4 items-center max-w-2xl lg:w-lg xl:w-2xl">
            <AvatarUploader />
            <div class="min-w-0">
                <div class="flex flex-col" @click="openStreamerModal()">
                    <div class="flex items-center gap-2">
                        <span class="font-medium hover:underline cursor-pointer">
                            {{ streamer?.username }}
                        </span>
                        <img v-if="streamer?.language && streamer.language !== 'OTHER'"
                            :src="`https://flagcdn.com/w80/${getFlag(streamer.language)}.png`"
                            class="w-4 h-[12px] object-cover rounded-xs shadow-sm hover:cursor-pointer" />
                        <span v-else-if="streamer?.language === 'OTHER'" class="flex items-center">
                            <Icon name="lucide:globe" size="16" />
                        </span>
                        <span v-else class="text-xs text-gray-400 hover:underline cursor-pointer">
                            Choisir une langue
                        </span>
                    </div>
                    <span class="block text-sm font-medium text-gray-400 hover:underline cursor-pointer truncate">
                        {{ streamer?.bio || 'Ajouter une description' }}
                    </span>
                </div>
                <Dialog v-model:visible="streamerModal" modal dismissableMask header="Modifier le profil"
                    :style="{ width: '25rem', margin: '1rem' }" :draggable="false">
                    <div class="flex flex-col space-y-5 mb-2">

                        <!-- Nom -->
                        <div class="flex flex-col gap-2 relative">
                            <label for="username" class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                                <Icon name="lucide:user" size="16" class="shrink-0" />
                                Nom
                                <span class="text-red-500">*</span>
                            </label>
                            <InputText id="username" v-model="username" maxlength="30"
                                placeholder="Entre ton pseudo de streamer" fluid
                                style="--p-inputtext-focus-border-color : #ffffff" />
                            <span class="absolute right-2 bottom-1 text-xs text-zinc-500">
                                {{ username.length }}/30
                            </span>
                        </div>

                        <!-- Message d'erreur -->
                        <span v-if="usernameError" class="text-xs text-red-500">
                            {{ usernameError }}
                        </span>

                        <!-- Description -->
                        <div class="flex flex-col gap-2 relative">
                            <label for="description" class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                                <Icon name="lucide:align-left" size="16" class="shrink-0" />
                                Description
                            </label>
                            <Textarea id="description" v-model="bio" rows="4" autoResize maxlength="120"
                                placeholder="Écris une courte description" fluid
                                style="--p-textarea-focus-border-color : #ffffff" />
                            <span class="absolute right-2 bottom-1 text-xs text-zinc-500">
                                {{ bio.length }}/120
                            </span>
                        </div>

                        <!-- Langue de streaming -->
                        <div class="flex flex-col gap-2">
                            <label for="language" class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                                <Icon name="lucide:globe" size="16" class="shrink-0" />
                                Langue
                            </label>
                            <Select id="language" v-model="language" :options="languageOptions" optionLabel="label"
                                optionValue="value" placeholder="Sélectionne une langue" showClear
                                :highlightOnSelect="false" fluid style="--p-select-focus-border-color: #ffffff" :pt="{
                                    pcFilter: {
                                        root: {
                                            style: '--p-inputtext-focus-border-color: #ffffff'
                                        },
                                    }
                                }">
                                <template #option="{ option }">
                                    <div class="flex items-center gap-2">
                                        <img v-if="option.value !== 'OTHER'"
                                            :src="`https://flagcdn.com/w80/${option.flag}.png`"
                                            class="h-[15px] w-5 object-cover rounded-xs shadow-sm" />
                                        <Icon v-else name="lucide:globe" size="16" />
                                        <span>{{ option.label }}</span>
                                    </div>
                                </template>
                                <template #value="{ value }">
                                    <div v-if="value" class="flex items-center gap-2">
                                        <img v-if="value !== 'OTHER'"
                                            :src="`https://flagcdn.com/w80/${getFlag(value)}.png`"
                                            class="h-[15px] w-5 object-cover rounded-xs shadow-sm" />
                                        <Icon v-else name="lucide:globe" size="16" />
                                        <span>{{ getLabel(value) }}</span>
                                    </div>
                                </template>
                            </Select>
                        </div>
                    </div>
                    <template #footer>
                        <div class="flex gap-2 w-full">
                            <Button type="button" label="Annuler" severity="secondary" outlined
                                @click="streamerModal = false" class="flex-1">
                                <Icon name="lucide:x" size="18" class="shrink-0" />
                                <span class="text-xs sm:text-base shrink-0">Annuler</span>
                            </Button>
                            <Button type="button" label="Mettre à jour" severity="contrast" @click="handleSave"
                                :disabled="!username || !!usernameError" class="flex-1">
                                <Icon name="lucide:check" size="18" class="shrink-0" />
                                <span class="text-xs sm:text-base shrink-0">Mettre à jour</span>
                            </Button>
                        </div>
                    </template>
                </Dialog>
            </div>
        </div>

        <!-- Stats rapides -->
        <template v-if="statsPending">
            <div class="animate-pulse h-4 w-24 bg-gray-700 rounded" />
        </template>
        <template v-else>
            <div class="flex items-center gap-3 text-sm text-gray-400">
                <div class="flex items-center gap-1.5">
                    <Icon name="lucide:eye" size="16" />
                    <span>{{ stats?.total?.views ?? 0 }} vues</span>
                </div>
                <span>•</span>
                <div class="flex items-center gap-1.5">
                    <Icon name="lucide:mouse-pointer-click" size="16" />
                    <span>{{ stats?.total?.clicks ?? 0 }} clics</span>
                </div>
            </div>
        </template>

        <!-- Bouton Ajouter un lien -->
        <Button class="w-full" severity="contrast" @click="newlinkModal = true">
            <Icon name="lucide:plus" size="20" />
            <span class="font-medium">Ajouter un lien</span>
        </Button>

        <!-- Gérer les liens -->
        <div>
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
                                    <div class="flex flex-col flex-grow min-w-0 px-3.5 py-2">
                                        <div class="flex justify-between items-center">
                                            <div class="flex flex-col flex-grow min-w-0">
                                                <!-- Titre -->
                                                <template v-if="editing.id === element.id && editing.field === 'title'">
                                                    <input :ref="el => inputRefs[`${element.id}-title`] = el"
                                                        v-model="editing.value" @blur="saveEdit(element)"
                                                        @keyup.enter="saveEdit(element)"
                                                        class="bg-transparent border-none focus:outline-none font-medium w-full mb-2 truncate" />
                                                </template>
                                                <template v-else>
                                                    <div class="flex items-center mb-2 gap-2 hover:cursor-pointer w-full min-w-0"
                                                        @click="editField(element, 'title')">
                                                        <span class="font-medium truncate max-w-[70%]">
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
                                                        class="bg-transparent border-none focus:outline-none text-sm w-full truncate" />
                                                </template>
                                                <template v-else>
                                                    <div class="flex items-center gap-2 hover:cursor-pointer w-full min-w-0"
                                                        @click="editField(element, 'url')">
                                                        <span class="text-sm truncate max-w-[70%]">
                                                            {{ element.url }}
                                                        </span>
                                                        <Icon name="lucide:pencil" size="16" />
                                                    </div>
                                                </template>
                                            </div>
                                            <div>
                                                <ToggleSwitch v-model="element.visible" class="flex-shrink-0 mr-1"
                                                    style="--p-toggleswitch-checked-background: #ffffff;--p-toggleswitch-checked-hover-background: #f3f4f6;"
                                                    @change="() => linkStore.toggleVisibility(element.id, element.visible)" />
                                            </div>
                                        </div>
                                        <!-- Actions -->
                                        <div class="flex justify-between items-center">
                                            <div class="mt-2 hover:cursor-pointer w-max flex items-center">
                                                <Button severity="secondary" size="small"
                                                    v-tooltip.bottom="{ value: 'Modifier l\'icone du lien', pt: { text: '!text-sm' } }"
                                                    @click="openVignetteModal(element)">
                                                    <Icon name="lucide:image" size="18"
                                                        class="shrink-0 text-gray-300/60" />
                                                </Button>
                                                <Button severity="secondary" text size="small"
                                                    v-tooltip.bottom="{ value: 'Nombre de clics', pt: { text: '!text-sm' } }">
                                                    <Icon name="lucide:mouse-pointer-click" size="18"
                                                        class="shrink-0 text-gray-300/60" />
                                                    <span class="text-sm text-gray-300/60">
                                                        <template v-if="statsPending">-</template>
                                                        <template v-else>
                                                            {{stats?.links?.findLast(l => l.link_id ===
                                                                element.id)?.total_clicks ?? 0}} clics
                                                        </template>
                                                    </span>
                                                </Button>
                                            </div>
                                            <Button severity="secondary" size="small"
                                                v-tooltip.bottom="{ value: 'Supprimer', pt: { text: '!text-sm' } }"
                                                @click="confirmDeletePopup($event, element.id)">
                                                <Icon name="lucide:trash-2" size="18"
                                                    class="shrink-0 text-gray-300/60" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Draggable>

                    <Divider v-if="links.length > 0" class="my-4" />

                    <div class="rounded-md p-4 bg-gray-100/10">
                        <!-- Bloc branding -->
                        <div v-if="!hasFeature('no_branding')"
                            class="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center justify-between">
                            <div class="flex flex-col sm:gap-0.5">
                                <span class="text-sm font-semibold">Masquer le footer</span>
                                <span class="text-xs text-zinc-400">
                                    <template v-if="hasFeature('no_branding')">
                                        {{ getExpiryLabel('no_branding') }}
                                    </template>
                                    <template v-else>
                                        Masque le footer de ta page de liens
                                    </template>
                                </span>
                            </div>
                            <Button v-if="!hasFeature('no_branding')" severity="contrast" size="small"
                                @click="brandingModal = true">
                                <Icon name="lucide:coins" size="16" class="shrink-0" />
                                <span class="text-sm">Débloquer</span>
                            </Button>
                        </div>
                        <div v-else class="flex gap-2 items-center justify-between">
                            <div class="flex flex-col">
                                <span class="text-sm font-semibold">Masquer le footer</span>
                                <span class="text-xs text-zinc-400">
                                    <template v-if="hasFeature('no_branding')">
                                        {{ getExpiryLabel('no_branding') }}
                                    </template>
                                    <template v-else>
                                        Masque le footer de ta page de liens
                                    </template>
                                </span>
                            </div>
                            <span v-if="isSub" class="text-sm text-gray-400  font-semibold">Inclus dans
                                l'abonnement</span>
                            <span v-else class="text-sm text-emerald-400">{{ getExpiryLabel('no_branding') }}</span>
                        </div>

                        <!-- Modal déblocage branding -->
                        <FeatureUnlockModal v-model="brandingModal" featureKey="no_branding" />
                    </div>

                    <!-- Modal Icone ou image -->
                    <Dialog v-model:visible="thumbnailModal" dismissableMask modal header="Modifier l'icone du lien"
                        :style="{ width: '30rem', margin: '1rem' }" :draggable="false">
                        <Stepper value="1">
                            <StepPanels>
                                <StepPanel v-slot="{ activateCallback }" value="1">
                                    <div class="flex flex-col space-y-5 mb-2">
                                        <!-- Étape 1 : Upload -->
                                        <div v-if="!imageUrl" class="flex flex-col gap-3">
                                            <div class="flex flex-row gap-2">
                                                <FileUpload mode="basic" @select="onFileSelect" auto
                                                    chooseLabel="Choisir une image" class="p-button-contrast flex-1"
                                                    accept="image/*" @click="showIcons = false" />
                                                <Button severity="contrast" variant="outlined" class="flex-1"
                                                    @click="activateCallback('2')">
                                                    <Icon name="lucide:layout-grid" size="18" class="shrink-0" />
                                                    <span class="text-xs sm:text-base">Choisir une icône</span>
                                                </Button>
                                            </div>
                                            <Button severity="danger" @click="deleteIcon"
                                                :disabled="!currentLinkRef.icon_url">
                                                <Icon name="lucide:trash-2" size="18" class="shrink-0" />
                                                <span class="text-xs sm:text-base">Supprimer l'icône</span>
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
                                            <div class="flex w-full mt-4 gap-2">
                                                <Button severity="secondary" outlined
                                                    @click="imageUrl = null, croppedImage = null" class="flex-1">
                                                    <Icon name="lucide:arrow-left" size="18" class="shrink-0" />
                                                    <span class="text-xs sm:text-base">Retour</span>
                                                </Button>
                                                <Button severity="contrast" :disabled="!croppedImage" @click="saveImage"
                                                    class="flex-1">
                                                    <Icon name="lucide:check" size="18" class="shrink-0" />
                                                    <span class="text-xs sm:text-base">Mettre à jour</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </StepPanel>
                                <StepPanel v-slot="{ activateCallback }" value="2">
                                    <div class="flex flex-col space-y-5 mb-2">
                                        <!-- Barre de recherche -->
                                        <IconField>
                                            <InputIcon>
                                                <Icon name="lucide:search" size="16" />
                                            </InputIcon>
                                            <InputText v-model="searchIcon" placeholder="Rechercher une icône..." fluid
                                                style="--p-inputtext-focus-border-color: #ffffff" />
                                        </IconField>
                                        <!-- Liste des icônes filtrées -->
                                        <div class="flex flex-wrap gap-6 overflow-y-auto h-[35vh]">
                                            <div v-for="(icons, category) in filteredIconsByCategory" :key="category"
                                                class="flex flex-col gap-3">
                                                <!-- Titre de la catégorie -->
                                                <h3 class="font-semibold text-xs sm:text-sm text-left">
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
                                    <div class="flex gap-2 w-full mt-4">
                                        <Button severity="secondary" outlined @click="activateCallback('1')"
                                            class="flex-1">
                                            <Icon name="lucide:arrow-left" size="18" class="shrink-0" />
                                            <span class="text-xs sm:text-base">Retour</span>
                                        </Button>
                                        <Button severity="contrast" :disabled="!selectedIcon" @click="saveImage"
                                            class="flex-1">
                                            <Icon name="lucide:check" size="18" class="shrink-0" />
                                            <span class="text-xs sm:text-base">Mettre à jour</span>
                                        </Button>
                                    </div>
                                </StepPanel>
                            </StepPanels>
                        </Stepper>
                    </Dialog>

                    <!-- Modal Ajouter / Modifier -->
                    <Dialog v-model:visible="newlinkModal" dismissableMask modal header="Ajouter un lien"
                        :style="{ width: '25rem', margin: '1rem' }" :draggable="false">
                        <div class="flex flex-col space-y-5 mb-2">

                            <!-- Titre -->
                            <div class="flex flex-col gap-2">
                                <label for="title" class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                                    <Icon name="lucide:type" size="16" class="shrink-0" />
                                    Titre
                                    <span class="text-red-500">*</span>
                                </label>
                                <InputText id="title" v-model="form.title" placeholder="Ex: Twitch, TikTok, Discord..."
                                    fluid style="--p-inputtext-focus-border-color : #ffffff" />
                            </div>

                            <!-- URL -->
                            <div class="flex flex-col gap-2">
                                <label for="url" class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                                    <Icon name="lucide:link" size="16" class="shrink-0" />
                                    URL
                                    <span class="text-red-500">*</span>
                                </label>
                                <InputText id="url" v-model="form.url" placeholder="https://..." fluid
                                    style="--p-inputtext-focus-border-color : #ffffff" />
                            </div>
                        </div>
                        <template #footer>
                            <div class="flex gap-2 w-full">
                                <Button type="button" severity="secondary" outlined @click="newlinkModal = false"
                                    class="flex-1">
                                    <Icon name="lucide:x" size="18" class="shrink-0" />
                                    <span class="text-xs sm:text-base shrink-0">Annuler</span>
                                </Button>
                                <Button type="button" label="Sauvegarder" severity="contrast"
                                    :disabled="!form.title || !form.url" @click="saveNewLink()" class="flex-1">
                                    <Icon name="lucide:save" size="18" class="shrink-0" />
                                    <span class="text-xs sm:text-base shrink-0">Enregistrer</span>
                                </Button>
                            </div>
                        </template>
                    </Dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const { data: stats, pending: statsPending } = useFetch('/api/trackingStats/stats')

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
const language = ref(streamer?.value?.language ?? null)

// Initialisation des champs du modal avec les données du streamer
watchEffect(() => {
    username.value = streamer?.value?.username || ''
    bio.value = streamer?.value?.bio || ''
    language.value = streamer?.value?.language || null
})

watch(username, () => {
    usernameError.value = ''
})

const openStreamerModal = async () => {
    username.value = streamer?.value?.username
    language.value = streamer?.value?.language ?? null
    streamerModal.value = true;
}

// Sauvegarder les modifications du streamer
const handleSave = async () => {
    const result = await streamerStore.updateStreamer({
        username: username.value,
        bio: bio.value,
        language: language.value
    })
    // Gestion de l'erreur
    if (result.error) {
        if (result.error.code === '23505') {
            // Conflit unique Postgres
            usernameError.value = 'Ce pseudo est déjà utilisé !'
        } else {
            usernameError.value = result.error.message
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

// Ajouter un nouveau lien
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

// Editer un champ (titre ou url)
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

// Sauvegarder les modifications d'un champ
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

// Réinitialiser le formulaire d'ajout de lien
const resetForm = () => {
    form.title = ''
    form.url = ''
    form.icon = 'link'
    newLink.value = null
    newlinkModal.value = false
}

// Supprimer un lien avec confirmation
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

// Ouvrir le modal de modification de l'icone
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

// Sauvegarder l'icone
const saveImage = async () => {
    await saveVignette()
    closeModal()
}

// Supprimer l'icone
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

const { hasFeature, getExpiryLabel, isSub } = useFeatures()

const brandingModal = ref(false)
</script>