<template>
    <div class="w-full mx-auto" v-for="link in links" :key="link.id">
        <a :href="link.url" target="_blank">
            <button
                class="flex items-center w-full bg-white text-black font-semibold rounded-lg px-3 py-5 hover:bg-gray-100 transition">
                <!-- Icône ou image à gauche -->
                <div class="absolute flex items-center">
                    <Twitch class="text-purple-600" />
                </div>
                <!-- Texte centré -->
                <span class="mx-auto font-medium">{{ link.title }}</span>
            </button>
        </a>
    </div>
</template>

<script setup>
import { Twitch } from "lucide-vue-next";

const { links } = useLink();
</script>