<script setup lang="ts">
defineProps<{
    title?: string
    description?: string,
    avatar?: string
}>()
</script>

<template>
    <div class="flex w-full h-full bg-primary relative overflow-hidden" :style="{ fontFamily: 'Plus Jakarta Sans' }">

        <!-- Pattern de fond -->
        <img src="/images/assets/charmi-pattern-blanc.svg" class="absolute opacity-4" :style="{
            objectFit: 'contain',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
        }" />

        <!-- Colonne gauche -->
        <div class="flex flex-col justify-between p-16 w-3/5 z-10">
            <img src="/images/logo/charmi-full-blanc.svg" class="w-56" />

            <div class="flex flex-col">
                <h1 class="text-5xl font-bold text-white leading-tight m-0">
                    {{ title || 'Le compagnon des streamers Twitch.' }}
                </h1>
                <p class="text-2xl text-white opacity-70 mt-4 m-0">
                    {{ description || 'Découverte, raids, planning et page de liens.' }}
                </p>
            </div>

            <span class="text-white opacity-50 text-lg">charmi.gg</span>
        </div>

        <!-- Mascotte droite -->
        <div class="flex items-center justify-center w-2/5 z-10">
            <img v-if="avatar" :src="avatar" class="w-64 h-64 rounded-full object-cover" />
            <img v-else src="/images/mascotte/charmi-happy-blanc.svg" class="w-72 h-72" />
        </div>

    </div>
</template>