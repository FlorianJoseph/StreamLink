<template>
    <div class="flex flex-col gap-4">
        <div class="py-4">
            <div class="flex items-center flex-col h-12 justify-end">
                <h1 class="text-3xl font-bold">Aperçu</h1>
                <p class="text-center lg:text-left">Voici comment votre page apparaîtra à vos visiteurs</p>
            </div>
        </div>

        <!-- Aperçu du streamlink -->
        <Card class="flex flex-col w-full h-160">
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
                        :image="streamer?.avatar_url || 'https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Avatar/default/avatar.png'"
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
</template>

<script setup>
import { ArrowRight, Home, Files } from 'lucide-vue-next';

const { streamer } = useStreamer()

</script>