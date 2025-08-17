<template>
    <Card class="w-[25rem] overflow-hidden md:mx-12 lg:mx-20" v-if="user">
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
                <span class="text-sm text-surface-500 text-gray-400">@{{ user.user_metadata.name }}</span>
            </div>
        </template>

        <!-- Bio -->
        <template #content>
            <p class="m-0 text-sm text-surface-600">
                {{ user.user_metadata.custom_claims.description }}
            </p>
        </template>

        <!-- Boutons -->
        <template #footer>
            <div class="flex gap-4 mt-1">
                <Button class="whitespace-nowrap w-full" @click="openTwitch" severity="secondary">
                    <span>Voir sur Twitch</span>
                    <ExternalLink class="w-4 h-4" />
                </Button>
            </div>
        </template>
    </Card>

    <p v-else>Non connecté</p>
</template>

<script setup>
import { Heart, ExternalLink } from 'lucide-vue-next';

const user = useSupabaseUser()

function openTwitch() {
    if (user.value) {
        window.open(`https://twitch.tv/${user.value.user_metadata.nickname}`, "_blank")
    }
}

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