    <template>
        <div class="flex flex-col gap-4">
            <!-- En-tête -->
            <div class="py-4">
                <div class="flex flex-col lg:items-start items-center justify-end">
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                        Personnaliser ma page de liens
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center lg:text-left max-w-xl text-gray-400" id="header">
                        Choisis tes couleurs et styles pour refléter ton identité
                    </p>
                </div>
            </div>
            <!-- Barre d'outils -->
            <Menubar class="sticky top-0 z-60 w-full lg:w-lg xl:w-2xl 2xl:w-2xl mx-auto">
                <template #start>
                    <Button severity="secondary" :disabled="!isDirty" @click="resetDesign">
                        <Icon name="lucide:rotate-ccw" size="18" />
                        <span
                            class="hidden sm:inline text-xs md:text-base lg:text-xs xl:text-base whitespace-nowrap">Annuler
                            les
                            modifications</span>
                    </Button>
                </template>
                <template #end>
                    <div class="flex items-center gap-1 sm:gap-2">
                        <Button severity="secondary" :disabled="!history.length" @click="undo">
                            <Icon name="lucide:undo" size="18" />
                        </Button>
                        <Button severity="secondary" :disabled="!future.length" @click="redo">
                            <Icon name="lucide:redo" size="18" />
                        </Button>
                        <Button severity="contrast" :disabled="!isDirty" @click="handleSave">
                            <Icon name="lucide:save" size="18" />
                            <span
                                class="hidden sm:inline text-xs md:text-base lg:text-xs xl:text-base">Enregistrer</span>
                        </Button>
                    </div>
                </template>
            </Menubar>
            <!-- <Menu :model="items" class="fixed top-45 left-5 z-50 2xl:block hidden">
                <template #item="{ item, props }">
                    <div v-bind="props.action" @click="scrollToSection(item.anchor)">
                        <Icon :name="item.icon" size="20" />
                        <span>{{ item.label }}</span>
                    </div>
                </template>
            </Menu> -->
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
                                    <span class="text-sm sm:text-base">Normal</span>
                                </Button>
                                <Button variant="outlined" severity="contrast" class="flex-1 transition"
                                    :class="{ 'ring-2 ring-white ring-offset-2 ring-offset-black': isUsernameMedium }"
                                    @click="updateSection('username_style', { size: 'medium' })">
                                    <span class="text-sm sm:text-base">Moyen</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Fieldset>

                <!-- Thème -->
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem" id="theme">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:panels-top-left" size="24" />
                            <span class="font-semibold">Thème</span>
                        </div>
                    </template>
                    <div
                        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-6 gap-4 justify-items-center">
                        <ThemePreviewCard v-for="(theme, key) in THEME_PRESETS" :key="key" :theme="theme"
                            @click="designStore.applyTheme(theme)" :isSelected="isThemeActive(theme).value"
                            :hasAccess="isSub || hasFeature('premium_theme')" />
                    </div>
                </Fieldset>

                <FeatureUnlockModal v-model="premiumThemeModal" featureKey="premium_theme" />

                <!-- Arrière-plan -->
                <Fieldset style=" --p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem"
                    id="background">
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
                                    <span class="text-sm sm:text-base lg:text-sm xl:text-base">Couleur</span>
                                    <ColorPicker ref="wallpaperColorPicker" v-model="wallpaperColorLocal" format="hex"
                                        @click.stop style="--p-colorpicker-preview-focus-ring-color :none" />
                                </div>
                            </InputGroupAddon>
                            <InputText v-model="wallpaperColorLocal"
                                @input="wallpaperColorLocal = wallpaperColorLocal.toUpperCase()"
                                style="--p-inputtext-focus-border-color:white" @blur="validateWallpaperColor"
                                maxlength="7" :style="{ color: !isWallpaperColorValid ? '#f87171' : '#ffffff' }"
                                :invalid="!isWallpaperColorValid" />
                        </InputGroup>
                    </div>
                </Fieldset>

                <!-- Texte -->
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:type" size="24" />
                            <span class="font-semibold">Texte</span>
                        </div>
                    </template>
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <p class="font-semibold">Police</p>
                            <button
                                class="flex items-center justify-between px-3 py-2.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all w-full"
                                @click="fontModal = true">
                                <span class="text-sm" :style="{ fontFamily: currentFont }">{{ currentFont ??
                                    'Inter' }}</span>
                                <Icon name="lucide:chevron-right" size="16" class="text-zinc-400" />
                            </button>
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="font-semibold">Couleurs</p>
                            <div class="flex justify-center gap-2 w-full sm:flex-row flex-col">
                                <InputGroup class="flex-1" @click="openPicker(usernameColorPicker, 'username')">
                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm sm:text-base lg:text-sm xl:text-base">Pseudo</span>
                                            <ColorPicker ref="usernameColorPicker" v-model="usernameColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="usernameColorLocal"
                                        @input="usernameColorLocal = usernameColorLocal.toUpperCase()"
                                        style="--p-inputtext-focus-border-color:white" @blur="validateUsernameColor"
                                        maxlength="7" :style="{ color: !isUsernameColorValid ? '#f87171' : '#ffffff' }"
                                        :invalid="!isUsernameColorValid" />
                                </InputGroup>
                                <InputGroup class="flex-1" @click="openPicker(descriptionColorPicker, 'description')">
                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="text-sm sm:text-base lg:text-sm xl:text-base">Description</span>
                                            <ColorPicker ref="descriptionColorPicker" v-model="descriptionColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="descriptionColorLocal"
                                        @input="descriptionColorLocal = descriptionColorLocal.toUpperCase()"
                                        style="--p-inputtext-focus-border-color:white" @blur="validateDescriptionColor"
                                        maxlength="7"
                                        :style="{ color: !isDescriptionColorValid ? '#f87171' : '#ffffff' }"
                                        :invalid="!isDescriptionColorValid" />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                </Fieldset>

                <!-- Modal polices -->
                <Dialog v-model:visible="fontModal" modal dismissableMask header="Choisir une police"
                    :style="{ width: '32rem', margin: '1rem' }" :draggable="false">
                    <div class="grid grid-cols-2 gap-2">
                        <button v-for="font in FONTS" :key="font.name"
                            class="relative flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all"
                            :class="currentFont === font.name
                                ? 'border-white bg-white/10'
                                : 'border-zinc-700 hover:border-zinc-500'" @click="onFontClick(font)">
                            <span class="text-sm" :style="{ fontFamily: font.name }">{{ font.label }}</span>
                            <span v-if="font.premium && !isSub && !hasFeature('premium_theme')"
                                class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                                Premium
                            </span>
                        </button>
                    </div>
                </Dialog>

                <!-- Boutons -->
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem"
                    id="buttons">
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
                                    <span class="text-sm sm:text-base">Plein</span>
                                </Button>
                                <Button variant="outlined" severity="contrast" class="flex-1 transition"
                                    :class="{ 'ring-2 ring-white ring-offset-2 ring-offset-black': isOutlined }"
                                    @click="updateSection('button_style', { variant: 'outlined' })">
                                    <span class="text-sm sm:text-base">Bordure</span>
                                </Button>
                            </div>
                        </div>
                        <Divider />
                        <div class="flex flex-col sm:flex-row items-center gap-8 justify-between w-full">
                            <p class="font-semibold">Corners</p>
                            <div class="flex items-center gap-6 w-full sm:w-2/3">
                                <span class="text-sm sm:text-base">Carré</span>
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
                                <span class="text-sm sm:text-base">Arrondi</span>
                            </div>
                        </div>
                        <Divider />
                        <div class="flex flex-col gap-2">
                            <p class="font-semibold">Couleurs</p>
                            <div class="flex justify-center gap-2 w-full sm:flex-row flex-col">
                                <InputGroup class="flex-1" @click="openPicker(buttonBgColorPicker, 'buttonBg')">
                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm sm:text-base lg:text-sm xl:text-base">Bouton</span>
                                            <ColorPicker ref="buttonBgColorPicker" v-model="buttonBgColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="buttonBgColorLocal"
                                        @input="buttonBgColorLocal = buttonBgColorLocal.toUpperCase()"
                                        style="--p-inputtext-focus-border-color:white" @blur="validateButtonBgColor"
                                        maxlength="7" :style="{ color: !isButtonBgColorValid ? '#f87171' : '#ffffff' }"
                                        :invalid="!isButtonBgColorValid" />
                                </InputGroup>
                                <InputGroup class="flex-1" @click="openPicker(buttonTextColorPicker, 'buttonText')">
                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm sm:text-base lg:text-sm xl:text-base">Texte</span>
                                            <ColorPicker ref="buttonTextColorPicker" v-model="buttonTextColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="buttonTextColorLocal"
                                        @input="buttonTextColorLocal = buttonTextColorLocal.toUpperCase()"
                                        style="--p-inputtext-focus-border-color:white" @blur="validateButtonTextColor"
                                        maxlength="7"
                                        :style="{ color: !isButtonTextColorValid ? '#f87171' : '#ffffff' }"
                                        :invalid="!isButtonTextColorValid" />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                </Fieldset>

                <!-- Bloc branding -->
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:panel-bottom" size="24" />
                            <span class="font-semibold">Footer</span>
                        </div>
                    </template>
                    <div v-if="!hasFeature('no_branding')"
                        class="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center justify-between">
                        <div class="flex flex-col sm:gap-0.5">
                            <span class="text-sm font-semibold">Masquer le footer</span>
                            <span class="text-xs text-zinc-400">
                                <template v-if="hasFeature('no_branding')">
                                    {{ getExpiryLabel('no_branding') }}
                                </template>
                                <template v-else>
                                    Masque le footer de ta page de liens
                                </template>
                            </span>
                        </div>
                        <Button v-if="!hasFeature('no_branding')" severity="contrast" size="small"
                            @click="brandingModal = true">
                            <Icon name="lucide:coins" size="16" class="shrink-0" />
                            <span class="text-sm">Débloquer</span>
                        </Button>
                    </div>
                    <div v-else class="flex gap-2 items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm font-semibold">Masquer le footer</span>
                            <span class="text-xs text-zinc-400">
                                <template v-if="!hasFeature('no_branding')">
                                    Masque le footer de ta page de liens
                                </template>
                            </span>
                        </div>
                        <span v-if="isSub" class="text-sm text-gray-400  font-semibold">Inclus dans
                            l'abonnement</span>
                        <span v-else class="text-sm text-emerald-400">{{ getExpiryLabel('no_branding') }}</span>
                    </div>
                    <FeatureUnlockModal v-model="brandingModal" featureKey="no_branding" />
                </Fieldset>
            </div>
        </div>
    </template>

<script setup>
const designStore = useDesignStore()
const { updateSection } = designStore
const { undo, redo, saveDesign, resetDesign } = designStore
const { history, future, isDirty, design } = storeToRefs(designStore)

// Vérification de l'état actif des options de design
const { isActive, isThemeActive } = useDesignActive(design)

// Items de la barre latérale
// const items = ref([
//     {
//         label: 'En-tête',
//         icon: 'lucide:square-user',
//         anchor: 'header'
//     },
//     {
//         label: 'Thème',
//         icon: 'lucide:panels-top-left',
//         anchor: 'theme'
//     },
//     {
//         label: 'Arrière-plan',
//         icon: 'lucide:images',
//         anchor: 'background'

//     },
//     {
//         label: 'Boutons',
//         icon: 'lucide:stretch-horizontal',
//         anchor: 'buttons'

//     },
// ])

// const scrollToSection = (id) => {
//     const el = document.getElementById(id)
//     if (el) {
//         el.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     }
// }

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

// Gestion de l'ouverture des color pickers
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
            input.click()
            pickersOpenState[key] = true
        })
    }
}

// Couleurs locales avec debounce
const {
    localValue: usernameColorLocal,
    validateValue: validateUsernameColor,
    isValid: isUsernameColorValid,
} = useDebouncedColor(
    'username_style',
    'textColor',
    design,
    designStore,
    { defaultValue: 'FFFFFF' }
)

const {
    localValue: descriptionColorLocal,
    validateValue: validateDescriptionColor,
    isValid: isDescriptionColorValid,
} = useDebouncedColor(
    'bio_style',
    'textColor',
    design,
    designStore,
    { defaultValue: 'D4D4D8' }
)

const {
    localValue: buttonTextColorLocal,
    validateValue: validateButtonTextColor,
    isValid: isButtonTextColorValid
} = useDebouncedColor(
    'button_style',
    'textColor',
    design,
    designStore,
    { defaultValue: '000000' }
)

const {
    localValue: buttonBgColorLocal,
    validateValue: validateButtonBgColor,
    isValid: isButtonBgColorValid
} = useDebouncedColor(
    'button_style',
    'backgroundColor',
    design,
    designStore,
    { defaultValue: 'FFFFFF' }
)

const {
    localValue: wallpaperColorLocal,
    validateValue: validateWallpaperColor,
    isValid: isWallpaperColorValid
} = useDebouncedColor(
    'wallpaper_style',
    'backgroundColor',
    design,
    designStore,
    { defaultValue: '18181B' }
)

// Police actuelle
const currentFont = computed(() => design.value?.font_family ?? null)
const fontModal = ref(false)

// Mise à jour de la police
const onFontClick = (font) => {
    designStore.updateFont(font.name)
}

// Vérification des options actives
const isUsernameNormal = isActive('username_style', 'size', 'normal')
const isUsernameMedium = isActive('username_style', 'size', 'medium')
const isFilled = isActive('button_style', 'variant', 'filled')
const isOutlined = isActive('button_style', 'variant', 'outlined')

// Avertir l'utilisateur en cas de modifications non sauvegardées
onBeforeRouteLeave(() => {
    if (isDirty.value) {
        return confirm('Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?')
    }
})

// Accès aux fonctionnalités premium
const { hasFeature, getExpiryLabel, isSub } = useFeatures()
// Modales de déblocage
const premiumThemeModal = ref(false)
const brandingModal = ref(false)

// Remplace saveDesign du store par une version qui vérifie le premium
const handleSave = async () => {
    const activeTheme = Object.values(THEME_PRESETS).find(t => isThemeActive(t).value)
    const activeFont = FONTS.find(f => f.name === design.value?.font_family)

    const needsPremium =
        (activeTheme?.premium || activeFont?.premium) && !hasFeature('premium_theme')

    if (needsPremium) {
        premiumThemeModal.value = true
        return
    }

    await saveDesign()
}
</script>