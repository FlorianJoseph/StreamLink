<template>
    <Card class="w-full overflow-hidden" v-if="user">
        <!-- Bannière -->
        <template #header>
            <div class="relative">
                <img alt="Twitch Banner" class="w-full h-24 object-cover"
                    :src="user.user_metadata.custom_claims.offline_image_url" />

                <!-- Avatar -->
                <div class="flex justify-between items-center mx-4 mt-4">
                    <div class="flex items-center gap-2">
                        <Avatar :image="user.user_metadata.avatar_url" size="large" shape="circle" />
                        <div class="flex items-center flex-col items-start">
                            <span class="text-lg font-semibold">{{ user.user_metadata.nickname }}</span>
                            <Badge :value="translateBroadcasterType(user.user_metadata.custom_claims.broadcaster_type)"
                                severity="info" />
                        </div>
                    </div>
                    <NuxtLink :to="{ path: `/${user.user_metadata.nickname}` }" target="_blank">
                        <Button class="whitespace-nowrap" severity="contrast">
                            <span class="text-sm font-medium">StreamLink</span>
                            <ExternalLink class="w-4 h-4" />
                        </Button>
                    </NuxtLink>
                </div>
            </div>
        </template>

        <!-- Nom & pseudo -->
        <template #title>
        </template>

        <!-- Bio -->
        <template #content>
            <div class="flex flex-row items-start gap-1 ">
                <Users class="w-5 h-5 mb-2 text-gray-300" />
                <p class="text-sm text-gray-300">534 followers</p>
            </div>
            <div class="mx-auto text-start">
                <p class="text-sm text-surface-600">
                    {{ user.user_metadata.custom_claims.description }}
                </p>
            </div>
        </template>

        <!-- Boutons -->
        <template #footer>
        </template>
    </Card>
</template>

<script setup>
import { Users, ExternalLink } from 'lucide-vue-next';
const user = useSupabaseUser()

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

console.log(user.value);

</script>