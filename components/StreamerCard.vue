<template>
    <Card style="--p-card-body-padding:0" class="h-[250px] border border-zinc-700">
        <template #content>
            <div class="flex flex-col h-full p-4 gap-3">
                <!-- Header : Avatar + Pseudo -->
                <div class="flex items-center gap-3">
                    <div class="relative w-12 h-12 flex-shrink-0">
                        <img :src="streamer.avatar_url || defaultAvatar"
                            class="w-full h-full object-cover rounded-xl ring-2 ring-zinc-700"
                            :alt="streamer.username" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="text-base font-semibold truncate text-white">
                            {{ streamer.username }}
                        </h3>
                    </div>
                </div>

                <!-- Prochain stream -->
                <div v-if="streamer.nextSlot" class="flex-1 min-h-0">
                    <div class="p-3 rounded-xl border-2 border-zinc-700 bg-zinc-800/30 space-y-3 h-[105px]">
                        <div class="flex items-center gap-2 text-purple-400/90">
                            <Icon name="lucide:play" size="16" class=" shrink-0" />
                            <p class="font-semibold text-xs uppercase tracking-wider ">
                                Prochain stream
                            </p>
                        </div>
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                            <!-- Image du jeu -->
                            <div class="flex-shrink-0">
                                <img v-if="streamer.nextSlot.game.cover" :src="streamer.nextSlot.game.cover"
                                    :alt="streamer.nextSlot.game.label"
                                    class="w-9 h-12 rounded object-fill border border-zinc-700" />
                            </div>

                            <!-- Infos -->
                            <div class="flex flex-col min-w-0 flex-1">
                                <span class="text-sm font-medium text-white truncate">
                                    {{ streamer.nextSlot.game.label }}
                                </span>
                                <span class="text-xs text-gray-400 truncate">
                                    {{ streamer.nextSlot.day }} · {{ formatTime(streamer.nextSlot.start_at) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Aucun planning -->
                <div v-else class="flex-1 min-h-0">
                    <div class="p-3 rounded-xl border-2 border-zinc-600/70 border-dashed
                               bg-zinc-800/30 text-center flex flex-col justify-center h-[105px]">
                        <Icon name="lucide:calendar-plus" size="18" class="text-gray-500 mx-auto mb-2" />
                        <p class="text-xs text-gray-400 font-medium">
                            Aucun stream prévu
                        </p>
                        <p class="text-[11px] text-gray-500 mt-1">
                            Ce streameur n'a pas encore configuré son planning.
                        </p>
                    </div>
                </div>

                <!-- Bouton CTA -->
                <NuxtLink :to="`/${streamer.username}`" target="_blank" class="w-full mt-auto">
                    <button
                        class="w-full px-4 py-2 text-sm font-medium rounded-lg border-2 border-zinc-700 hover:border-purple-400/80 transition-all flex items-center justify-center gap-2">
                        <span>Voir le profil</span>
                        <Icon name="lucide:external-link" size="16" />
                    </button>
                </NuxtLink>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">

const defaultAvatar =
    "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png";

defineProps({
    streamer: {
        type: Object,
        required: true
    }
})

function formatTime(time: string) {
    if (!time) return ''
    const [h, m] = time.split(':')
    return `${h}h${m}`
}
</script>