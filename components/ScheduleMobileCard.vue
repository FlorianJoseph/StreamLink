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
        fontFamily: schedule?.style?.fontFamily
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
                textShadow: '0 0 2px rgba(0,0,0,0.8)',
            }">
                {{ schedule?.subtitle }}
            </p>
        </div>

        <!-- Jours -->
        <div class="relative z-10 flex flex-col gap-8 flex-1">
            <template v-for="day in daysOptions" :key="day.label">
                <div v-if="slotsForDay(day.label).length > 0" class="flex gap-5 items-start">

                    <!-- Jour en badge vertical à gauche -->
                    <div class="flex flex-col items-center flex-shrink-0 pt-2" style="width: 80px">
                        <span class="font-bold" :style="{
                            color: scheduleTextColor,
                            fontSize: '28px',
                            lineHeight: '1',
                            textShadow: '0 0 2px rgba(0,0,0,0.8)',
                            opacity: 0.9,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }">
                            {{ day.label.slice(0, 3) }}
                        </span>
                    </div>

                    <!-- Créneaux -->
                    <div class="flex flex-col gap-3 flex-1">
                        <div v-for="slot in slotsForDay(day.label)" :key="slot.id"
                            class="relative overflow-hidden rounded-2xl" :style="{
                                height: '160px',
                                border: `3px solid #${slot.color}`,
                            }">
                            <!-- Image de fond du jeu -->
                            <img v-if="slot.game?.cover" :src="slot.game.cover"
                                style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center" />

                            <!-- Overlay gradient -->
                            <div
                                style="position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)" />

                            <!-- Contenu -->
                            <div
                                style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 20px 30px; gap: 8px">
                                <!-- Titre du stream -->
                                <span v-if="titleVisible && slot.title" :style="{
                                    color: 'white',
                                    fontSize: '42px',
                                    fontWeight: '800',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                                    lineHeight: '1.1',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '1',
                                    WebkitBoxOrient: 'vertical'
                                }">
                                    {{ slot.title }}
                                </span>
                                <!-- Heure + Jeu -->
                                <div :style="{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: 'white',
                                    fontSize: '24px',
                                    fontWeight: '500',
                                    opacity: 0.7,
                                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em'
                                }">
                                    <Icon name="lucide:clock" size="24" style="flex-shrink: 0" />
                                    <span>{{ formatTime(slot.start_at) }}<span v-if="endTimeVisible"> – {{
                                        formatTime(slot.end_at) }}</span></span>
                                    <Icon v-if="slot.game?.label" name="lucide:gamepad-2" size="24"
                                        style="flex-shrink: 0" />
                                    <span v-if="slot.game?.label" class="truncate">{{ slot.game?.label }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Footer branding -->
        <div v-if="showBranding !== false" class="absolute z-20" style="bottom: 60px; right: 60px">
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
    endTimeVisible: boolean
    titleVisible: boolean
    showBranding?: boolean
    formatTime: (time: string) => string
    slotsForDay: (day: string) => any[]
}>()
</script>