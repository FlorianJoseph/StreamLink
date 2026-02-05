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

            <div class="flex flex-col lg:flex-row gap-6">
                <div class="w-full lg:w-md shrink-0">
                    <!-- Design du planning -->
                    <Fieldset
                        style=" --p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem; margin-top: -1.3rem;">
                        <template #legend>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:palette" size="24" />
                                <span class="font-semibold">Design</span>
                            </div>
                        </template>
                        <div class="flex flex-col space-y-6">

                            <!-- Section Arrière-plan -->
                            <div class="space-y-3">
                                <p class="font-semibold text-sm">Arrière-plan</p>
                                <div class="flex flex-row gap-2 items-center">
                                    <InputGroup class="flex-1">
                                        <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                            <div class="flex items-center gap-2">
                                                <span
                                                    class="text-sm sm:text-base lg:text-sm xl:text-base">Couleur</span>
                                                <ColorPicker ref="bgColorPicker" v-model="scheduleBgColorLocal"
                                                    format="hex" @click.stop
                                                    style="--p-colorpicker-preview-focus-ring-color :none" />
                                            </div>
                                        </InputGroupAddon>
                                        <InputText v-model="scheduleBgColorLocal" @blur="onBgColorBlur"
                                            style="--p-inputtext-focus-border-color:white" maxlength="7"
                                            :invalid="!isBgColorValid"
                                            :style="{ color: !isBgColorValid ? '#f87171' : '#ffffff' }" />
                                    </InputGroup>
                                    <template v-if="!schedule?.style?.backgroundUrl">
                                        <FileUpload mode="basic" @select="onFileSelect" auto
                                            :chooseLabel="isLoadingBackground ? 'Chargement...' : 'Choisir une image'"
                                            class="p-button-contrast" accept="image/*"
                                            :disabled="isLoadingBackground" />
                                    </template>
                                    <template v-else>
                                        <Button severity="danger" @click="removeBackgroundImage"
                                            :disabled="isLoadingBackground" size="small" outlined>
                                            <Icon name="lucide:trash-2" size="18" />
                                            <span class="hidden sm:inline">Supprimer l’image</span>
                                        </Button>
                                    </template>
                                </div>
                            </div>
                            <div class="flex flex-row w-full gap-3 items-center" v-if="schedule?.style?.backgroundUrl">
                                <span class="font-semibold text-sm min-w-16">Opacité</span>
                                <InputNumber v-model="backgroundOpacity" :min="0" :max="100" fluid
                                    @change="updateBackgroundOpacity(backgroundOpacity)" showButtons
                                    buttonLayout="horizontal">
                                    <template #incrementbuttonicon>
                                        <Icon name="lucide:plus" size="18" />
                                    </template>
                                    <template #decrementbuttonicon>
                                        <Icon name="lucide:minus" size="18" />
                                    </template>
                                </InputNumber>
                            </div>

                            <!-- Section Texte -->
                            <div class="space-y-3">
                                <p class="font-semibold text-sm">Texte</p>
                                <InputGroup class="flex-1">
                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm sm:text-base lg:text-sm xl:text-base">Couleur</span>
                                            <ColorPicker ref="textColorPicker" v-model="scheduleTextColorLocal"
                                                format="hex" @click.stop
                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                        </div>
                                    </InputGroupAddon>
                                    <InputText v-model="scheduleTextColorLocal" @blur="onTextColorBlur"
                                        style="--p-inputtext-focus-border-color:white" maxlength="7"
                                        :invalid="!isTextColorValid"
                                        :style="{ color: !isTextColorValid ? '#f87171' : '#ffffff' }" />
                                </InputGroup>
                            </div>
                            <Divider />

                            <!-- Section Options -->
                            <div class="space-y-3">
                                <div class="flex items-center gap-2">
                                    <Icon name="lucide:settings-2" size="16" class="text-gray-400" />
                                    <p class="font-semibold text-xs uppercase tracking-wider text-gray-400">
                                        Options d'affichage
                                    </p>
                                </div>
                                <div class="space-y-1">
                                    <!-- Avec séparateur subtil -->
                                    <label for="toggle-title" class="flex justify-between items-center px-3 py-2.5">
                                        <div class="flex items-center gap-2">
                                            <Icon name="lucide:type" size="18" class="text-gray-400" />
                                            <span class="text-sm">Afficher les titres</span>
                                        </div>
                                        <ToggleSwitch id="toggle-title" v-model="titleVisible"
                                            style="--p-toggleswitch-checked-background: white; --p-toggleswitch-checked-hover-background: white"
                                            @click="toggleTitleVisibility" />
                                    </label>

                                    <label for="toggle-endtime" class="flex justify-between items-center px-3 py-2.5">
                                        <div class="flex items-center gap-2">
                                            <Icon name="lucide:clock" size="18" class="text-gray-400" />
                                            <span class="text-sm">Afficher l'heure de fin</span>
                                        </div>
                                        <ToggleSwitch id="toggle-endtime" v-model="endTimeVisible"
                                            style="--p-toggleswitch-checked-background: white; --p-toggleswitch-checked-hover-background: white"
                                            @click="toggleEndTimeVisibility" />
                                    </label>

                                    <label for="toggle-days" class="flex justify-between items-center px-3 py-2.5">
                                        <div class="flex items-center gap-2">
                                            <Icon name="lucide:calendar-off" size="18" class="text-gray-400" />
                                            <span class="text-sm">Afficher les jours sans stream</span>
                                        </div>
                                        <ToggleSwitch id="toggle-days" v-model="daysWithoutStreamVisible"
                                            style="--p-toggleswitch-checked-background: white; --p-toggleswitch-checked-hover-background: white"
                                            @click="toggleDaysWithoutStreamVisibility" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Fieldset>

                    <!-- Configuration du planning -->
                    <Fieldset style=" --p-fieldset-legend-background: none; --p-fieldset-content-padding: 0.5rem;"
                        class="overflow-auto">
                        <template #legend>
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:settings" size="24" />
                                <span class="font-semibold">Configuration rapide</span>
                            </div>
                        </template>
                        <Button label="Ajouter un créneau" severity="contrast" @click="openSlotModal('Lundi')"
                            class="w-full">
                            <Icon name="lucide:plus" size="18" />
                            <span>Ajouter un créneau</span>
                        </Button>
                        <Accordion value="0" v-for="day in daysOptions" :key="day.label">
                            <AccordionPanel :value="slotsForDay(day.label).length"
                                v-if="slotsForDay(day.label).length > 0">
                                <AccordionHeader>
                                    <span class="flex items-center gap-2 w-full">
                                        <Icon name="lucide:calendar-days" size="18" />
                                        <span class="font-bold whitespace-nowrap">{{ day.label }}</span>
                                        <Badge :value="slotsForDay(day.label).length" class="ml-auto mr-2"
                                            severity="contrast" />
                                    </span>
                                </AccordionHeader>
                                <AccordionContent>
                                    <div class="flex flex-col gap-2">
                                        <div v-for="slot in slotsForDay(day.label)" :key="slot.id"
                                            class="group flex items-center justify-between p-3 border border-white/20 rounded-lg hover:border-white/40 hover:cursor-pointer transition-all"
                                            :style="{ borderLeftWidth: '4px', borderLeftColor: `#${slot.color}` }"
                                            @click="openSlotModal(day.label, slot)">
                                            <!-- Informations du créneau -->
                                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                                <!-- Image du jeu -->
                                                <div class="flex-shrink-0">
                                                    <img v-if="slot.game.cover" :src="slot.game.cover"
                                                        :alt="slot.game.label"
                                                        class="w-10 h-14 rounded object-fill border border-white/10" />
                                                    <div v-else
                                                        class="w-10 h-14 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                                                        <Icon name="lucide:gamepad-2" size="20" class="text-white/30" />
                                                    </div>
                                                </div>

                                                <!-- Détails -->
                                                <div class="flex flex-col min-w-0 flex-1">
                                                    <span class="font-semibold truncate">{{ slot.title }}</span>
                                                    <div class="flex items-center gap-2 text-sm text-white/70">
                                                        {{ formatTime(slot.start_at) }} - {{ formatTime(slot.end_at) }}
                                                    </div>
                                                    <!-- <span class="text-xs text-white/50 truncate">{{ slot.title
                                                    }}</span> -->
                                                </div>
                                            </div>

                                            <!-- Actions -->
                                            <div
                                                class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="small" severity="danger" text @click="deleteSlot(slot)"
                                                    v-tooltip.bottom="'Supprimer'">
                                                    <Icon name="lucide:trash-2" size="16" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>
                        </Accordion>
                    </Fieldset>
                </div>
                <div class="flex-1 min-w-0 flex flex-col gap-4">

                    <!-- Barre d'outils -->
                    <Menubar class="w-full">
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
                    <div ref="viewportRef" class="relative w-full">
                        <div class="absolute top-0 left-0" :style="scalerStyle" id="scheduleCard">
                            <div class="p-4 relative rounded-lg export-footer" :style="{
                                backgroundColor: scheduleBgColor,
                                backgroundImage: schedule?.style?.backgroundUrl ? `url(${schedule.style.backgroundUrl})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '1280px',
                                height: '720px',
                            }">
                                <div class="absolute inset-0 z-10" v-if="schedule?.style?.backgroundUrl"
                                    :style="{ backgroundColor: `rgba(0,0,0,${1 - backgroundOpacity / 100})` }">
                                </div>
                                <div class="flex flex-col gap-6 w-full">

                                    <!-- En-tête du planning -->
                                    <div class="flex items-center gap-4 truncate z-20">
                                        <div class="flex flex-col w-full" :style="{ color: scheduleTextColor }">
                                            <!-- Titre -->
                                            <template v-if="editing.field === 'title'">
                                                <input :ref="el => inputRefs['title'] = el" v-model="editing.value"
                                                    @blur="saveEdit" @keyup.enter="saveEdit"
                                                    @keyup.esc.prevent.stop="cancelEdit"
                                                    class="text-4xl font-bold bg-transparent border-none focus:outline-none"
                                                    maxlength="70" />
                                            </template>
                                            <template v-else>
                                                <div class="flex items-center gap-2 hover:cursor-pointer"
                                                    @click="editField('title')">
                                                    <h1 class="text-4xl font-bold"> {{ schedule?.title }} </h1>
                                                    <Icon name="lucide:pencil" size="34"
                                                        class="transition ignore-export" />
                                                </div>
                                            </template>
                                            <!-- Sous-titre -->
                                            <template v-if="editing.field === 'subtitle'">
                                                <input :ref="el => inputRefs['subtitle'] = el" v-model="editing.value"
                                                    @blur="saveEdit" @keyup.enter="saveEdit"
                                                    @keyup.esc.prevent.stop="cancelEdit"
                                                    class="text-base font-semibold bg-transparent border-none focus:outline-none w-full"
                                                    maxlength="100" />
                                            </template>
                                            <template v-else>
                                                <div class="flex items-center gap-2 hover:cursor-pointer"
                                                    @click="editField('subtitle')">
                                                    <div class="text-base font-semibold"> {{ schedule?.subtitle }}
                                                    </div>
                                                    <Icon name="lucide:pencil" size="18"
                                                        class="transition ignore-export" />
                                                </div>
                                            </template>
                                        </div>
                                    </div>

                                    <!-- Contenu du planning -->
                                    <div class="flex gap-4 w-full z-20">
                                        <template v-for="day in daysOptions" :key="day.label">
                                            <div v-if="slotsForDay(day.label).length > 0 || daysWithoutStreamVisible"
                                                :style="dayColumnStyle(day.label)"
                                                class="flex flex-col items-center transition-all duration-500 ease-out">
                                                <!-- Jour -->
                                                <div class=" font-semibold mb-2 text-center text-xl"
                                                    :style="{ color: scheduleTextColor }">
                                                    {{ day.label }}</div>
                                                <!-- Créneaux -->
                                                <div class="lg:h-130 w-full">

                                                    <!-- CAS : aucun créneau -->
                                                    <template v-if="slotsForDay(day.label).length === 0">
                                                        <div class="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer border-zinc-500 hover:border-zinc-300 
                            transition-all h-full w-full day-slot-empty" @click="openSlotModal(day.label)">
                                                            <div
                                                                class="flex flex-col items-center justify-center gap-1 ">
                                                                <Icon name="lucide:plus" size="18"
                                                                    class="text-zinc-400" />
                                                                <!-- <span class="text-center text-xs text-zinc-400">Ajouter un
                                        stream</span> -->
                                                            </div>
                                                        </div>
                                                    </template>

                                                    <!-- CAS : il y a des créneaux -->
                                                    <template v-else>
                                                        <div class="grid grid-rows-[auto_1fr_auto] gap-2 h-full">
                                                            <!-- Zone + en haut -->
                                                            <div class="h-6 border-2 border-dashed border-zinc-500 rounded-lg flex items-center justify-center cursor-pointer hover:border-zinc-300 transition-all w-full row-span-1 ignore-export"
                                                                @click="openSlotModal(day.label, undefined, 'before')"
                                                                v-tooltip.bottom="{ value: `Ajouter un stream avant`, pt: { text: '!text-sm' } }">
                                                                <Icon name="lucide:plus" size="14"
                                                                    class="text-zinc-400" />
                                                            </div>
                                                            <!-- Créneaux -->
                                                            <div
                                                                class="flex flex-col gap-1 overflow-hidden w-full export-day-column-content">
                                                                <div v-for="slot in slotsForDay(day.label)"
                                                                    :key="slot.id"
                                                                    class="border-4 rounded-lg flex-1 min-h-0 w-full relative h-full flex flex-col group transition-all"
                                                                    :style="slotStyle(slot)">
                                                                    <div class="flex-1"></div>
                                                                    <!-- Tag titre -->
                                                                    <div class="bg-black/80 text-sm font-bold px-2 py-1 rounded-b-md z-25 line-clamp-1"
                                                                        v-if="titleVisible">
                                                                        {{ slot.title }}
                                                                    </div>
                                                                    <div class="absolute top-[-1px] left-[-1px] z-100 px-2 py-1 text-base font-semibold rounded-br-md rounded-tl-sm"
                                                                        :style="slot.game.cover
                                                                            ? { backgroundColor: `#${slot.color}` || 'rgba(0, 0, 0, 0.7)' }
                                                                            : {}">
                                                                        {{ formatTime(slot.start_at) }}
                                                                        <span v-if="endTimeVisible">
                                                                            - {{ formatTime(slot.end_at) }}
                                                                        </span>
                                                                    </div>
                                                                    <!-- Overlay desktop uniquement -->
                                                                    <div
                                                                        class="hidden lg:flex absolute opacity-0 group-hover:opacity-100 z-50 transition-opacity h-full w-full top-0 left-0 bg-black/30 items-center justify-center rounded-sm gap-2">
                                                                        <Button
                                                                            @click.prevent="openSlotModal(day.label, slot)"
                                                                            v-tooltip.bottom="`Modifier`"
                                                                            severity="info">
                                                                            <Icon name="lucide:edit-2" size="20" />
                                                                        </Button>
                                                                        <Button @click.prevent="deleteSlot(slot)"
                                                                            v-tooltip.bottom="`Supprimer`"
                                                                            severity="danger">
                                                                            <Icon name="lucide:trash-2" size="20" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!-- Zone + en bas -->
                                                            <div class="h-6 border-2 border-dashed border-zinc-500 rounded-lg flex items-center justify-center cursor-pointer hover:border-zinc-300 transition-all w-full row-span-1 ignore-export"
                                                                @click="openSlotModal(day.label, undefined, 'after')"
                                                                v-tooltip.bottom="{ value: `Ajouter un stream après`, pt: { text: '!text-sm' } }">
                                                                <Icon name="lucide:plus" size="14"
                                                                    class="text-zinc-400" />
                                                            </div>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <!-- Footer -->
                                <div
                                    class="absolute bottom-3 right-3 text-lg text-zinc-400/80 select-none pointer-events-none ignore-export z-20">
                                    Fait avec <span class="font-semibold">StreamLink</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal d'ajout de créneau -->
    <Dialog v-model:visible="visible" dismissable-mask modal
        :header="editingSlot ? 'Modifier le stream' : 'Ajouter un stream'" :style="{ width: '30rem' }"
        :draggable="false">
        <div class="flex flex-col gap-5">

            <!-- Catégorie Twitch -->
            <div class="flex flex-col gap-2">
                <label for="game-search" class="font-semibold text-sm flex items-center gap-2">
                    <Icon name="lucide:gamepad-2" size="18" />
                    Catégorie Twitch
                    <span class="text-red-500">*</span>
                </label>
                <InputGroup>
                    <InputGroupAddon>
                        <Icon name="lucide:search" size="20" class="text-zinc-500" />
                    </InputGroupAddon>
                    <AutoComplete v-model="selectedGame" :suggestions="gameSuggestions" @complete="searchGames"
                        optionLabel="label" placeholder="Ex: League of Legends, Valorant..." fluid forceSelection
                        style="--p-inputtext-focus-border-color:white" id="game-search">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <img v-if="slotProps.option.cover" :src="slotProps.option.cover"
                                    :alt="slotProps.option.label"
                                    class="w-8 h-10 rounded border border-zinc-700 flex-shrink-0" />
                                <div v-else
                                    class="w-8 h-10 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                                    <Icon name="lucide:image-off" size="20" class="text-zinc-600" />
                                </div>
                                <span>{{ slotProps.option.label }}</span>
                            </div>
                        </template>
                        <template #empty>
                            Aucun jeu trouvé
                        </template>
                    </AutoComplete>
                </InputGroup>
            </div>

            <!-- Titre du stream -->
            <div class="flex flex-col gap-2 relative">
                <label for="stream-title" class="font-semibold text-sm flex items-center gap-2">
                    <Icon name="lucide:type" size="18" />
                    Titre du stream
                </label>
                <InputText id="stream-title" type="text" v-model="title"
                    :placeholder="`${selectedGame?.label || 'Ex: Gameplay, collaboration...'}`" fluid maxlength="35"
                    style="--p-inputtext-focus-border-color:white" />
                <div class="flex justify-between items-center absolute bottom-1 right-2">
                    <small class="text-zinc-500 text-xs ml-auto">
                        {{ title.length }}/30
                    </small>
                </div>
            </div>

            <!-- Couleur du créneau -->
            <div class="flex flex-col gap-2">
                <div class="flex items-start justify-between">
                    <div class="flex flex-col gap-1">
                        <label class="font-semibold text-sm flex items-center gap-2">
                            <Icon name="lucide:palette" size="18" />
                            Couleur du créneau
                        </label>
                        <span class="text-xs text-zinc-500">
                            {{ useGameColor ? 'Suggérée automatiquement en fonction du jeu sélectionné mais modifiable.'
                                :
                                'Personnalisée' }}
                        </span>
                    </div>
                    <div v-if="!useGameColor"
                        class="px-2 py-1 bg-zinc-700 text-white text-xs rounded-full flex items-center gap-1">
                        <Icon name="lucide:wand-2" size="12" />
                        Modifiée
                    </div>
                </div>

                <InputGroup>
                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                        <ColorPicker ref="slotColorPicker" v-model="colorInput" format="hex" @click.stop
                            style="--p-colorpicker-preview-focus-ring-color :none" @change="useGameColor = false" />
                    </InputGroupAddon>
                    <InputText v-model="colorInput" @blur="colorInput = slotColor"
                        @input="colorInput = colorInput.toUpperCase(); useGameColor = false"
                        style="--p-inputtext-focus-border-color:white" maxlength="7"
                        :style="{ color: isColorInvalid ? '#f87171' : '#ffffff' }" />
                    <InputGroupAddon v-tooltip.bottom="'Réinitialiser en couleur automatique'"
                        class="cursor-pointer flex items-center gap-1" @click="resetColor">
                        <Icon name="lucide:rotate-ccw" size="16" />
                        <span>Réinitialiser</span>
                    </InputGroupAddon>
                </InputGroup>
            </div>

            <!-- Jours de stream -->
            <div class="flex flex-col gap-2">
                <label class="font-semibold text-sm flex items-center gap-2">
                    <Icon name="lucide:calendar-days" size="18" />
                    Jours de stream
                    <span class="text-red-500">*</span>
                </label>
                <span class="text-xs text-zinc-500">
                    {{ editingSlot
                        ? 'Sélectionne un nouveau jour pour déplacer ce créneau'
                        : 'Sélectionne un ou plusieurs jours pour ce créneau' }}
                </span>
                <SelectButton v-model="selectedDays" :options="daysOptions" optionLabel="label" :multiple="!editingSlot"
                    aria-labelledby="multiple" class="flex flex-wrap gap-1" />
            </div>

            <!-- Horaires -->
            <div class="flex flex-col gap-2">
                <label class="font-semibold text-sm flex items-center gap-2">
                    <Icon name="lucide:clock" size="18" />
                    Horaires
                    <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                    <div class="flex flex-col gap-1">
                        <label for="start-time" class="text-xs text-zinc-500">Début</label>
                        <InputText id="start-time" type="time" v-model="startTime"
                            style="--p-inputtext-focus-border-color:white" />
                    </div>
                    <Icon name="lucide:arrow-right" size="20" class="text-zinc-500 mt-5" />
                    <div class="flex flex-col gap-1">
                        <label for="end-time" class="text-xs text-zinc-500">Fin</label>
                        <InputText id="end-time" type="time" v-model="endTime"
                            style="--p-inputtext-focus-border-color:white" />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex gap-2 w-full">
                <Button type="button" label="Annuler" severity="secondary" @click="visible = false" outlined
                    class="flex-1">
                    <template #icon>
                        <Icon name="lucide:x" size="18" />
                    </template>
                </Button>
                <Button type="button" :label="editingSlot ? 'Mettre à jour' : 'Enregistrer'" severity="contrast"
                    @click="saveSlot"
                    :disabled="isColorInvalid || !selectedGame?.label || !startTime || !endTime || selectedDays.length === 0"
                    class="flex-1">
                    <template #icon>
                        <Icon :name="editingSlot ? 'lucide:check' : 'lucide:save'" size="18" />
                    </template>
                </Button>
            </div>
        </template>
    </Dialog>

    <Dialog v-model:visible="showPreview" dismissableMask modal :style="{ width: '65vw' }" :draggable="false">
        <template #container="{ closeCallback }">
            <img v-if="previewDataUrl" :src="previewDataUrl" class="w-full h-auto" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { I } from 'vue-router/dist/router-CWoNjPRp.mjs'

const scheduleStore = useScheduleStore()
const scheduleSlotStore = useScheduleSlotStore()
const { schedule } = storeToRefs(scheduleStore)
const supabase = useSupabaseClient()
const loading = ref(true)

// Édition du titre et du sous-titre
const editing = ref({ field: null as 'title' | 'subtitle' | null, value: '' })
const inputRefs = ref<Record<string, HTMLInputElement | null>>({})

// Démarre l’édition du titre ou du sous-titre
function editField(field: 'title' | 'subtitle') {
    if (!schedule.value) return
    editing.value = {
        field, value: schedule.value[field] ?? ''
    }
    nextTick(() => {
        inputRefs.value[field]?.focus()
    })
}

// Sauvegarde les modifications apportées au titre ou au sous-titre
async function saveEdit() {
    if (!schedule.value || !editing.value.field) return
    const { field, value } = editing.value
    if (value !== schedule.value[field]) {
        await scheduleStore.updateSchedule({ [field]: value })
    }
    editing.value = { field: null, value: '' }
}

function cancelEdit() {
    editing.value.field = null
    editing.value.value = ''
}

const slots = ref([])

// Charge les slots
async function loadSlots() {
    if (!schedule.value) return
    const { data } = await scheduleSlotStore.fetchSlots(schedule.value.id)
    if (data) slots.value = data
}

// Trie les slots pour un jour donné
function slotsForDay(day: string) {
    return slots.value
        .filter(slot => slot.day.includes(day))
}

// Fonction pour déterminer le style d'une colonne de jour
const dayColumnStyle = (dayLabel: any) => {
    const hasSlots = slotsForDay(dayLabel).length > 0;
    const totalDaysWithSlots = daysOptions.filter(day => slotsForDay(day.label).length > 0).length;

    if (hasSlots) {
        // Jour ON : prend l'espace disponible
        return {
            flex: '1 1 0%',
            minWidth: '0',
            maxWidth: '80rem'
        };
    } else {
        if (totalDaysWithSlots === 0) {
            // Tous les jours sont OFF : partager l'espace équitablement
            return {
                flex: '1 1 0%',
                minWidth: '0',
                maxWidth: '12rem',
            };
        }
        else if (totalDaysWithSlots === 1) {
            // Un seul jour ON : les OFF s'étendent un peu pour équilibrer
            return {
                flex: '1 1 0%',
                minWidth: '0',
                maxWidth: '8rem'
            };
        } else {
            // Plusieurs jours ON : OFF fixes
            return {
                flex: '0 0 6rem',
                minWidth: '0',
                maxWidth: '6rem'
            };
        }
    }
};

// Fonction pour générer le style d'un slot
const slotStyle = (slot: any) => {
    if (slot.game.cover) {
        return {
            borderColor: `#${slot.color}`,
            backgroundImage: `url(${slot.game.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }
    }
    return {}
}

// Supprime un slot
async function deleteSlot(slot: any) {
    // if (!schedule.value) return
    // const confirmed = confirm(`Es-tu sûr de vouloir supprimer le stream "${slot.title}" ?`)
    // if (!confirmed) return
    await scheduleSlotStore.deleteSlot(slot.id)
    await loadSlots()
}

// Formate une heure au format HH:mm en HHhmm
function formatTime(time: string) {
    if (!time) return ''
    const [h, m] = time.split(':')
    return `${h}h${m}`
}

// Gestion des couleurs du planning
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

const scheduleBgColor = computed(() => {
    return `#${schedule.value?.style?.bgColor || ''}`
})

const scheduleTextColor = computed(() => {
    return `#${schedule.value?.style?.textColor || ''}`
})

// Gestion de l'affichage des éléments du planning
const titleVisible = ref(true)
const endTimeVisible = ref(false)
const daysWithoutStreamVisible = ref(true)

// Watch pour mettre à jour dès que schedule est défini
watch(schedule, (newSchedule) => {
    if (!newSchedule?.style) return
    titleVisible.value = newSchedule.style.showTitle ?? true
    endTimeVisible.value = newSchedule.style.showEndTime ?? false
    daysWithoutStreamVisible.value = newSchedule.style.showDaysWithoutStream ?? true
}, { immediate: true })

async function updateStyle(newStyle: any) {
    if (!schedule.value) return

    // Merge l'ancien style avec le nouveau pour ne pas écraser les autres options
    const updatedStyle = { ...newStyle }

    // Met à jour le store / BDD
    await scheduleStore.updateSchedule({ style: updatedStyle })

    // Met à jour les refs locales
    titleVisible.value = updatedStyle.showTitle ?? true
    endTimeVisible.value = updatedStyle.showEndTime ?? false
    daysWithoutStreamVisible.value = updatedStyle.showDaysWithoutStream ?? true
}

// Toggle pour chaque option
function toggleTitleVisibility() {
    updateStyle({ showTitle: !titleVisible.value })
}

function toggleEndTimeVisibility() {
    updateStyle({ showEndTime: !endTimeVisible.value })
}

function toggleDaysWithoutStreamVisibility() {
    updateStyle({ showDaysWithoutStream: !daysWithoutStreamVisible.value })
}

// Gestion de la génération d'aperçu et de l'export du planning
const {
    previewSchedule,
    exportSchedule,
    previewDataUrl,
    showPreview
} = useScheduleScreenshot()

const scheduleId = computed(() => schedule.value?.id)
// Gestion de la modal de créneau
const {
    visible,
    selectedGame,
    title,
    slotColor,
    colorInput,
    isColorInvalid,
    useGameColor,
    resetColor,
    startTime,
    endTime,
    selectedDays,
    daysOptions,
    openSlotModal,
    editingSlot,
    saveSlot,
    searchGames,
    gameSuggestions
} = useSlotModal(scheduleId, slots, scheduleSlotStore, loadSlots)

// Gestion du redimensionnement et du scaling du planning
const viewportRef = ref<HTMLElement | null>(null)

const BASE_WIDTH = 1280
const BASE_HEIGHT = 720
const BASE_SCALE = 0.95
const viewportWidth = ref(0)

// Met à jour la largeur du viewport pour recalculer le scale
const update = () => {
    if (viewportRef.value) {
        viewportWidth.value = viewportRef.value.clientWidth
    }
}

// Calcule le scale à appliquer au planning pour qu'il rentre dans le viewport
const scale = computed(() => {
    if (!viewportWidth.value) return BASE_SCALE

    const responsiveScale = viewportWidth.value / BASE_WIDTH

    return Math.min(responsiveScale, BASE_SCALE)
})

// Style à appliquer au conteneur du planning pour le redimensionner et le scaler
const scalerStyle = computed(() => ({
    width: `${BASE_WIDTH}px`,
    height: `${BASE_HEIGHT}px`,
    transform: `scale(${scale.value})`,
    transformOrigin: 'top left'
}))

// Gestion de l'upload d'image d'arrière-plan
const imageUrl = ref<string | null>(null)
const isLoadingBackground = ref(false)

// Lorsqu'une image est sélectionnée, on affiche un aperçu immédiat et on lance l'upload
const onFileSelect = async (event: any) => {
    const file = event.files?.[0]
    if (!file) return

    isLoadingBackground.value = true
    imageUrl.value = URL.createObjectURL(file) // preview

    try {
        await replaceBackgroundImage(file)
    } finally {
        isLoadingBackground.value = false
    }
}

// Sauvegarde de la nouvelle image d'arrière-plan
const replaceBackgroundImage = async (file: File) => {
    if (!file) return

    const filePath = `Schedule/${crypto.randomUUID()}.png`

    const { error } = await supabase.storage
        .from('Streamlink')
        .upload(filePath, file, { upsert: true })

    if (error) {
        console.error('Erreur upload:', error)
        return
    }

    const publicUrl = supabase.storage
        .from('Streamlink')
        .getPublicUrl(filePath).data.publicUrl

    await removeBackgroundImage()
    await scheduleStore.updateSchedule({ style: { backgroundUrl: publicUrl } })

    imageUrl.value = publicUrl
}

// Supprimer l'image d'arrière-plan actuelle
const removeBackgroundImage = async () => {
    if (!schedule.value?.style?.backgroundUrl) return

    const oldBackgroundPath = schedule.value.style.backgroundUrl.split('/Schedule/')[1]
    await supabase.storage.from('Streamlink').remove([`Schedule/${oldBackgroundPath}`])
    await scheduleStore.updateSchedule({ style: { backgroundUrl: '' } })
}

// Opacité de l'arrière-plan pour améliorer la lisibilité du planning
const backgroundOpacity = ref(100)

watch(
    () => schedule.value?.style?.backgroundOpacity,
    (val) => {
        if (val !== undefined) {
            backgroundOpacity.value = val
        }
    },
    { immediate: true }
)

const updateBackgroundOpacity = async (value: number) => {
    backgroundOpacity.value = value
    if (!schedule.value) return
    await scheduleStore.updateSchedule({ style: { backgroundOpacity: value } })
}

onMounted(async () => {
    loading.value = true
    await scheduleStore.getOrCreateSchedule()
    await loadSlots()

    update()
    window.addEventListener('resize', update)
    loading.value = false
})

onUnmounted(() => {
    window.removeEventListener('resize', update)
})

definePageMeta({
    layout: 'fullscreen'
})
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
