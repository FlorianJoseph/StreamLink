<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="flex flex-col gap-4">
            <div class="m-4 py-4">
                <div class="text-center flex flex-col items-center gap-4">
                    <div class="font-bold text-4xl leading-tight">Mon StreamLink</div>
                    <div class="text-xl leading-normal">Créez votre page de liens personnalisée à partager avec votre
                        audience
                    </div>
                </div>
            </div>

            <!-- Aperçu du lien -->
            <Card>
                <template #title>
                    Votre lien
                </template>
                <template #subtitle>
                    Partagez ce lien avec votre audience pour qu'elle puisse vous suivre facilement.
                </template>
                <template #content>
                    <div class="flex items-center">
                        <p class="m-4">
                            streamlink.com/{{ user.user_metadata.nickname }}
                        </p>
                        <Files class="w-5 h-5" />
                    </div>
                </template>
            </Card>

            <Card>
                <template #title>
                    Gérer vos liens
                </template>
                <template #subtitle>
                    Ajoutez, modifiez ou supprimez vos liens pour les mettre à jour facilement.
                </template>
                <template #content>
                    <Button severity="contrast">
                        <Plus />
                        <span>Ajouter un lien</span>
                    </Button>

                    <Button severity="contrast" @click="visible = true">
                        <Plus />
                        <span>Modifier la description</span>
                    </Button>
                    <Dialog v-model:visible="visible" modal header="Nom et biographie" :style="{ width: '25rem' }">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label for="username">Nom</label>
                                <InputText id="username" v-model="username" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="bio">Biographie</label>
                                <InputText id="bio" v-model="bio" />
                            </div>
                            <div class="flex justify-end gap-2">
                                <Button type="button" label="Cancel" severity="secondary"
                                    @click="visible = false"></Button>
                                <Button type="button" label="Save" @click="visible = false"></Button>
                            </div>
                        </div>
                    </Dialog>

                </template>
                <template #footer>
                    <Card class="border-1">
                        <template #title>
                            <span class="text-lg font-semibold">Twitch</span>
                        </template>
                        <template #content>
                            <p class="m-0 text-sm text-surface-600">
                                Suivez-moi sur Twitch pour ne rien manquer de mes streams !
                            </p>
                        </template>
                    </Card>
                </template>
            </Card>

        </div>

        <div>
            <div class="m-4 py-4">
                <div class="text-center flex flex-col items-center gap-4">
                    <div class="font-bold text-4xl leading-tight">Aperçu
                    </div>
                    <div class="text-xl leading-normal">Voici comment votre page apparaîtra à vos visiteurs</div>
                </div>
            </div>

            <!-- Aperçu du streamlink -->
            <Card class="m-4 flex items-center">
                <template #title>
                    <div class="flex items-center gap-2">
                        <Avatar :image="user.user_metadata.avatar_url" shape="circle" />
                        <span class="text-xl font-semibold">{{ user.user_metadata.nickname }}</span>
                    </div>
                </template>
                <template #content>
                    <Card class="border-1">
                        <template #title>
                            <span class="text-lg font-semibold">Twitch</span>
                        </template>
                        <template #content>
                            <p class="m-0 text-sm text-surface-600">
                                Suivez-moi sur Twitch pour ne rien manquer de mes streams !
                            </p>
                        </template>
                    </Card>
                    <Card class="border-1">
                        <template #title>
                            <span class="text-lg font-semibold">Twitch</span>
                        </template>
                        <template #content>
                            <p class="m-0 text-sm text-surface-600">
                                Suivez-moi sur Twitch pour ne rien manquer de mes streams !
                            </p>
                        </template>
                    </Card>
                    <Card class="border-1">
                        <template #title>
                            <span class="text-lg font-semibold">Twitch</span>
                        </template>
                        <template #content>
                            <p class="m-0 text-sm text-surface-600">
                                Suivez-moi sur Twitch pour ne rien manquer de mes streams !
                            </p>
                        </template>
                    </Card>
                </template>
            </Card>
        </div>
    </div>

</template>

<script setup>
import { Link, Plus, Files } from 'lucide-vue-next';

const user = useSupabaseUser()
const visible = ref(false);
const username = ref(user.value ? user.value.user_metadata.nickname : '');
const bio = ref(user.value ? user.value.user_metadata.custom_claims.description : '');

</script>
