<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else>
        <div v-if="!streamer">
            <StreamLinkCreate />
        </div>
        <div v-else
            class="flex flex-col lg:flex-row sm:max-w-4xl lg:max-w-5xl xl:max-w-full sm:gap-6 lg:gap-12 xl:gap-24 2xl:gap-42 fade-in">
            <!-- Édition du streamlink -->
            <div class="flex-1 lg:flex-[2] min-w-0">
                <StreamLinkDesign />
            </div>
            <div class="hidden lg:block">
                <Divider layout="vertical" />
            </div>
            <div class="lg:hidden block">
                <Divider />
            </div>
            <!-- Aperçu du streamlink -->
            <div class="sticky top-21 lg:self-start mx-auto">
                <StreamLinkPreview />
            </div>
        </div>
    </div>
</template>

<script setup>
// Stores
const streamerStore = useStreamerStore()
const { streamer, loading } = storeToRefs(streamerStore)
const user = useSupabaseUser()

watch(user, async (val) => {
    if (val) {
        await streamerStore.fetchStreamer(val.sub)
    }
}, { immediate: true })

const items = ref([
    {
        label: 'En-tête',
        icon: 'lucide:square-user',
        key: 'header'
    },
    {
        label: 'Texte',
        icon: 'lucide:case-sensitive',
        key: 'text'
    },
    {
        label: 'Boutons',
        icon: 'lucide:stretch-horizontal',
        key: 'buttons'
    },
    {
        label: 'Arrière-plan',
        icon: 'lucide:images',
        key: 'background'
    },
    {
        label: 'Thème',
        icon: 'lucide:panels-top-left',
        key: 'theme'
    },
    {
        label: 'Couleurs',
        icon: 'lucide:palette',
        key: 'colors'
    }
])

</script>

<style scoped>
/* Petite animation d’apparition douce du contenu */
.fade-in {
    animation: fadeIn 0.4s ease forwards;
    opacity: 0;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}
</style>