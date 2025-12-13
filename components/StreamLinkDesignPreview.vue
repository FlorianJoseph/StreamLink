<template>
    <div class="flex flex-col gap-4">
        <div class="pb-4 lg:py-4">
            <div class="flex flex-col items-center justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                    Aperçu du StreamLink
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center lg:text-left max-w-xl">
                    Voici comment votre page apparaîtra à vos visiteurs
                </p>
            </div>
        </div>
        <StreamLinkShare />
        <Card class="flex flex-col w-full h-160 sm:w-sm overflow-auto">
            <template #title>
                <div class="flex items-center text-center flex-col w-full my-6">
                    <Avatar :image="streamer?.avatar_url || defaultAvatar" shape="circle" size="xlarge" class="mb-2" />
                    <span class="text-lg font-semibold">{{ streamer?.username }}</span>
                    <span class="text-sm font-medium break-words">
                        {{ streamer?.bio }}
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2 w-full">
                    <div class="w-full mx-auto" v-for="link in visibleLinks" :key="link.id">
                        <a :href="link.url" target="_blank">
                            <button :class="['relative flex items-center w-full bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition h-14',
                                link.icon_url ? 'px-3 py-3' : 'px-5 py-5']">
                                <!-- Icône ou image à gauche -->
                                <div
                                    :class="['absolute flex items-center justify-center', link.icon_url ? 'left-2.5' : 'left-4.5']">
                                    <template v-if="link.icon_url">
                                        <img :src="link.icon_url"
                                            class="w-8.5 h-8.5 object-contain rounded flex-shrink-0" />
                                    </template>
                                    <template v-else>
                                        <Icon :name="link.icon" size="20" class="flex-shrink-0" />
                                    </template>
                                </div>
                                <!-- Texte centré -->
                                <span class="font-medium break-words flex-1 text-sm sm:text-base text-center mx-8">{{
                                    link.title }}</span>
                            </button>
                        </a>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-center my-10">
                    <Button severity="contrast">
                        <span class="text-sm font-semibold">Rejoignez {{ streamer?.username }} sur StreamLink</span>
                    </Button>
                </div>
                <!-- Footer infos -->
                <div class="flex flex-col items-center gap-3 pb-6 text-xs">
                    <div class="flex items-center gap-2">
                        <p class="hover:underline font-medium">Contact</p>
                        <span>•</span>
                        <p class="hover:underline font-medium">Confidentialité</p>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
const linkStore = useLinkStore()
const streamerStore = useStreamerStore()
const designStore = useDesignStore()
const { links } = storeToRefs(linkStore)
const { streamer } = storeToRefs(streamerStore)
const { design } = storeToRefs(designStore)
const visibleLinks = computed(() => links.value.filter(link => link.visible))

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png";

</script>