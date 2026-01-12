<template>
    <div class="min-h-screen px-4 md:px-8 pt-18">

        <div class="py-4">
            <div class="flex flex-col lg:items-start items-center justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                    Dashboard
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center lg:text-left max-w-xl">
                    Bienvenue, {{ streamer?.username || 'Streameur' }}
                </p>
            </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
            <!-- Colonne gauche - État du profil -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Carte État du profil -->
                <ProfileStatus />
            </div>

            <!-- Colonne droite -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Carte -->
                <Card class="border border-zinc-700">
                    <template #header>
                    </template>
                    <template #content>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup>
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)
const user = useSupabaseUser()

// Charger les données du streamer
watch(user, async (val) => {
    if (val) {
        await streamerStore.fetchStreamer(val.sub)
    }
}, { immediate: true })

definePageMeta({
    layout: 'landing'
})
</script>