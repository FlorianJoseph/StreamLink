<template>
    <div v-if="visible" class="bg-indigo-600 sm:mt-13">
        <div class="bg-surface-900 text-surface-100 py-4 px-6 lg:px-20 flex justify-between items-center flex-wrap">
            <div class="flex inline-flex gap-1 items-center">
                <Icon name="lucide:star" size="18" />
                <span class="font-bold text-lg">Nouveauté</span>
            </div>
            <div>
                <div class="inline-flex gap-1 items-center">
                    <span class="hidden lg:flex leading-normal">
                        Personnalisez votre StreamLink avec notre toute nouvelle page de
                    </span>
                    <NuxtLink to="/admin/design" class="text-surface-0 underline font-bold">Design
                    </NuxtLink>
                </div>
            </div>
            <Button @click="closeBanner" rounded severity="contrast" variant="text">
                <Icon name="lucide:x" size="20" />
            </Button>
        </div>
    </div>
</template>

<script setup>
const STORAGE_KEY = 'newDesign'
const visible = ref(true)

const closeBanner = () => {
    visible.value = false
    localStorage.setItem(STORAGE_KEY, 'true')
}

onMounted(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
        visible.value = false
    }
})

</script>
