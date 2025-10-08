<template>
    <div class="flex flex-col gap-3">
        <!-- 🔍 Barre de recherche -->
        <InputText v-model="query" placeholder="Rechercher une icône..." class="w-full" />

        <!-- 🧩 Grille d’icônes (2 lignes max avec scroll) -->
        <div class="grid grid-cols-5 gap-3 justify-items-center overflow-y-auto p-2 bg-gray-800/30 rounded-lg"
            style="max-height: 7.5rem;">
            <button v-for="icon in filteredIcons" :key="icon.name" @click="select(icon.name)"
                class="p-2 rounded-lg border transition flex flex-col items-center justify-center text-gray-300" :class="{
                    'border-contrast bg-contrast/10 text-contrast': modelValue === icon.name,
                    'border-transparent hover:border-contrast/50 hover:text-white': modelValue !== icon.name
                }">
                <component :is="icon.component" class="w-6 h-6 mb-1" />
                <span class="text-xs truncate">{{ icon.name }}</span>
            </button>
        </div>
    </div>

                                    <!-- Sélection d’icônes -->
                                <!-- <div class="flex flex-col gap-2">
                                    <label>Icône</label>
                                    <IconPicker v-model="form.icon" />
                                </div> -->
</template>

<script setup>
import {
    Twitch,
    Youtube,
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    Gamepad2,
    Music,
    Globe,
    Link2,
    ShoppingBag,
    Crown,
    Heart
} from 'lucide-vue-next'

const props = defineProps({
    modelValue: String
})
const emit = defineEmits(['update:modelValue', 'select'])

const query = ref('')

/* 🎨 Liste à plat */
const icons = [
    { name: 'twitch', component: Twitch },
    { name: 'youtube', component: Youtube },
    { name: 'instagram', component: Instagram },
    { name: 'twitter', component: Twitter },
    { name: 'facebook', component: Facebook },
    { name: 'linkedin', component: Linkedin },
    { name: 'gaming', component: Gamepad2 },
    { name: 'website', component: Globe },
    { name: 'music', component: Music },
    { name: 'shop', component: ShoppingBag },
    { name: 'vip', component: Crown },
    { name: 'favorite', component: Heart },
    { name: 'link', component: Link2 },
]

/* 🔎 Recherche */
const filteredIcons = computed(() => {
    if (!query.value) return icons
    const lower = query.value.toLowerCase()
    return icons.filter(icon => icon.name.toLowerCase().includes(lower))
})

/* 🖱️ Sélection */
const select = (name) => {
    emit('update:modelValue', name)
    emit('select', name)
}
</script>

<style scoped>
button {
    transition: all 0.15s ease-in-out;
}

/* Barre de défilement discrète */
div::-webkit-scrollbar {
    width: 6px;
}

div::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
}

div::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
}
</style>
