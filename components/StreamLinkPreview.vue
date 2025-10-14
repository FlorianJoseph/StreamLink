<template>
    <div class="flex flex-col gap-4">
        <div class="py-4">
            <div class="flex items-center flex-col h-12 justify-end">
                <h1 class="text-3xl font-bold">Aperçu</h1>
                <p class="text-center lg:text-left">Voici comment votre page apparaîtra à vos visiteurs</p>
            </div>
        </div>

        <Card class="flex flex-col h-max min-h-160 w-97">
            <template #title>
                <div class="mb-8 w-full">
                    <div class="flex justify-between w-full">
                        <Button rounded severity="secondary">
                            <Icon name="lucide:home" />
                        </Button>
                        <Button rounded severity="secondary">
                            <Icon name="lucide:files" />
                            <span class="text-sm">Copier le Streamlink</span>
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
                            class="flex items-center w-full bg-white text-black font-semibold rounded-lg px-3 py-4 hover:bg-gray-100 transition">
                            <!-- Icône ou image à gauche -->
                            <div class="absolute flex items-center">
                                <Icon :name="link.icon" size="20" />
                            </div>
                            <!-- Texte centré -->
                            <span class="mx-auto font-medium">{{ link.title }}</span>
                        </button>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-center mt-14">
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


const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Avatar/default/avatar.png";

</script>