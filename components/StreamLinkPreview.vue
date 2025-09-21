<template>
    <div class="flex flex-col gap-4">
        <div class="py-4">
            <div class="flex items-center flex-col h-12 justify-end">
                <h1 class="text-3xl font-bold">Aperçu</h1>
                <p class="text-center lg:text-left">Voici comment votre page apparaîtra à vos visiteurs</p>
            </div>
        </div>

        <!-- Aperçu du streamlink -->
        <Card class="flex items-center h-160">
            <template #title>
                <div class="mb-8">
                    <div class="flex items-center justify-between">
                        <Button rounded severity="secondary">
                            <Home class="w-4 h-4" />
                        </Button>
                        <Button rounded severity="secondary">
                            <span class="text-sm">Copier le lien</span>
                            <Files class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div class="flex items-center text-center flex-col mx-auto my-6">
                    <Avatar :image="user.user_metadata.avatar_url" shape="circle" size="xlarge" class="mb-2" />
                    <span class="text-lg font-semibold">{{ user.user_metadata.nickname }}</span>
                    <span class="text-sm font-medium">
                        {{ user.user_metadata.custom_claims.description }}
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2 text-center">
                    <LinkCard />
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
import { ArrowRight, Home, Files } from 'lucide-vue-next';

const user = useSupabaseUser();
</script>