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
            <Menubar class="sticky top-20 z-10">
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

            <div class="flex justify-center gap-4 flex-col w-full lg:w-lg xl:w-2xl 2xl:w-2xl">
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:square-user" size="24" />
                            <span class="font-semibold">En-tête</span>
                        </div>
                    </template>
                    <div class="flex items-center gap-4">
                        <AvatarUploader />
                        <AvatarUploaderButton />
                    </div>
                    <div class="mt-4">
                        <p class="font-semibold mb-2">Forme de l'image</p>
                        <div class="flex justify-center gap-2 w-full mb-4">
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                <Icon name="lucide:circle-user-round" size="20" />Ronde
                            </Button>
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                <Icon name="lucide:square-user-round" size="20" />Carrée
                            </Button>
                        </div>
                        <p class="font-semibold mb-2">Taille du nom d'utilisateur</p>
                        <div class="flex justify-center gap-2 w-full">
                            <Button variant="outlined" severity="contrast" class="flex-1"
                                @click="updateSection('username_style', { size: 'normal' })">
                                Normal
                            </Button>
                            <Button variant="outlined" severity="contrast" class="flex-1"
                                @click="updateSection('username_style', { size: 'medium' })">
                                Moyen
                            </Button>
                        </div>
                    </div>
                </Fieldset>
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:case-sensitive" size="24" />
                            <span class="font-semibold">Texte</span>
                        </div>
                    </template>
                    <div class="flex flex-col w-full">
                        <p class="font-semibold mb-2">Nom d'utilisateur</p>
                        <div class="flex flex-row gap-2 mb-4">
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                Police : Inter
                            </Button>
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                Couleur
                                <ColorPicker v-model="color" />
                            </Button>
                        </div>
                        <p class="font-semibold mb-2">Boutons</p>
                        <div class="flex flex-row gap-2">
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                Police
                            </Button>
                            <Button variant="outlined" severity="contrast" class="flex-1">
                                Couleur
                                <ColorPicker v-model="color" />
                            </Button>
                        </div>
                    </div>
                </Fieldset>
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:stretch-horizontal" size="24" />
                            <span class="font-semibold">Boutons</span>
                        </div>
                    </template>
                    <div>
                        <p class="font-semibold mb-2">Style</p>
                        <div class="flex justify-center gap-2 w-full mb-4">
                            <Button severity="contrast" class="flex-1"
                                @click="updateSection('button_style', { variant: 'filled' })">
                                Plein
                            </Button>
                            <Button variant="outlined" severity="contrast" class="flex-1"
                                @click="updateSection('button_style', { variant: 'outlined' })">
                                Bordure
                            </Button>
                        </div>
                        <div class="flex flex-row items-center gap-8 justify-between my-8">
                            <p>Corners :</p>
                            <div class="flex items-center gap-6 w-2/3">
                                <span>Carré</span>
                                <Slider v-model="cornerValue" :step="25" class="w-full" />
                                <span>Arrondi</span>
                            </div>
                        </div>
                        <Button variant="outlined" severity="contrast" class="w-full">
                            Couleur
                            <ColorPicker v-model="color" />
                        </Button>
                    </div>
                </Fieldset>
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
                            <ColorPicker v-model="color" />
                            <ColorPicker v-model="color" />
                            <ColorPicker v-model="color" />
                            <ColorPicker v-model="color" />
                            <ColorPicker v-model="color" />
                            <ColorPicker v-model="color" />
                            <ColorPicker v-model="color" />
                            <ColorPicker v-model="color" />
                        </div>
                    </div>
                </Fieldset>
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
                <Fieldset style="--p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem">
                    <template #legend>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:palette" size="24" />
                            <span class="font-semibold">Couleurs</span>
                        </div>
                    </template>
                    <div>
                        <label class="block mb-2">
                            Texte :
                            <input type="color" class="ml-2" />
                        </label>
                        <label class="block mb-2">
                            Liens :
                            <input type="color" class="ml-2" />
                        </label>
                        <label class="block mb-2">
                            Boutons :
                            <input type="color" class="ml-2" />
                        </label>
                        <label class="block">
                            Arrière-plan :
                            <input type="color" class="ml-2" />
                        </label>
                    </div>
                </Fieldset>
            </div>
        </div>
    </template>

<script setup>
const color = ref();
const designStore = useDesignStore()
const { updateSection } = designStore
const { undo, redo, saveDesign } = designStore
const { history, future, isDirty } = storeToRefs(designStore)

const cornerValue = ref(0);

onBeforeRouteLeave(() => {
    if (isDirty.value) {
        return confirm('Vous avez des modifications non sauvegardées')
    }
})

watch(cornerValue, (value) => {
    let borderRadius
    switch (value) {
        case 0: borderRadius = 'rounded-none'; break
        case 1: borderRadius = 'rounded-md'; break
        case 2: borderRadius = 'rounded-full'; break
    }
    designStore.updateSection('button_style', { borderRadius })
})
</script>