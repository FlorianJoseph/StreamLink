<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else>
        <div class="flex flex-col gap-4 fade-in">
            <div class="py-4">
                <div class="flex flex-col lg:items-start items-center">
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                        Planning
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center lg:text-left max-w-xl">
                        Crée et partage ton planning hebdomadaire
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div class="lg:col-span-1">
                    <!-- Configuration du planning -->
                    <Fieldset
                        style=" --p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem; margin-top: -1.3rem;">
                        <template #legend>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:settings" size="24" />
                                <span class="font-semibold">Configuration</span>
                            </div>
                        </template>
                        <Button label="Ajouter un créneau" severity="contrast">
                            <Icon name="lucide:plus" size="18" />
                            <span>Ajouter un créneau</span>
                        </Button>
                    </Fieldset>
                    <!-- Design du planning -->
                    <Fieldset style=" --p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                        <template #legend>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:palette" size="24" />
                                <span class="font-semibold">Design</span>
                            </div>
                        </template>
                        <p class="font-semibold mb-2">Arrière-plan</p>
                        <div class="flex flex-col gap-2 mb-4">
                            <InputGroup class="flex-1">
                                <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm sm:text-base lg:text-sm xl:text-base">Couleur</span>
                                        <ColorPicker ref="bgColorPicker" v-model="scheduleBgColorLocal" format="hex"
                                            @click.stop style="--p-colorpicker-preview-focus-ring-color :none" />
                                    </div>
                                </InputGroupAddon>
                                <InputText v-model="scheduleBgColorLocal" @blur="onBgColorBlur"
                                    style="--p-inputtext-focus-border-color:white" maxlength="7"
                                    :invalid="!isBgColorValid"
                                    :style="{ color: !isBgColorValid ? '#f87171' : '#ffffff' }" />
                            </InputGroup>
                            <div class="flex flex-col gap-2">
                                Image de fond
                                <div>
                                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*"
                                        :maxFileSize="1000000" @upload="" :auto="true" chooseLabel="Choisir une image"
                                        severity="contrast" />
                                </div>
                            </div>
                        </div>
                        <p class="font-semibold mb-2">Texte</p>
                        <div class="flex flex-col gap-2 mb-4">
                            <InputGroup class="flex-1">
                                <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm sm:text-base lg:text-sm xl:text-base">Couleur</span>
                                        <ColorPicker ref="textColorPicker" v-model="scheduleTextColorLocal" format="hex"
                                            @click.stop style="--p-colorpicker-preview-focus-ring-color :none" />
                                    </div>
                                </InputGroupAddon>
                                <InputText v-model="scheduleTextColorLocal" @blur="onTextColorBlur"
                                    style="--p-inputtext-focus-border-color:white" maxlength="7"
                                    :invalid="!isTextColorValid"
                                    :style="{ color: !isTextColorValid ? '#f87171' : '#ffffff' }" />
                            </InputGroup>
                        </div>
                    </Fieldset>
                </div>
                <div class="lg:col-span-3 flex flex-col gap-4">
                    <!-- Barre d'outils -->
                    <Menubar>
                        <template #start>
                            <Button severity="secondary" @click="previewSchedule">
                                <Icon name="lucide:eye" size="18" />
                                <span
                                    class="hidden sm:inline text-xs md:text-base lg:text-xs xl:text-base whitespace-nowrap">Voir
                                    le rendu final</span>
                            </Button>
                        </template>
                        <template #end>
                            <div class="flex items-center gap-1 sm:gap-2">
                                <Button severity="secondary">
                                    <Icon name="lucide:share" size="18" />
                                    <span
                                        class="hidden sm:inline text-xs md:text-base lg:text-xs xl:text-base">Partager</span>
                                </Button>
                                <Button severity="contrast" @click="exportSchedule">
                                    <Icon name="lucide:download" size="18" />
                                    <span class="text-xs md:text-base lg:text-xs xl:text-base">Télécharger</span>
                                </Button>
                            </div>
                        </template>
                    </Menubar>
                    <!-- Planning hebdomadaire -->
                    <ScheduleView />
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="showPreview" dismissableMask modal :style="{ width: '65vw' }" :draggable="false">
        <template #container="{ closeCallback }">
            <img v-if="previewDataUrl" :src="previewDataUrl" class="w-full h-auto" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">

const scheduleStore = useScheduleStore()
const { loading } = storeToRefs(scheduleStore)

const {
    value: scheduleBgColorLocal,
    isValid: isBgColorValid,
    handleBlur: onBgColorBlur
} = useScheduleColor(scheduleStore, 'bgColor')

const {
    value: scheduleTextColorLocal,
    isValid: isTextColorValid,
    handleBlur: onTextColorBlur
} = useScheduleColor(scheduleStore, 'textColor')

onMounted(async () => {
    await scheduleStore.getOrCreateSchedule()
})

definePageMeta({
    layout: 'fullscreen'
})

const {
    previewSchedule,
    exportSchedule,
    previewDataUrl,
    showPreview
} = useScheduleScreenshot()

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
