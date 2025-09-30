<template>
    <div class="flex flex-col gap-4">

        <!-- En-tête -->
        <div class="py-4">
            <div class="flex items-center flex-col lg:items-start h-12 justify-end">
                <h1 class="text-3xl font-bold">Modifier mon StreamLink</h1>
                <p class="text-center lg:text-left">Créez votre page de liens personnalisée à partager avec votre
                    audience</p>
            </div>
        </div>

        <!-- Avatar et bouton de modification -->
        <div class="flex flex-row gap-4 items-center">
            <UploadAvatar />
            <div>
                <div class="flex flex-col" @click="visible = true">
                    <span class="text-lg font-medium hover:underline cursor-pointer">
                        {{ streamer?.username }}
                    </span>
                    <span class="text-sm text-gray-400 hover:underline cursor-pointer line-clamp-1">
                        {{ streamer?.bio || 'Ajouter une description' }}
                    </span>
                </div>
                <Dialog v-model:visible="visible" modal header="Nom et description" :style="{ width: '25rem' }">
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
                                @click="visible = false"></Button>
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
                <div class="flex items-center bg-gray-100/10 rounded justify-between pr-4">
                    <p class="m-4">
                        streamlink.com/{{ streamer?.username }}
                    </p>
                    <Files class="w-5 h-5 hover:text-blue-500 cursor-pointer transition-colors" />
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

                    <Button severity="contrast" class="w-full">
                        <Plus class="w-5 h-5" />
                        <span class="font-medium">Ajouter un lien</span>
                    </Button>

                    <!-- Exemple de lien -->
                    <div class="rounded-lg p-4 bg-gray-100/10 text-white">
                        <!-- Header -->
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-lg font-semibold">Twitch</span>
                            <Pencil class="w-4 h-4 cursor-pointer" />
                        </div>

                        <!-- Content -->
                        <div class="flex justify-between items-center">
                            <div class="flex gap-2 items-center">
                                <p class="m-0 text-sm">
                                    https://www.twitch.tv/nordik_saga
                                </p>
                                <Pencil class="w-4 h-4 cursor-pointer" />
                            </div>
                            <div class="flex gap-2">
                                <Trash2 class="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { Plus, Files, Pencil, Trash2, ExternalLink } from 'lucide-vue-next';

const visible = ref(false);
const username = ref('')
const bio = ref('')

const { streamer, updateStreamer } = useStreamer()

watchEffect(() => {
    if (streamer.value) {
        username.value = streamer.value.username
        bio.value = streamer.value.bio
    }
})

const handleSave = async () => {
    await updateStreamer({ username: username.value, bio: bio.value })
    visible.value = false
}
</script>