<template>
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
                            <Files class="w-4 h-4" />
                            <span class="text-sm">Copier le lien</span>
                        </Button>
                    </div>
                </div>
                <div class="flex items-center text-center flex-col w-full my-6">
                    <Avatar :image="streamer?.avatar_url || defaultAvatar" shape="circle" size="xlarge" class="mb-2" />
                    <span class="text-lg font-semibold">{{ streamer?.username }}</span>
                    <span class="text-sm font-medium">
                        {{ streamer?.bio }}
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2 w-full">
                    <div class="w-full mx-auto" v-for="link in links" :key="link.id">
                        <button
                            class="flex items-center w-full bg-white text-black font-semibold rounded-lg px-3 py-5 hover:bg-gray-100 transition">
                            <!-- Icône ou image à gauche -->
                            <div class="absolute flex items-center">
                                <component :is="getIconComponent(link.icon)" class="w-5 h-5 text-contrast" />
                            </div>
                            <!-- Texte centré -->
                            <span class="mx-auto font-medium">{{ link.title }}</span>
                        </button>
                    </div>
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
</template>

<script setup>
import {
    Twitch, Files, ArrowRight, Home, Youtube,
    Instagram,
    Twitter,
    Facebook,
    Globe,
    Music,
    ShoppingBag,
    Gamepad2,
    Link2,
} from "lucide-vue-next";

/* Convertit le nom d’icône en composant */
const getIconComponent = (name) => {
    const icons = {
        twitch: Twitch,
        youtube: Youtube,
        instagram: Instagram,
        twitter: Twitter,
        facebook: Facebook,
        discord: Globe,
        tiktok: Globe,
        kick: Globe,
        gaming: Gamepad2,
        music: Music,
        shop: ShoppingBag,
        link: Link2,
    }
    return icons[name] || Link2
}

const props = defineProps({
    links: { type: Array, required: true },
    streamer: { type: Object, required: true },
});

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Avatar/default/avatar.png";

</script>