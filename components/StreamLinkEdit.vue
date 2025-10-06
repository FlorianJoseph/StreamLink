<!-- Layout en deux colonnes : édition à gauche, aperçu à droite -->

<template>
    <!-- Edition -->
    <div class="flex-[2]">
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
                                <Button type="button" label="Sauvegarder" severity="contrast"
                                    @click="handleSave"></Button>
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
                        <EditCardLink />
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <!-- Aperçu du streamlink -->
    <div class="flex-[1]">
        <div class="flex flex-col gap-4">
            <div class="py-4">
                <div class="flex items-center flex-col h-12 justify-end">
                    <h1 class="text-3xl font-bold">Aperçu</h1>
                    <p class="text-center lg:text-left">Voici comment votre page apparaîtra à vos visiteurs</p>
                </div>
            </div>

            <Card class="flex flex-col h-160 w-97">
                <template #title>
                    <div class="mb-8 w-full">
                        <div class="flex justify-between w-full">
                            <Button rounded severity="secondary">
                                <Home class="w-4 h-4" />
                            </Button>
                            <Button rounded severity="secondary">
                                <span class="text-sm">Copier le lien</span>
                                <Files class="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div class="flex items-center text-center flex-col w-full my-6">
                        <Avatar
                            :image="streamer?.avatar_url || 'https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/sign/Streamlink/Avatar/default.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NDMzZjlmNi01NGMzLTQxNzQtYmY0ZC01YzVjZDliNmI2MjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTdHJlYW1saW5rL0F2YXRhci9kZWZhdWx0LnBuZyIsImlhdCI6MTc1OTc0NTEzMCwiZXhwIjoyMDc1MTA1MTMwfQ.IppJUbOxBC5Nihi0dUVSS_bNYmdvWEi5VzzRl5xyAng'"
                            shape="circle" size="xlarge" class="mb-2" />
                        <span class="text-lg font-semibold">{{ streamer?.username }}</span>
                        <span class="text-sm font-medium">
                            {{ streamer?.bio }}
                        </span>
                    </div>
                </template>
                <template #content>
                    <div class="flex flex-col gap-2 w-full">
                        <LinkCard />
                    </div>
                </template>
                <template #footer>
                    <div class="flex justify-center mt-4 w-full">
                        <Button severity="contrast">
                            <span>Rejoignez {{ streamer?.username }} sur StreamLink</span>
                            <ArrowRight class="w-4 h-4" />
                        </Button>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { Files, ExternalLink, ArrowRight, Home } from 'lucide-vue-next';

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

const linkText = ref(null)
const { copy } = useClipboard()
const copyText = () => {
    if (linkText.value) copy(`http://${linkText.value.innerText}`)
}
</script>