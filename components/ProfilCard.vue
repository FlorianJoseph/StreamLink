<template>
    <Card
        class="w-full max-w-[25rem] sm:max-w-[30rem] md:max-w-[35rem] lg:max-w-[40rem] xl:max-w-[45rem] mx-auto overflow-hidden"
        v-if="user">
        <!-- Bannière -->
        <template #header>
            <div class="relative">
                <img alt="Twitch Banner" class="w-full h-32 object-cover"
                    :src="user.user_metadata.custom_claims.offline_image_url" />

                <!-- Avatar -->
                <img alt="Avatar"
                    class="absolute left-4 bottom-[-2.5rem] w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    :src="user.user_metadata.picture" />

                <!-- Bouton Suivre -->
                <div class="absolute bottom-[-2rem] right-4">
                    <Button class="whitespace-nowrap" severity="contrast">
                        <Heart class="w-4 h-4" />
                        <span>Suivre</span>
                    </Button>
                </div>
            </div>
        </template>

        <!-- Nom & pseudo -->
        <template #title>
            <div class="flex flex-col mt-10">
                <div class="flex items-center gap-2">
                    <span class="text-xl font-semibold">{{ user.user_metadata.nickname }}</span>
                    <Badge :value="translateBroadcasterType(user.user_metadata.custom_claims.broadcaster_type)"
                        severity="info" />
                </div>
            </div>
        </template>

        <!-- Bio -->
        <template #content>
            <div class="flex flex-col gap-4">
                <div class="flex items-center flex-wrap gap-8">
                    <div>
                        <span>Followers</span>
                        <div class="mt-1 text-sm font-semibold">521</div>
                    </div>
                    <div>
                        <span>Projects</span>
                        <div class=" mt-1 text-sm font-semibold">10</div>
                    </div>
                    <div>
                        <span>Collections</span>
                        <div class=" mt-1 text-sm font-semibold">54</div>
                    </div>
                    <div>
                        <span>Shots</span>
                        <div class="mt-1 text-sm font-semibold">546</div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Boutons -->
        <template #footer>
            <div class="mt-6 md:mt-0 flex items-center">
                <router-link class="mr-3" :to="''">
                    <Button class="whitespace-nowrap" outlined severity="contrast">
                        <SquarePen class="w-4 h-4" />
                        <span>Modifier le profil</span>
                    </Button>
                </router-link>
                <router-link :to="'/streamlink'" target="_blank">
                    <Button class="whitespace-nowrap" severity="contrast">
                        <span>StreamLink</span>
                        <ExternalLink class="w-4 h-4" />
                    </Button>
                </router-link>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { SquarePen, ExternalLink, Heart } from 'lucide-vue-next';

const user = useSupabaseUser();

function translateBroadcasterType(type) {
    switch (type) {
        case 'partner':
            return 'Partenaire'
        case 'affiliate':
            return 'Affilié'
        default:
            return 'Aucun'
    }
}
</script>