<template>
    <Card style="--p-card-body-padding:0" class="h-24">
        <template #content>
            <div class="flex h-full items-center gap-4 pr-4">
                <!-- Avatar carré -->
                <div class="h-full w-24 flex-shrink-0">
                    <img :src="streamer.avatar_url || defaultAvatar" class="w-full h-full object-cover rounded" />
                </div>

                <!-- Infos streamer -->
                <div class="flex flex-col justify-center gap-2">
                    <p class="text-lg font-semibold">{{ streamer.username }}</p>
                    <NuxtLink :to="{ path: `/${streamer.username}` }" target="_blank">
                        <button
                            class="w-full px-4 py-2 text-sm font-medium rounded flex items-center justify-center gap-1 bg-white text-black">
                            StreamLink
                            <Icon name="lucide:external-link" />
                        </button>
                    </NuxtLink>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Avatar/default/avatar.png";

defineProps({
    streamer: {
        type: Object,
        required: true
    }
})

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