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
                    <Files class="w-5 h-5" />
                </div>
            </template>
        </Card>

        <!-- Gérer les liens -->
        <Card>
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
                    <div class="flex flex-col gap-2 w-full">
                        <!-- Bouton Ajouter un lien -->
                        <Button class="w-full" severity="contrast" @click="linkModal = true">
                            <Plus class="w-5 h-5" />
                            <span class="font-medium">Ajouter un lien</span>
                        </Button>

                        <!-- Liste des liens -->
                        <div v-if="links.length === 0" class="text-gray-400 text-sm text-center py-4">
                            Aucun lien pour l’instant. Cliquez sur "Ajouter un lien" pour commencer
                        </div>
                        <div v-else v-for="link in links" :key="link.id" class="rounded-lg p-4 bg-gray-100/10">
                            <!-- Header -->
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-lg font-semibold">{{ link.title }}</span>
                                <Pencil class="w-4 h-4 cursor-pointer" @click="editLink(link)" />
                            </div>

                            <!-- Content -->
                            <div class="flex justify-between items-center">
                                <div class="flex gap-2 items-center">
                                    <p class="m-0 text-sm">{{ link.url }}</p>
                                    <Pencil class="w-4 h-4 cursor-pointer" @click="editLink(link)" />
                                </div>
                                <div class="flex gap-2">
                                    <Trash2 class="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors"
                                        @click="confirmDelete(link.id)" />
                                </div>
                            </div>
                        </div>

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
import { Files, ExternalLink, Plus, Pencil, Trash2 } from 'lucide-vue-next';

const streamerModal = ref(false);
const linkModal = ref(false);
const editingLink = ref(null)
const form = reactive({ title: '', url: '' })
const emit = defineEmits(["add", "update", "delete", "updateStreamer"]);

const props = defineProps({
    streamer: { type: Object, required: true },
    links: { type: Array, required: true },
});
const username = ref(props.streamer.username);
const bio = ref(props.streamer.bio);

watchEffect(() => {
    username.value = props.streamer.username;
    bio.value = props.streamer.bio;
});

const linkText = ref(null)
const { copy } = useClipboard()
const copyText = () => {
    if (linkText.value) copy(`http://${linkText.value.innerText}`)
}

const handleSave = async () => {
    await emit("updateStreamer", { username: username.value, bio: bio.value });
    streamerModal.value = false;
};

const resetForm = () => {
    form.title = '';
    form.url = '';
    editingLink.value = null;
    linkModal.value = false;
}

const editLink = (link) => {
    form.title = link.title
    form.url = link.url
    editingLink.value = link
    linkModal.value = true
}

const saveLink = async () => {
    if (editingLink.value) {
        await emit("update", editingLink.value.id, { title: form.title, url: form.url });
    } else {
        await emit("add", { title: form.title, url: form.url });
    }
    resetForm();
};

const confirmDelete = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer ce lien ?")) {
        await emit("delete", id);
    }
};

</script>