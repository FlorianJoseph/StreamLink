<template>
    <div class="flex flex-col gap-4">
        <div class="py-4">
            <div class="flex flex-col text-center items-center h-24 justify-end">
                <div class="font-bold text-4xl leading-tight">Aperçu</div>
                <div class="text-xl leading-normal">
                    Voici comment votre page apparaîtra à vos visiteurs
                </div>
            </div>
        </div>

        <!-- Aperçu du streamlink -->
        <Card class="flex items-center h-160">
            <template #title>
                <div class="flex items-center text-center flex-col gap-2 mx-4 my-2">
                    <Avatar :image="user.user_metadata.avatar_url" shape="circle" size="xlarge" />
                    <span class="text-xl font-semibold">{{ user.user_metadata.nickname }}</span>
                    <span class="text-sm text-surface-600">{{ user.user_metadata.custom_claims.description }}</span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2 text-center">
                    <Card class="border-1">
                        <template #content>
                            <Twitch class="w-5 h-5 inline-block mr-2" />
                            <span class="text-lg font-semibold">Twitch</span>
                        </template>
                    </Card>
                    <Card class="border-1">
                        <template #content>
                            <Youtube class="w-5 h-5 inline-block mr-2" />
                            <span class="text-lg font-semibold">YouTube</span>
                        </template>
                    </Card>
                    <Card class="border-1">
                        <template #content>
                            <span class="text-lg font-semibold">TikTok</span>
                        </template>
                    </Card>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-center mt-4">
                    <Button severity="contrast">
                        <span>Rejoignez {{ user.user_metadata.nickname }} sur StreamLink</span>
                        <ArrowRight class="w-4 h-4" />
                    </Button>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { Twitch, Youtube, ArrowRight } from 'lucide-vue-next';

const user = useSupabaseUser();
</script>