<template>
    <Card class="min-h-full w-[580px]">
        <template #title>
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <NuxtLink v-ripple :to="'/'">
                        <Button rounded severity="secondary">
                            <Home />
                        </Button>
                    </NuxtLink>
                    <Button rounded severity="secondary" @click="copyText">
                        <span>Copier le lien</span>
                        <Files />
                    </Button>
                </div>
            </div>

            <div class="flex items-center text-center flex-col mx-auto my-6">
                <img :src="streamer?.avatar_url || defaultAvatar" alt="Avatar"
                    class="w-24 h-24 rounded-full object-cover mb-4" />
                <span class="text-xl font-semibold">{{ streamer?.username }}</span>
                <span class="text-base font-medium">
                    {{ streamer?.bio }}
                </span>
            </div>

        </template>
        <template #content>
            <!-- Liste de liens -->
            <div class="flex flex-col gap-4 w-full">
                <div class="w-full mx-auto" v-for="link in links" :key="link.id">
                    <a :href="link.url" target="_blank">
                        <button
                            class="flex items-center w-full bg-white text-black font-semibold rounded-lg px-3 py-5 hover:bg-gray-100 transition">
                            <!-- Icône ou image à gauche -->
                            <div class="absolute flex items-center">
                                <Twitch class="text-purple-600" />
                            </div>
                            <!-- Texte centré -->
                            <span class="mx-auto font-medium">{{ link.title }}</span>
                        </button>
                    </a>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-center mt-14">
                <NuxtLink :to="'/admin'">
                    <Button severity="contrast">
                        <span class="font-semibold">Rejoignez {{ streamer?.username }} sur StreamLink</span>
                        <ArrowRight class="w-4 h-4" />
                    </Button>
                </NuxtLink>
            </div>
        </template>

    </Card>
</template>

<script setup>
import { ArrowRight, Files, Home, Twitch } from "lucide-vue-next";

const route = useRoute()
const props = defineProps({
    streamer: { type: Object, required: true },
    links: { type: Array, required: true },
});
const { copy } = useClipboard()
const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Avatar/default/avatar.png";

const copyText = () => {
    const url = `${window.location.origin}/${route.params.username || ''}`
    copy(url)
}

</script>