<template>
    <Card style="--p-card-body-padding:0" class="h-auto p-2">
        <template #content>
            <div class="flex items-center gap-4 pr-4">
                <!-- Avatar carré -->
                <div class="w-16 sm:w-20 md:w-24 aspect-square flex-shrink-0">
                    <img :src="streamer.avatar_url || defaultAvatar" class="w-full h-full object-cover rounded" />
                </div>

                <!-- Infos streamer -->
                <div class="flex flex-col justify-center gap-2 flex-1 min-w-0">
                    <!-- Pseudo -->
                    <p class="text-lg font-semibold truncate">{{ streamer.username }}</p>
                    <!-- Bouton StreamLink -->
                    <NuxtLink :to="{ path: `/${streamer.username}` }" target="_blank">
                        <button
                            class="px-4 py-2 text-sm font-medium rounded flex items-center justify-center gap-1 bg-white text-black max-w-full truncate">
                            <span class="truncate">StreamLink</span>
                            <Icon name="lucide:external-link" class="flex-shrink-0" />
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