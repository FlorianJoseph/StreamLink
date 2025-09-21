<template>
    <div class="w-full mx-auto">
        <a href="https://twitch.tv/nordik_saga" target="_blank">
            <button
                class="flex items-center w-full bg-white text-black font-semibold rounded-lg px-3 py-5 hover:bg-gray-100 transition">
                <!-- Icône ou image à gauche -->
                <div class="absolute flex items-center">
                    <Twitch class="text-purple-600" />
                </div>
                <!-- Texte centré -->
                <span class="mx-auto font-medium">Twitch</span>
            </button>
        </a>
    </div>
    <div class="w-full mx-auto">
        <a href="https://youtube.com/@nordik_saga" target="_blank">
            <button
                class="flex items-center w-full bg-white text-black font-semibold rounded-lg px-3 py-5 hover:bg-gray-100 transition">
                <!-- Icône ou image à gauche -->
                <div class="absolute flex items-center">
                    <Youtube class="text-red-600" />
                </div>
                <!-- Texte centré -->
                <span class="mx-auto font-medium">YouTube</span>
            </button>
        </a>
    </div>
</template>

<script setup>
import { Twitch, Youtube } from "lucide-vue-next";

const links = ref([
    { id: 1, label: 'Twitch', icon: '/icons/twitch.png', url: 'https://twitch.tv/Streamer123' },
    { id: 2, label: 'YouTube', icon: '/icons/youtube.png', url: 'https://youtube.com/Streamer123' },
    { id: 3, label: 'TikTok', icon: '/icons/tiktok.png', url: 'https://tiktok.com/@Streamer123' },
])
</script>