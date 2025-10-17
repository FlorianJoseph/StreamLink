<template>
    <div class="flex flex-col gap-4">
        <div class="py-4">
            <div class="flex flex-col h-12 justify-end">
                <h1 class="text-3xl font-bold">Aperçu du StreamLink</h1>
                <p class="text-center lg:text-left">Voici comment votre page apparaîtra à vos visiteurs</p>
            </div>
        </div>
        <StreamLinkShare />
        <Card class="flex flex-col h-160 w-97 overflow-auto">
            <template #title>
                <div class="flex items-center text-center flex-col w-full my-6">
                    <Avatar :image="streamer?.avatar_url || defaultAvatar" shape="circle" size="xlarge" class="mb-2" />
                    <span class="text-lg font-semibold">{{ streamer?.username }}</span>
                    <span class="text-sm font-medium break-all">
                        {{ streamer?.bio }}
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2 w-full">
                    <div class="w-full mx-auto" v-for="link in visibleLinks" :key="link.id">
                        <a :href="link.url" target="_blank">
                            <button
                                class="relative flex items-center justify-center w-full bg-white text-black font-semibold rounded-lg px-3 py-4 hover:bg-gray-100 transition">
                                <!-- Icône ou image à gauche -->
                                <div class="absolute flex items-center justify-center"
                                    :class="link.icon_url ? 'left-2.5' : 'left-4'">
                                    <template v-if="link.icon_url">
                                        <img :src="link.icon_url" class="w-8.5 h-8.5 object-contain rounded" />
                                    </template>
                                    <template v-else>
                                        <Icon :name="link.icon" size="20" />
                                    </template>
                                </div>
                                <!-- Texte centré -->
                                <span class="font-medium text-center w-full">{{ link.title }}</span>
                            </button>
                        </a>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-center my-10">
                    <Button severity="contrast">
                        <span class="text-sm font-semibold">Rejoignez {{ streamer?.username }} sur StreamLink</span>
                        <Icon name="lucide:arrow-right" />
                    </Button>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
const linkStore = useLinkStore()
const streamerStore = useStreamerStore()
const { links } = storeToRefs(linkStore)
const { streamer } = storeToRefs(streamerStore)
const visibleLinks = computed(() => links.value.filter(link => link.visible))

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Avatar/default/avatar.png";

</script>