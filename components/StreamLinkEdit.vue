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

        <!-- Boutons d'actions -->
        <div class="flex flex-row gap-2 w-full">
            <div>
                <Button severity="contrast" @click="visible = true">
                    <SquarePen class="w-5 h-5" />
                    <span>Modifier le nom et la description</span>
                </Button>
                <Dialog v-model:visible="visible" modal header="Nom et biographie" :style="{ width: '25rem' }">
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="username">Nom</label>
                            <InputText id="username" v-model="username" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="bio">Biographie</label>
                            <Textarea id="bio" v-model="bio" rows="5" cols="30" autoResize />
                        </div>
                        <div class="flex justify-end gap-2">
                            <Button type="button" label="Annuler" severity="secondary"
                                @click="visible = false"></Button>
                            <Button type="button" label="Sauvegarder" @click="visible = false"></Button>
                        </div>
                    </div>
                </Dialog>
            </div>
            <div>
                <Button severity="contrast">
                    <Plus class="w-5 h-5" />
                    <span>Ajouter un lien</span>
                </Button>
            </div>
            <div>
                <router-link :to="{ path: `/${user.user_metadata.nickname}` }" target="_blank">
                    <Button class="whitespace-nowrap w-full" severity="contrast">
                        <span>Voir mon StreamLink</span>
                        <ExternalLink class="w-4 h-4" />
                    </Button>
                </router-link>
            </div>
        </div>

        <!-- Aperçu du lien -->
        <Card>
            <template #title>
                <div class="flex flex-col">
                    <span class="text-lg font-semibold">Votre lien</span>
                    <span class="text-sm text-gray-400 mt-1">
                        Partagez ce lien avec votre audience pour qu'elle puisse vous suivre facilement.
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex items-center bg-gray-100/10 rounded justify-between pr-4">
                    <p class="m-4">
                        streamlink.com/{{ user.user_metadata.nickname }}
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
                    <span class="text-sm text-gray-400 mt-1">
                        Ajoutez, modifiez ou supprimez vos liens pour les mettre à jour facilement.
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2">
                    <Card class="border-1">
                        <template #title>
                            <div class="flex items-center gap-2">
                                <span class="text-lg font-semibold">Twitch</span>
                                <Pencil class="w-4 h-4 cursor-pointer" />
                            </div>
                        </template>
                        <template #content>
                            <div class="flex justify-between items-center">
                                <div class="flex gap-2 items-center">
                                    <p class="m-0 text-sm">
                                        https://www.twitch.tv/nordik_saga
                                    </p>
                                    <Pencil class="w-4 h-4 cursor-pointer" />
                                </div>
                                <div class="flex gap-2">
                                    <Trash2 class="w-5 h-5 cursor-pointer text-red-500" />
                                </div>
                            </div>
                        </template>
                    </Card>
                    <Card class="border-1">
                        <template #title>
                            <div class="flex items-center gap-2">
                                <span class="text-lg font-semibold">TikTok</span>
                                <Pencil class="w-4 h-4 cursor-pointer" />
                            </div>
                        </template>
                        <template #content>
                            <div class="flex justify-between items-center">
                                <div class="flex gap-2 items-center">
                                    <p class="m-0 text-sm">
                                        https://www.tiktok.com/@nordik_saga
                                    </p>
                                    <Pencil class="w-4 h-4 cursor-pointer" />
                                </div>
                                <div class="flex gap-2">
                                    <Trash2 class="w-5 h-5 cursor-pointer text-red-500" />
                                </div>
                            </div>
                        </template>
                    </Card>
                    <Card class="border-1">
                        <template #title>
                            <div class="flex items-center gap-2">
                                <span class="text-lg font-semibold">YouTube</span>
                                <Pencil class="w-4 h-4 cursor-pointer" />
                            </div>
                        </template>
                        <template #content>
                            <div class="flex justify-between items-center">
                                <div class="flex gap-2 items-center">
                                    <p class="m-0 text-sm">
                                        https://www.youtube.com/@NordiK_Saga
                                    </p>
                                    <Pencil class="w-4 h-4 cursor-pointer" />
                                </div>
                                <div class="flex gap-2">
                                    <Trash2 class="w-5 h-5 cursor-pointer text-red-500" />
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { Plus, Files, SquarePen, Pencil, Trash2, Twitch, Youtube, ExternalLink } from 'lucide-vue-next';

const user = useSupabaseUser()
const visible = ref(false);
const username = ref(user.value ? user.value.user_metadata.nickname : '');
const bio = ref(user.value ? user.value.user_metadata.custom_claims.description : '');

</script>