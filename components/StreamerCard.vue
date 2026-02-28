<template>
    <NuxtLink :to="`/${streamer.username}`" target="_blank" class="w-full mt-auto">
        <Card style="--p-card-body-padding:0"
            class="border border-zinc-700 hover:border-purple-500/60 transition-colors duration-200 ease-out cursor-pointer">
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

                            <!-- Header -->
                            <div :class="[
                                streamer.nextSlot.isLive ? 'text-red-400' : 'text-purple-400/80'
                            ]">
                                <div class="flex items-center gap-1.5">
                                    <span v-if="streamer.nextSlot.isLive"
                                        class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)] shrink-0" />
                                    <Icon v-else name="lucide:calendar-clock" size="14" class="shrink-0 opacity-80" />
                                    <p class="font-semibold text-xs uppercase tracking-widest">
                                        {{ streamer.nextSlot.isLive ? 'Live' : 'Prochain stream' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Contenu -->
                            <div class="flex items-center gap-3 min-w-0">

                                <!-- Pochette jeu -->
                                <div class="flex-shrink-0">
                                    <img v-if="streamer.nextSlot.game.cover" :src="streamer.nextSlot.game.cover"
                                        :alt="streamer.nextSlot.game.label"
                                        class="w-9 h-12 rounded object-fill border border-zinc-700/80 shadow-md" />
                                </div>

                                <!-- Infos texte -->
                                <div
                                    :class="['flex flex-col min-w-0 flex-1', streamer.nextSlot.isLive ? 'gap-0.5' : '']">
                                    <span class="text-sm font-medium text-white truncate">
                                        {{ streamer.nextSlot.game.label }}
                                    </span>

                                    <!-- Live : barre de progression -->
                                    <template v-if="streamer.nextSlot.isLive">
                                        <div class="w-full h-1 rounded-full bg-zinc-700/60 overflow-hidden">
                                            <div class="h-full rounded-full bg-red-500/80 transition-all duration-1000"
                                                :style="{ width: `${getLiveProgress(streamer.nextSlot)}%` }" />
                                        </div>
                                        <span class="text-[10px] text-gray-400 font-medium">
                                            {{ formatTime(streamer.nextSlot.start_at) }} -> {{
                                                formatTime(streamer.nextSlot.end_at) }}
                                        </span>
                                    </template>

                                    <!-- Aujourd'hui -->
                                    <template v-else-if="streamer.nextSlot.isToday">
                                        <span class="text-xs flex items-center gap-1">
                                            <span class="text-purple-400/80 font-medium">Aujourd'hui</span>
                                            <span class="text-zinc-500">-</span>
                                            <span class="text-zinc-400">
                                                {{ formatTime(streamer.nextSlot.start_at) }}
                                            </span>
                                        </span>
                                    </template>

                                    <!-- Demain -->
                                    <template v-else-if="streamer.nextSlot.isTomorrow">
                                        <span class="text-xs flex items-center gap-1 text-zinc-400">
                                            <span class="font-medium">Demain</span>
                                            <span class="text-zinc-500">-</span>
                                            <span class="text-zinc-400">
                                                {{ formatTime(streamer.nextSlot.start_at) }}
                                            </span>
                                        </span>
                                    </template>

                                    <!-- Autre jour -->
                                    <template v-else>
                                        <span class="text-xs flex items-center gap-1 text-zinc-400">
                                            <span class="font-medium">{{ streamer.nextSlot.day }}</span>
                                            <span class="text-zinc-500">-</span>
                                            <span class="text-zinc-400">
                                                {{ formatTime(streamer.nextSlot.start_at) }}
                                            </span>
                                        </span>
                                    </template>
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
                </div>
            </template>
        </Card>
    </NuxtLink>
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

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval>

onMounted(() => {
    timer = setInterval(() => {
        now.value = Date.now()
    }, 10000)
})

onUnmounted(() => clearInterval(timer))

function getLiveProgress(slot: any) {
    const start = slot.slotDate.getTime()
    const end = slot.endDate.getTime()
    return Math.min(100, Math.max(0, ((now.value - start) / (end - start)) * 100))
}
</script>