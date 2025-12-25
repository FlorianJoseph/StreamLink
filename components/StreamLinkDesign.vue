    <template>
        <div class="flex flex-col gap-4 ">
            <!-- En-tête -->
            <div class="py-4">
                <div class="flex flex-col lg:items-start items-center justify-end">
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                        Personnaliser mon StreamLink
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center lg:text-left max-w-xl">
                        Choisissez vos couleurs, polices et styles pour refléter votre identité
                    </p>
                </div>
            </div>
            <!-- Barre d'outils -->
            <Menubar class="sticky top-20 z-10">
                <template #start>
                    <Button severity="secondary" :disabled="!isDirty" @click="resetDesign">
                        <Icon name="lucide:rotate-ccw" size="20" />
                        <span>Annuler les modifications</span>
                    </Button>
                </template>
                <template #end>
                    <div class="flex items-center gap-2 sticky top-16 z-10">
                        <Button severity="secondary" :disabled="!history.length" @click="undo">
                            <Icon name="lucide:undo" size="20" />
                        </Button>
                        <Button severity="secondary" :disabled="!future.length" @click="redo">
                            <Icon name="lucide:redo" size="20" />
                        </Button>
                        <Button severity="contrast" :disabled="!isDirty" @click="saveDesign">
                            <Icon name="lucide:save" size="20" />
                            <span>Sauvegarder</span>
                        </Button>
                    </div>
                </template>
            </Menubar>
            <!-- Header -->
            <div class="flex justify-center gap-4 flex-col w-full lg:w-lg xl:w-2xl 2xl:w-2xl">
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:square-user" size="24" />
                            <span class="font-semibold">En-tête</span>
                        </div>
                    </template>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-4">
                            <AvatarUploader />
                            <AvatarUploaderButton />
                        </div>
                        <!-- <p class="font-semibold mb-2">Forme de l'image</p>
                        <div class="flex justify-center gap-2 w-full">
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                <Icon name="lucide:circle-user-round" size="20" />Ronde
                            </Button>
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                <Icon name="lucide:square-user-round" size="20" />Carrée
                            </Button>
                        </div> -->
                        <div class="flex flex-col gap-2">
                            <p class="font-semibold">Taille du pseudo</p>
                            <div class="flex justify-center gap-2 w-full">
                                <Button variant="outlined" severity="contrast" class="flex-1"
                                    @click="updateSection('username_style', { size: 'normal' })">
                                    Normale
                                </Button>
                                <Button variant="outlined" severity="contrast" class="flex-1"
                                    @click="updateSection('username_style', { size: 'medium' })">
                                    Moyen
                                </Button>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="font-semibold">Couleurs</p>
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                <div class="flex-1 flex flex-row items-center justify-between">
                                    <span>Pseudo</span>
                                    <div class="flex items-center gap-2">
                                        <ColorPicker v-model="usernameColorLocal" format="hex" />
                                        <span class="text-sm font-medium">#{{ usernameColorLocal }}</span>
                                        <Icon name="lucide:chevron-right" size="20" />
                                    </div>
                                </div>
                            </Button>
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                <div class="flex-1 flex flex-row items-center justify-between">
                                    <span>Description</span>
                                    <div class="flex items-center gap-2">
                                        <ColorPicker v-model="descriptionColorLocal" format="hex" />
                                        <span class="text-sm font-medium">#{{ descriptionColorLocal }}</span>
                                        <Icon name="lucide:chevron-right" size="20" />
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </Fieldset>
                <!-- Boutons -->
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:stretch-horizontal" size="24" />
                            <span class="font-semibold">Boutons</span>
                        </div>
                    </template>
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <p class="font-semibold mb-2">Style</p>
                            <div class="flex justify-center gap-2 w-full">
                                <Button severity="contrast" class="flex-1"
                                    @click="updateSection('button_style', { variant: 'filled' })">
                                    Plein
                                </Button>
                                <Button variant="outlined" severity="contrast" class="flex-1"
                                    @click="updateSection('button_style', { variant: 'outlined' })">
                                    Bordure
                                </Button>
                            </div>
                        </div>
                        <Divider />
                        <div class="flex flex-row items-center gap-8 justify-between">
                            <p class="font-semibold">Corners</p>
                            <div class="flex items-center gap-6 w-2/3">
                                <span>Carré</span>
                                <div class="relative w-full">
                                    <!-- Label au-dessus du curseur -->
                                    <span
                                        class="absolute -top-8 text-xs opacity-70 whitespace-nowrap transition-transform"
                                        :style="{ left: `${cornerValue}%`, transform: 'translateX(-50%)' }">
                                        {{ valueToLabel[cornerValue] }}
                                    </span>
                                    <Slider v-model="cornerValue" :step="25" :min="0" :max="100" class="w-full"
                                        style="--p-slider-handle-focus-ring-color: none;--p-slider-range-background: #fff" />
                                </div>
                                <span>Arrondi</span>
                            </div>
                        </div>
                        <Divider />
                        <div class="flex flex-col gap-2">
                            <p class="font-semibold">Couleurs</p>
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                <div class="flex-1 flex flex-row items-center justify-between">
                                    <span>Bouton</span>
                                    <div class="flex items-center gap-2">
                                        <ColorPicker v-model="buttonBgColorLocal" format="hex" />
                                        <span class="text-sm font-medium">#{{ buttonBgColorLocal }}</span>
                                        <Icon name="lucide:chevron-right" size="20" />
                                    </div>
                                </div>
                            </Button>
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                <div class="flex-1 flex flex-row items-center justify-between">
                                    <span>Texte</span>
                                    <div class="flex items-center gap-2">
                                        <ColorPicker v-model="buttonTextColorLocal" format="hex" />
                                        <span class="text-sm font-medium">#{{ buttonTextColorLocal }}</span>
                                        <Icon name="lucide:chevron-right" size="20" />
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </Fieldset>
                <!-- Arrière-plan -->
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:images" size="24" />
                            <span class="font-semibold">Arrière-plan</span>
                        </div>
                    </template>
                    <div>
                        <p class="font-semibold mb-2">Motif</p>

                        <p class="font-semibold mb-2">Couleur</p>
                        <div class="flex flex-row gap-2">
                        </div>
                    </div>
                </Fieldset>
                <!-- Thème -->
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:panels-top-left" size="24" />
                            <span class="font-semibold">Thème</span>
                        </div>
                    </template>
                    <div class="flex flex-wrap justify-center gap-4">
                        <Card style="--p-card-background:#ffff" class="h-30 w-25"></Card>
                        <Card style="--p-card-background:brown" class="h-30 w-25"></Card>
                        <Card style="--p-card-background:blue" class="h-30 w-25"></Card>
                        <Card style="--p-card-background:yellow" class="h-30 w-25"></Card>
                        <Card style="--p-card-background:orange" class="h-30 w-25"></Card>
                    </div>
                </Fieldset>
            </div>
        </div>
    </template>

<script setup>
const designStore = useDesignStore()
const { updateSection } = designStore
const { undo, redo, saveDesign, resetDesign } = designStore
const { history, future, isDirty, design } = storeToRefs(designStore)

// Conversion entre labels et valeurs des coins
const radiusToValue = {
    'rounded-none': 0,
    'rounded-md': 25,
    'rounded-lg': 50,
    'rounded-xl': 75,
    'rounded-full': 100,
}

const valueToLabel = {
    25: 'Léger',
    50: 'Moyen',
    75: 'Arrondi léger',
}

const valueToRadius = {
    0: 'rounded-none',
    25: 'rounded-md',
    50: 'rounded-lg',
    75: 'rounded-xl',
    100: 'rounded-full',
}

// Liaison directe de la valeur des coins
const cornerValue = computed({
    get() {
        const radius = design.value?.button_style?.borderRadius ?? 'rounded-lg'
        return radiusToValue[radius] ?? 75
    },
    set(value) {
        designStore.updateSection('button_style', {
            borderRadius: valueToRadius[value],
        })
    },
})

const { localValue: usernameColorLocal } = useDebouncedColor(
    'username_style',
    'textColor',
    design,
    designStore,
    { defaultValue: 'ffffff' }
)

const { localValue: descriptionColorLocal } = useDebouncedColor(
    'bio_style',
    'textColor',
    design,
    designStore,
    { defaultValue: 'ffffff' }
)

const { localValue: buttonTextColorLocal } = useDebouncedColor(
    'button_style',
    'textColor',
    design,
    designStore,
    { defaultValue: '000000' }
)

const { localValue: buttonBgColorLocal } = useDebouncedColor(
    'button_style',
    'backgroundColor',
    design,
    designStore,
    { defaultValue: 'ffffff' }
)



// Avertir l'utilisateur en cas de modifications non sauvegardées
onBeforeRouteLeave(() => {
    if (isDirty.value) {
        return confirm('Vous avez des modifications non sauvegardées')
    }
})

</script>