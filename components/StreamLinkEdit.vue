<template>
    <!-- Edition -->
    <div class="flex flex-col gap-4">
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

        <!-- Aperçu du lien -->
        <Card>
            <template #title>
                <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                        <span class="text-lg font-semibold">Votre lien</span>
                        <span class="text-sm text-gray-400">
                            Partagez ce lien avec votre audience pour qu'elle puisse vous suivre facilement.
                        </span>
                    </div>
                    <NuxtLink :to="{ path: `/${streamer?.username}` }" target="_blank">
                        <Button class="whitespace-nowrap w-full" severity="contrast" variant="outlined">
                            <span>Voir mon StreamLink</span>
                            <ExternalLink class="w-4 h-4" />
                        </Button>
                    </NuxtLink>
                </div>
            </template>
            <template #content>
                <div class="flex items-center bg-gray-100/10 rounded justify-between pr-4 cursor-pointer"
                    @click="copyText">
                    <p ref="linkText" class="m-4">
                        streamlink.com/{{ streamer?.username }}
                    </p>
                    <Tag :severity="copied ? 'success' : 'secondary'" class="transition-all duration-300">
                        {{ copied ? 'Copié !' : 'Copier' }}
                    </Tag>
                </div>
            </template>
        </Card>

        <!-- Gérer les liens -->
        <Card class="mb-8">
            <template #title>
                <div class="flex flex-col">
                    <span class="font-semibold">Gérer vos liens</span>
                    <span class="text-sm text-gray-400">
                        Ajoutez, modifiez ou supprimez vos liens pour les mettre à jour facilement.
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2">
                    <div class="flex flex-col gap-2 w-full ">
                        <!-- Bouton Ajouter un lien -->
                        <Button class="w-full" severity="contrast" @click="linkModal = true">
                            <Plus class="w-5 h-5" />
                            <span class="font-medium">Ajouter un lien</span>
                        </Button>

                        <!-- Liste des liens -->
                        <div v-if="links.length === 0" class="text-gray-400 text-sm text-center py-4">
                            Aucun lien pour l’instant. Cliquez sur "Ajouter un lien" pour commencer
                        </div>
                        <Draggable v-model="links" item-key="id" handle=".drag-handle" @end="saveOrder"
                            class="flex flex-col gap-2">
                            <template #item="{ element }">
                                <div class="rounded-lg py-4 px-2 bg-gray-100/10">
                                    <div class="flex flex-row gap-4 items-center">
                                        <!-- Drag handle avec icône GripVertical -->
                                        <div class="drag-handle cursor-grab flex-shrink-0">
                                            <GripVertical class="w-5 h-5" />
                                        </div>
                                        <div class="flex flex-col flex-grow">
                                            <!-- Titre -->
                                            <div class="flex justify-between items-center">
                                                <div>
                                                    <div class="flex justify-between items-center">
                                                        <div class="flex items-center gap-2 mb-2 hover:cursor-pointer w-max"
                                                            @click="editLink(element)">
                                                            <span class="font-medium">
                                                                {{ element.title }}
                                                            </span>
                                                            <Pencil class="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    <!-- URL -->
                                                    <div class="flex justify-between items-center">
                                                        <div class="flex gap-2 items-center w-max hover:cursor-pointer"
                                                            @click="editLink(element)">
                                                            <p class="m-0 text-sm">
                                                                {{ element.url }}
                                                            </p>
                                                            <Pencil class="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <ToggleSwitch v-model="element.checked" class="mr-4" />
                                            </div>
                                            <!-- Actions -->
                                            <div class="flex justify-between items-center mr-3">
                                                <div
                                                    class="text-sm text-gray-400 mt-2 italic hover:cursor-pointer w-max">
                                                    <Button severity="secondary" variant="text"
                                                        v-tooltip.bottom="{ value: 'Icone' }">
                                                        <Image class="w-4 h-4" />
                                                    </Button>

                                                </div>
                                                <Button severity="secondary" variant="text"
                                                    v-tooltip.bottom="{ value: 'Supprimer' }"
                                                    @click="confirmDeletePopup($event, element.id)">
                                                    <Trash2 class="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Draggable>

                        <!-- Modal Ajouter / Modifier -->
                        <Dialog v-model:visible="linkModal" modal header="Lien" :style="{ width: '25rem' }">
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
                                        :disabled="!form.title || !form.url" @click="saveLink()" />
                                </div>
                            </div>
                        </Dialog>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ExternalLink, Plus, Pencil, Trash2, GripVertical, Image } from 'lucide-vue-next';
import Draggable from 'vuedraggable'

// Stores
const linkStore = useLinkStore()
const { links } = storeToRefs(linkStore)
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)

// Modale streamer
const streamerModal = ref(false)
const username = ref('')
const bio = ref('')
watchEffect(() => {
    username.value = streamer?.value?.username || ''
    bio.value = streamer?.value?.bio || ''
})

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

const getDefaultIcon = (url) => {
    const lower = url.toLowerCase()
    if (lower.includes('twitch')) return 'twitch'
    if (lower.includes('youtube')) return 'youtube'
    if (lower.includes('instagram')) return 'instagram'
    if (lower.includes('twitter')) return 'twitter'
    if (lower.includes('facebook')) return 'facebook'
    // if (lower.includes('discord')) return 'discord'
    if (lower.includes('tiktok')) return 'tiktok'
    if (lower.includes('kick')) return 'kick'
    // if (lower.includes('steam')) return 'gaming'
    if (lower.includes('spotify')) return 'music'
    if (lower.includes('amazon') || lower.includes('shop')) return 'shop'
    return 'link'
}

// Actions
const linkModal = ref(false);
const form = reactive({ title: '', url: '', icon: 'link' })

const handleSave = async () => {
    await streamerStore.updateStreamer({ username: username.value, bio: bio.value })
    streamerModal.value = false;
};

const editingLink = ref(null)
const editLink = (link) => {
    form.title = link.title
    form.url = link.url
    editingLink.value = link
    linkModal.value = true
}

const saveLink = async () => {
    const icon = getDefaultIcon(form.url)
    const maxOrder = links.value.length ? Math.max(...links.value.map(l => l.order || 0)) : 0
    if (editingLink.value) {
        await linkStore.updateLink(editingLink.value.id, { title: form.title, url: form.url, icon })
    } else {
        const newLink = await linkStore.addLink({ title: form.title, url: form.url, icon, order: maxOrder + 1 })
        localLinks.value.push(newLink.data)
    }
    resetForm()
}

const resetForm = () => {
    form.title = ''
    form.url = ''
    form.icon = 'link'
    editingLink.value = null
    linkModal.value = false
}

const confirm = useConfirm();

const confirmDeletePopup = (event, id) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Êtes vous sûr de vouloir supprimer ce lien ?',
        icon: 'pi pi-exclamation-triangle',
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

</script>