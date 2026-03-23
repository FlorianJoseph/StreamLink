<template>
    <div id="scheduleCardMobile" class="export-footer rounded-lg" :style="{
        backgroundColor: scheduleBgColor,
        backgroundImage: schedule?.style?.backgroundUrl ? `url(${schedule.style.backgroundUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '1080px',
        height: '1920px',
        padding: '80px 60px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
    }">
        <!-- Overlay image de fond -->
        <div v-if="schedule?.style?.backgroundUrl" class="absolute inset-0" :style="{
            backgroundColor: `rgba(0,0,0,${1 - backgroundOpacity / 100})`
        }" />

        <!-- Header -->
        <div class="relative z-10 flex flex-col gap-2 text-center">
            <h1 class="font-bold truncate" :style="{
                color: scheduleTextColor,
                fontSize: '80px',
                textShadow: '0 0 2px rgba(0,0,0,0.8)',
                lineHeight: '1.1'
            }">
                {{ schedule?.title }}
            </h1>
            <p class="font-semibold truncate" :style="{
                color: scheduleTextColor,
                fontSize: '36px',
                opacity: 0.8,
                textShadow: '0 0 2px rgba(0,0,0,0.8)'
            }">
                {{ schedule?.subtitle }}
            </p>
        </div>

        <!-- Jours -->
        <div class="relative z-10 flex flex-col gap-6 flex-1">
            <template v-for="day in daysOptions" :key="day.label">
                <div v-if="slotsForDay(day.label).length > 0" class="flex flex-col gap-3">
                    <!-- Nom du jour -->
                    <div class="flex items-center gap-4">
                        <span class="font-bold" :style="{
                            color: scheduleTextColor,
                            fontSize: '40px',
                            textShadow: '0 0 2px rgba(0,0,0,0.8)'
                        }">
                            {{ day.label }}
                        </span>
                        <div class="flex-1 h-px opacity-30" :style="{ backgroundColor: scheduleTextColor }" />
                    </div>
                    <!-- Créneaux -->
                    <div class="flex flex-col gap-2">
                        <div v-for="slot in slotsForDay(day.label)" :key="slot.id"
                            class="flex items-center gap-4 px-5 py-4 rounded-xl" :style="{
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderLeft: `6px solid #${slot.color}`
                            }">
                            <img v-if="slot.game?.cover" :src="slot.game.cover"
                                style="width: 48px; height: 64px; border-radius: 6px; object-fit: cover; flex-shrink: 0" />
                            <div v-else style="width: 48px; height: 64px; flex-shrink: 0" />
                            <span class="font-semibold truncate flex-1" :style="{
                                color: scheduleTextColor,
                                fontSize: '34px',
                                textShadow: '0 0 2px rgba(0,0,0,0.8)'
                            }">
                                {{ slot.game?.label }}
                            </span>
                            <span :style="{
                                color: scheduleTextColor,
                                fontSize: '30px',
                                flexShrink: 0,
                                opacity: 0.8
                            }">
                                {{ formatTime(slot.start_at) }}
                            </span>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Footer branding -->
        <div class="absolute z-20" style="bottom: 60px; right: 60px">
            <div style="text-align: right; line-height: 1.1; font-family: Inter, sans-serif">
                <div
                    style="font-size: 18px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.7); text-shadow: 0 1px 3px #000">
                    Made with
                </div>
                <div
                    style="font-size: 22px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.9); text-shadow: 0 1px 3px #000">
                    StreamLink
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    schedule: any
    slots: any[]
    daysOptions: any[]
    scheduleBgColor: string
    scheduleTextColor: string
    backgroundOpacity: number
    formatTime: (time: string) => string
    slotsForDay: (day: string) => any[]
}>()
</script>