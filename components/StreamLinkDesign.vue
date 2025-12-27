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
                        <div class="flex flex-col gap-2">
                            <p class="font-semibold">Taille du pseudo</p>
                            <div class="flex justify-center gap-2 w-full">
                                <Button variant="outlined" severity="contrast" class="flex-1 transition"
                                    :class="{ 'ring-2 ring-white ring-offset-2 ring-offset-black': isUsernameNormal }"
                                    @click="updateSection('username_style', { size: 'normal' })">
                                    Normale
                                </Button>
                                <Button variant="outlined" severity="contrast" class="flex-1 transition"
                                    :class="{ 'ring-2 ring-white ring-offset-2 ring-offset-black': isUsernameMedium }"
                                    @click="updateSection('username_style', { size: 'medium' })">
                                    Moyen
                                </Button>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="font-semibold">Couleurs</p>
                            <div class="flex justify-center gap-2 w-full sm:flex-row flex-col">
                                <InputGroup class="flex-1" @click="openPicker(usernameColorPicker, 'username')">
                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                        <div class="flex items-center gap-2">
                                            <span>Pseudo</span>
                                            <ColorPicker ref="usernameColorPicker" v-model="usernameColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="usernameColorLocal" :invalid="!usernameColorLocal"
                                        style="--p-inputtext-focus-border-color:white" />
                                </InputGroup>
                                <InputGroup class="flex-1" @click="openPicker(descriptionColorPicker, 'description')">
                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                        <div class="flex items-center gap-2">
                                            <span>Description</span>
                                            <ColorPicker ref="descriptionColorPicker" v-model="descriptionColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="descriptionColorLocal" :invalid="!descriptionColorLocal"
                                        style="--p-inputtext-focus-border-color:white" />
                                </InputGroup>
                            </div>
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
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <ThemePreviewCard v-for="(theme, key) in THEME_PRESETS" :key="key" :theme="theme"
                            @click="designStore.applyTheme(theme)" :isSelected="isThemeActive(theme).value" />
                    </div>
                </Fieldset>
                <!-- Arrière-plan -->
                <Fieldset style=" --p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:images" size="24" />
                            <span class="font-semibold">Arrière-plan</span>
                        </div>
                    </template>
                    <div class="flex flex-col gap-4">
                        <InputGroup class="flex-1" @click="openPicker(wallpaperColorPicker, 'wallpaper')">
                            <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                <div class="flex items-center gap-2">
                                    <span>Couleur</span>
                                    <ColorPicker ref="wallpaperColorPicker" v-model="wallpaperColorLocal" format="hex"
                                        @click.stop style="--p-colorpicker-preview-focus-ring-color :none" />
                                </div>
                            </InputGroupAddon>
                            <InputText v-model="wallpaperColorLocal" :invalid="!wallpaperColorLocal"
                                style="--p-inputtext-focus-border-color:white" />
                        </InputGroup>
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
                                <Button severity="contrast" class="flex-1 transition"
                                    :class="{ 'ring-2 ring-white ring-offset-2 ring-offset-black': isFilled }"
                                    @click="updateSection('button_style', { variant: 'filled' })">
                                    Plein
                                </Button>
                                <Button variant="outlined" severity="contrast" class="flex-1 transition"
                                    :class="{ 'ring-2 ring-white ring-offset-2 ring-offset-black': isOutlined }"
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
                            <div class="flex justify-center gap-2 w-full sm:flex-row flex-col">
                                <InputGroup class="flex-1" @click="openPicker(buttonBgColorPicker, 'buttonBg')">
                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                        <div class="flex items-center gap-2">
                                            <span>Bouton</span>
                                            <ColorPicker ref="buttonBgColorPicker" v-model="buttonBgColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="buttonBgColorLocal" :invalid="!buttonBgColorLocal"
                                        style="--p-inputtext-focus-border-color:white" />
                                </InputGroup>
                                <InputGroup class="flex-1" @click="openPicker(buttonTextColorPicker, 'buttonText')">
                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                        <div class="flex items-center gap-2">
                                            <span>Texte</span>
                                            <ColorPicker ref="buttonTextColorPicker" v-model="buttonTextColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="buttonTextColorLocal" :invalid="!buttonTextColorLocal"
                                        style="--p-inputtext-focus-border-color:white" />
                                </InputGroup>
                            </div>
                        </div>
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

// Couleurs locales avec debounce
const { localValue: usernameColorLocal } = useDebouncedColor(
    'username_style',
    'textColor',
    design,
    designStore,
    { defaultValue: 'ffffff' }
)

const pickersOpenState = reactive({
    username: false,
    description: false,
    wallpaper: false,
    buttonBg: false,
    buttonText: false,
})
const usernameColorPicker = ref(null)
const descriptionColorPicker = ref(null)
const wallpaperColorPicker = ref(null)
const buttonBgColorPicker = ref(null)
const buttonTextColorPicker = ref(null)

const openPicker = (pickerRef, key) => {
    const input = pickerRef?.$el?.querySelector('input')

    if (pickersOpenState[key]) {
        input.blur()
        pickersOpenState[key] = false
    } else {
        nextTick(() => {
            input.focus()
            input.click()
            pickersOpenState[key] = true
        })
    }
}

const { localValue: descriptionColorLocal } = useDebouncedColor(
    'bio_style',
    'textColor',
    design,
    designStore,
    { defaultValue: 'd4d4d8' }
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

const { localValue: wallpaperColorLocal } = useDebouncedColor(
    'wallpaper_style',
    'backgroundColor',
    design,
    designStore,
    { defaultValue: '18181B' }
)

// Si j'ustilise le preview des wallpapers

// const wallpaperColor = computed(() => {
//     const color = design.value?.wallpaper_style?.backgroundColor ?? '18181B'
//     return `#${color}`
// })

const { isActive, isThemeActive } = useDesignActive(design)

const isUsernameNormal = isActive('username_style', 'size', 'normal')
const isUsernameMedium = isActive('username_style', 'size', 'medium')
const isFilled = isActive('button_style', 'variant', 'filled')
const isOutlined = isActive('button_style', 'variant', 'outlined')

// Avertir l'utilisateur en cas de modifications non sauvegardées
onBeforeRouteLeave(() => {
    if (isDirty.value) {
        return confirm('Vous avez des modifications non sauvegardées')
    }
})

</script>