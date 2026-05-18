    <template>
        <div class="flex flex-col gap-4">
            <!-- Barre d'outils -->
            <div
                class="sticky top-0 z-60 w-full lg:w-lg xl:w-2xl 2xl:w-2xl mx-auto flex items-center justify-between px-3 py-2 rounded-xl border border-white/8 bg-surface-dark">
                <!-- Annuler -->
                <button :disabled="!isDirty" @click="resetDesign"
                    class="flex items-center gap-2 px-4 py-2 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none">
                    <Icon name="lucide:rotate-ccw" size="18" />
                    <span class="hidden sm:inline whitespace-nowrap">Annuler les modifications</span>
                </button>

                <!-- Undo / Redo / Save -->
                <div class="flex items-center gap-1 sm:gap-2">
                    <button :disabled="!history.length" @click="undo"
                        class="w-10 h-10 flex items-center justify-center rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-muted hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none">
                        <Icon name="lucide:undo" size="18" />
                    </button>
                    <button :disabled="!future.length" @click="redo"
                        class="w-10 h-10 flex items-center justify-center rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-muted hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none">
                        <Icon name="lucide:redo" size="18" />
                    </button>
                    <button @click="handleSave"
                        class="flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-semibold text-white"
                        :class="needsPremiumSave
                            ? 'bg-primary hover:bg-primary/80'
                            : isDirty ? 'bg-primary hover:bg-primary/80' : 'bg-primary opacity-40 pointer-events-none'">
                        <template v-if="needsPremiumSave">
                            <img src="/images/mascotte/charmi-happy-blanc.svg" class="w-5 h-5" />
                        </template>
                        <template v-else>
                            <Icon name="lucide:save" size="18" />
                        </template>
                        <span class="hidden sm:inline">
                            {{ needsPremiumSave ? 'Essayer Charmi+ gratuitement' : 'Enregistrer' }}</span>
                    </button>
                </div>
            </div>
            <!-- <Menu :model="items" class="fixed top-45 left-5 z-50 2xl:block hidden">
                <template #item="{ item, props }">
                    <div v-bind="props.action" @click="scrollToSection(item.anchor)">
                        <Icon :name="item.icon" size="20" />
                        <span>{{ item.label }}</span>
                    </div>
                </template>
</Menu> -->
            <div class="flex justify-center gap-4 flex-col w-full lg:w-lg xl:w-2xl 2xl:w-2xl">

                <!-- En-tête -->
                <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                        <Icon name="lucide:square-user" size="18" class="text-muted shrink-0" />
                        <span class="text-sm font-bold text-white">En-tête</span>
                    </div>
                    <div class="p-4 flex flex-col gap-5">
                        <div class="flex items-center gap-4">
                            <AvatarUploader />
                            <AvatarUploaderButton />
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="text-sm font-semibold text-muted">Taille du pseudo</p>
                            <div class="flex gap-1.5">
                                <button class="flex-1 px-4 py-2 text-sm sm:text-base rounded-md border transition-all"
                                    :class="isUsernameNormal
                                        ? 'bg-primary/20 border-primary text-white'
                                        : 'border-white/8 text-muted hover:text-white hover:border-white/20'"
                                    @click="updateSection('username_style', { size: 'normal' })">
                                    Normal
                                </button>
                                <button class="flex-1 px-4 py-2 text-sm sm:text-base rounded-md border transition-all"
                                    :class="isUsernameMedium
                                        ? 'bg-primary/20 border-primary text-white'
                                        : 'border-white/8 text-muted hover:text-white hover:border-white/20'"
                                    @click="updateSection('username_style', { size: 'medium' })">
                                    Moyen
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Thème -->
                <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden" id="theme">
                    <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                        <Icon name="lucide:panels-top-left" size="18" class="text-muted shrink-0" />
                        <span class="text-sm font-bold text-white">Thème</span>
                    </div>
                    <div class="p-4">
                        <div
                            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-6 gap-4 justify-items-center">
                            <ThemePreviewCard v-for="(theme, key) in THEME_PRESETS" :key="key" :theme="theme"
                                @click="designStore.applyTheme(theme)" :isSelected="isThemeActive(theme).value"
                                :hasAccess="isSub || hasFeature('premium_theme')" />
                        </div>
                    </div>
                </section>

                <FeatureUnlockModal v-model="premiumThemeModal" featureKey="premium_theme" />

                <!-- Arrière-plan -->
                <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden" id="background">
                    <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                        <Icon name="lucide:images" size="18" class="text-muted shrink-0" />
                        <span class="text-sm font-bold text-white">Arrière-plan</span>
                    </div>
                    <div class="p-4">
                        <InputGroup class="flex-1" @click="openPicker(wallpaperColorPicker, 'wallpaper')">
                            <InputGroupAddon
                                style="--p-inputgroup-addon-color:white; --p-inputgroup-addon-background:#18191c">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm">Couleur</span>
                                    <ColorPicker ref="wallpaperColorPicker" v-model="wallpaperColorLocal" format="hex"
                                        @click.stop style="--p-colorpicker-preview-focus-ring-color:none" />
                                </div>
                            </InputGroupAddon>
                            <InputText v-model="wallpaperColorLocal"
                                @input="wallpaperColorLocal = wallpaperColorLocal.toUpperCase()"
                                style="--p-inputtext-focus-border-color:#6A5AE0; --p-inputtext-background:#18191c"
                                @blur="validateWallpaperColor" maxlength="7"
                                :style="{ color: !isWallpaperColorValid ? '#f87171' : '#ffffff' }"
                                :invalid="!isWallpaperColorValid" />
                        </InputGroup>
                    </div>
                </section>

                <!-- Texte -->
                <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                        <Icon name="lucide:type" size="18" class="text-muted shrink-0" />
                        <span class="text-sm font-bold text-white">Texte</span>
                    </div>
                    <div class="p-4 flex flex-col gap-4">

                        <!-- Police -->
                        <div class="flex flex-col gap-2">
                            <p class="text-sm font-semibold text-muted">Police</p>
                            <button
                                class="flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/8 hover:border-white/20 transition-all w-full"
                                @click="fontModal = true">
                                <span class="text-sm" :style="{ fontFamily: currentFont }">
                                    {{ currentFont ?? 'Plus Jakarta Sans' }}</span>
                                <Icon name="lucide:chevron-right" size="16" class="text-muted" />
                            </button>
                        </div>

                        <!-- Couleurs -->
                        <div class="flex flex-col gap-2">
                            <p class="text-sm font-semibold text-muted">Couleurs</p>
                            <div class="flex gap-2 w-full sm:flex-row flex-col">
                                <InputGroup class="flex-1" @click="openPicker(usernameColorPicker, 'username')">
                                    <InputGroupAddon
                                        style="--p-inputgroup-addon-color:white; --p-inputgroup-addon-background:#18191c">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm">Pseudo</span>
                                            <ColorPicker ref="usernameColorPicker" v-model="usernameColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color:none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="usernameColorLocal"
                                        @input="usernameColorLocal = usernameColorLocal.toUpperCase()"
                                        style="--p-inputtext-focus-border-color:#6A5AE0; --p-inputtext-background:#18191c"
                                        @blur="validateUsernameColor" maxlength="7"
                                        :style="{ color: !isUsernameColorValid ? '#f87171' : '#ffffff' }"
                                        :invalid="!isUsernameColorValid" />
                                </InputGroup>
                                <InputGroup class="flex-1" @click="openPicker(descriptionColorPicker, 'description')">
                                    <InputGroupAddon
                                        style="--p-inputgroup-addon-color:white; --p-inputgroup-addon-background:#18191c">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm">Description</span>
                                            <ColorPicker ref="descriptionColorPicker" v-model="descriptionColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color:none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="descriptionColorLocal"
                                        @input="descriptionColorLocal = descriptionColorLocal.toUpperCase()"
                                        style="--p-inputtext-focus-border-color:#6A5AE0; --p-inputtext-background:#18191c"
                                        @blur="validateDescriptionColor" maxlength="7"
                                        :style="{ color: !isDescriptionColorValid ? '#f87171' : '#ffffff' }"
                                        :invalid="!isDescriptionColorValid" />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Modal polices -->
                <Dialog v-model:visible="fontModal" modal dismissableMask :draggable="false"
                    :style="{ width: '32rem', margin: '1rem' }"
                    :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
                    <template #container>
                        <div class="flex flex-col gap-4 rounded-xl border border-white/8 bg-dark">

                            <!-- Header -->
                            <div class="flex items-center justify-between px-5 pt-5">
                                <h2 class="font-heading text-xl font-bold text-white">Choisir une police</h2>
                                <button @click="fontModal = false"
                                    class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/8 text-muted hover:text-white transition-colors">
                                    <Icon name="lucide:x" size="22" />
                                </button>
                            </div>

                            <div class="overflow-y-auto px-5 pb-5" style="max-height: 80vh;">
                                <div class="grid grid-cols-2 gap-2">
                                    <button v-for="font in FONTS" :key="font.name"
                                        class="relative flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all"
                                        :class="currentFont === font.name
                                            ? 'border-primary bg-primary/20 text-white'
                                            : 'border-white/8 hover:border-white/20'" @click="onFontClick(font)">
                                        <span class="text-sm" :style="{ fontFamily: font.name }">{{ font.label }}</span>
                                        <span v-if="font.premium && !isSub && !hasFeature('premium_theme')"
                                            class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-[#a89ff0]">
                                            Charmi+
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                </Dialog>

                <!-- Boutons -->
                <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden" id="buttons">
                    <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                        <Icon name="lucide:stretch-horizontal" size="18" class="text-muted shrink-0" />
                        <span class="text-sm font-bold text-white">Boutons</span>
                    </div>
                    <div class="p-4 flex flex-col gap-5">

                        <!-- Style -->
                        <div class="flex flex-col gap-2">
                            <p class="text-sm font-semibold text-muted">Style</p>
                            <div class="flex gap-2 w-full">
                                <button class="flex-1 px-4 py-2 rounded-md text-sm sm:text-base border transition-all"
                                    :class="isFilled
                                        ? 'bg-primary/20 border-primary text-white'
                                        : 'border-white/8 text-muted hover:text-white hover:border-white/20'"
                                    @click="updateSection('button_style', { variant: 'filled' })">
                                    Plein
                                </button>
                                <button class="flex-1 px-4 py-2 rounded-md text-sm sm:text-base border transition-all"
                                    :class="isOutlined
                                        ? 'bg-primary/20 border-primary text-white'
                                        : 'border-white/8 text-muted hover:text-white hover:border-white/20'"
                                    @click="updateSection('button_style', { variant: 'outlined' })">
                                    Bordure
                                </button>
                            </div>
                        </div>

                        <div class="h-px bg-white/8" />

                        <!-- Corners -->
                        <div class="flex flex-col sm:flex-row items-center gap-6 justify-between w-full">
                            <p class="text-sm font-semibold text-muted shrink-0">Coins</p>
                            <div class="flex items-center gap-4 w-full sm:w-2/3">
                                <span class="text-xs text-muted shrink-0">Carré</span>
                                <div class="relative w-full">
                                    <span
                                        class="absolute -top-6 text-xs text-muted whitespace-nowrap transition-transform"
                                        :style="{ left: `${cornerValue}%`, transform: 'translateX(-50%)' }">
                                        {{ valueToLabel[cornerValue] }}
                                    </span>
                                    <Slider v-model="cornerValue" :step="25" :min="0" :max="100" class="w-full"
                                        style="--p-slider-track-background: rgba(255,255,255,0.1); --p-slider-range-background: #6A5AE0; --p-slider-handle-background: #6A5AE0; 
                                        --p-slider-handle-border-color: #6A5AE0; --p-slider-handle-hover-background: #5849c4; --p-slider-handle-hover-border-color: #5849c4; 
                                        --p-slider-handle-content-background: #18191c; --p-slider-handle-focus-ring-color: none;" />
                                </div>
                                <span class="text-xs text-muted shrink-0">Arrondi</span>
                            </div>
                        </div>

                        <div class="h-px bg-white/8" />

                        <!-- Couleurs -->
                        <div class="flex flex-col gap-2">
                            <p class="text-sm font-semibold text-muted">Couleurs</p>
                            <div class="flex gap-2 w-full sm:flex-row flex-col">
                                <InputGroup class="flex-1" @click="openPicker(buttonBgColorPicker, 'buttonBg')">
                                    <InputGroupAddon
                                        style="--p-inputgroup-addon-color:white; --p-inputgroup-addon-background:#18191c">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm">Bouton</span>
                                            <ColorPicker ref="buttonBgColorPicker" v-model="buttonBgColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color:none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="buttonBgColorLocal"
                                        @input="buttonBgColorLocal = buttonBgColorLocal.toUpperCase()"
                                        style="--p-inputtext-focus-border-color:#6A5AE0; --p-inputtext-background:#18191c"
                                        @blur="validateButtonBgColor" maxlength="7"
                                        :style="{ color: !isButtonBgColorValid ? '#f87171' : '#ffffff' }"
                                        :invalid="!isButtonBgColorValid" />
                                </InputGroup>
                                <InputGroup class="flex-1" @click="openPicker(buttonTextColorPicker, 'buttonText')">
                                    <InputGroupAddon
                                        style="--p-inputgroup-addon-color:white; --p-inputgroup-addon-background:#18191c">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm">Texte</span>
                                            <ColorPicker ref="buttonTextColorPicker" v-model="buttonTextColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color:none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="buttonTextColorLocal"
                                        @input="buttonTextColorLocal = buttonTextColorLocal.toUpperCase()"
                                        style="--p-inputtext-focus-border-color:#6A5AE0; --p-inputtext-background:#18191c"
                                        @blur="validateButtonTextColor" maxlength="7"
                                        :style="{ color: !isButtonTextColorValid ? '#f87171' : '#ffffff' }"
                                        :invalid="!isButtonTextColorValid" />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Bloc branding -->
                <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                        <Icon name="lucide:panel-bottom" size="18" class="text-muted shrink-0" />
                        <span class="text-sm font-bold text-white">Footer</span>
                    </div>
                    <div class="p-4 flex items-center justify-between gap-3">
                        <div class="flex flex-col gap-0.5">
                            <span class="text-sm font-semibold text-white">Masquer le logo</span>
                            <span class="text-xs text-muted">
                                <template v-if="isSub">Inclus dans Charmi+</template>
                                <template v-else-if="hasFeature('no_branding')">
                                    {{ getExpiryLabel('no_branding') }}</template>
                                <template v-else>Masque le logo Charmi sur ta page de liens et ton planning</template>
                            </span>
                        </div>

                        <ToggleSwitch :modelValue="brandingToggle"
                            @click.prevent="onToggleBranding(() => { brandingModal = true })"
                            style="--p-toggleswitch-checked-background:white;--p-toggleswitch-checked-hover-background:#F2F3F7" />
                    </div>
                </section>
                <FeatureUnlockModal v-model="brandingModal" featureKey="no_branding" />
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

const needsPremiumSave = computed(() => {
    const activeTheme = Object.values(THEME_PRESETS).find(t => isThemeActive(t).value)
    const activeFont = FONTS.find(f => f.name === design.value?.font_family)
    return (activeTheme?.premium || activeFont?.premium) && !hasFeature('premium_theme') && isDirty.value
})

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

// Toggle Branding
const { brandingToggle, onToggleBranding } = useBranding()
</script>