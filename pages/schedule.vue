<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <template v-else>
        <div class="flex flex-col gap-4 fade-in">
            <div class="py-4">
                <div class="flex flex-col lg:items-start items-center">
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                        Mon planning
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center lg:text-left max-w-xl text-gray-400">
                        Crée, personnalise et partage ton planning de stream
                    </p>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-6">
                <div class="w-full lg:w-md shrink-0 lg:h-[46.1rem]">
                    <Tabs value="0"
                        style="--p-tabs-active-bar-background : white;--p-tabs-tab-active-color:white;--p-tabs-tab-active-border-color: white"
                        class="border border-zinc-700 rounded-lg h-full">
                        <TabList class="shrink-0">
                            <Tab value="0" as="div" class="flex items-center gap-2">
                                <Icon name="lucide:calendar-days" size="24" />
                                <span class="font-semibold text-sm sm:text-base">Créneaux</span>
                            </Tab>
                            <Tab value="1" as="div" class="flex items-center gap-2">
                                <Icon name="lucide:palette" size="24" />
                                <span class="font-semibold text-sm sm:text-base">Design</span>
                            </Tab>
                        </TabList>
                        <TabPanels class="flex-1 overflow-y-auto tab-panels-scroll">
                            <TabPanel value="0" as="p" class="m-0">
                                <!-- Configuration du planning -->
                                <Button label="Ajouter un créneau" severity="contrast" @click="openSlotModal('Lundi')"
                                    class="w-full">
                                    <Icon name="lucide:plus" size="18" class="shrink-0" />
                                    <span class="text-sm sm:text-base">Ajouter un créneau</span>
                                </Button>
                                <!-- État vide si aucun créneau -->
                                <div v-if="!daysOptions.some(day => slotsForDay(day.label).length > 0)"
                                    class="flex flex-col items-center justify-center py-12 text-center">
                                    <Icon name="lucide:calendar-x" size="48" class="text-white/20 mb-4" />
                                    <p class="text-white/60 text-sm mb-2">Aucun stream programmé cette semaine</p>
                                    <p class="text-white/40 text-xs">Clique sur "Ajouter un créneau" ou directement sur
                                        le planning pour commencer </p>
                                </div>
                                <Accordion value="0" v-for="day in daysOptions" :key="day.label" class="overflow-auto">
                                    <AccordionPanel :value="slotsForDay(day.label).length"
                                        v-if="slotsForDay(day.label).length > 0">
                                        <AccordionHeader>
                                            <span class="flex items-center gap-2 w-full mr-2">
                                                <Icon name="lucide:calendar-days" size="18" class="shrink-0" />
                                                <span class="font-bold whitespace-nowrap text-sm sm:text-base">{{
                                                    day.label }}</span>
                                                <Badge :value="slotsForDay(day.label).length" class="ml-auto"
                                                    severity="contrast" />
                                                <Button size="small" text severity="secondary"
                                                    @click.stop="openSlotModal(day.label)" v-tooltip.left="{
                                                        value: `Ajouter un créneau ` + day.label, pt:
                                                            { text: '!text-sm' }
                                                    }">
                                                    <Icon name="lucide:plus" size="18" class="shrink-0 text-zinc-300" />
                                                </Button>
                                            </span>
                                        </AccordionHeader>
                                        <AccordionContent>
                                            <div class="flex flex-col gap-2">
                                                <div v-for="slot in slotsForDay(day.label)" :key="slot.id"
                                                    class="group flex items-center justify-between py-3 px-2 sm:p-3 border border-white/20 rounded-lg hover:border-white/40 hover:cursor-pointer transition-all"
                                                    :style="{ borderLeftWidth: '4px', borderLeftColor: `#${slot.color}` }"
                                                    @click="openSlotModal(day.label, slot)">
                                                    <!-- Informations du créneau -->
                                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                                        <!-- Image du jeu -->
                                                        <div class="flex-shrink-0">
                                                            <img v-if="slot.game.cover" :src="slot.game.cover"
                                                                :alt="slot.game.label"
                                                                class="w-6 h-8 sm:w-10 sm:h-14 rounded object-contain border border-zinc-700" />
                                                            <div v-else
                                                                class=" w-6 h-8 sm:w-10 sm:h-14 rounded bg-white/5 border border-zinc-700 flex items-center justify-center">
                                                                <Icon name="lucide:gamepad-2" size="20"
                                                                    class="text-white/30" />
                                                            </div>
                                                        </div>

                                                        <!-- Détails -->
                                                        <div class="flex flex-col min-w-0 flex-1">
                                                            <span
                                                                class="font-semibold truncate max-w-[8rem] sm:max-w-[16rem] text-xs sm:text-base">
                                                                {{ slot.title }}
                                                            </span>
                                                            <div
                                                                class="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                                                                {{ formatTime(slot.start_at) }} -
                                                                {{ formatTime(slot.end_at) }}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- Actions -->
                                                    <div
                                                        class="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button size="small" severity="danger" text
                                                            @click.stop="showDeleteConfirmation = true; slotToDelete = slot"
                                                            v-tooltip.bottom="{ value: 'Supprimer', pt: { text: '!text-sm' } }">
                                                            <Icon name="lucide:trash-2" size="18" class="shrink-0" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionPanel>
                                </Accordion>
                            </TabPanel>
                            <TabPanel value="1" as="p" class="m-0">
                                <!-- Design du planning -->
                                <div class="flex flex-col space-y-6">

                                    <!-- Section Arrière-plan -->
                                    <div class="space-y-3">
                                        <p class="font-semibold text-sm">Arrière-plan</p>
                                        <template v-if="!schedule?.style?.backgroundUrl">
                                            <div class="flex flex-row gap-2 items-center">
                                                <InputGroup class="flex-1">
                                                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                                                        <div class="flex items-center gap-2">
                                                            <span
                                                                class="text-sm sm:text-base lg:text-sm xl:text-base">Couleur</span>
                                                            <ColorPicker ref="bgColorPicker"
                                                                v-model="scheduleBgColorLocal" format="hex" @click.stop
                                                                style="--p-colorpicker-preview-focus-ring-color :none" />
                                                        </div>
                                                    </InputGroupAddon>
                                                    <InputText v-model="scheduleBgColorLocal" @blur="validateBgColor"
                                                        style="--p-inputtext-focus-border-color:white" maxlength="7"
                                                        :invalid="!isBgColorValid"
                                                        :style="{ color: !isBgColorValid ? '#f87171' : '#ffffff' }" />
                                                </InputGroup>
                                                <input ref="fileInput" type="file" accept="image/*" class="hidden"
                                                    @change="onFileSelect" />
                                                <Button severity="contrast" :disabled="isLoadingBackground"
                                                    @click="fileInput?.click()">
                                                    <Icon v-if="!isLoadingBackground" name="lucide:image" size="18" />
                                                    <Icon v-else name="lucide:loader-circle" size="18"
                                                        class="animate-spin" />
                                                    <span class="hidden sm:inline">
                                                        {{ isLoadingBackground ? 'Chargement...' : 'Choisir une image'
                                                        }}
                                                    </span>
                                                </Button>
                                            </div>
                                        </template>
                                        <template v-else="schedule?.style?.backgroundUrl">
                                            <div class="flex flex-row gap-2 items-center justify-between">
                                                <div
                                                    class="relative rounded w-24 aspect-[16/9] overflow-hidden border border-white/20">
                                                    <img :src="schedule.style.backgroundUrl"
                                                        class="w-full h-full object-cover" />
                                                    <div class="absolute inset-0 bg-black/20"></div>
                                                </div>
                                                <div class="flex flex-row gap-2">
                                                    <input ref="fileInput" type="file" accept="image/*" class="hidden"
                                                        @change="onFileSelect" />
                                                    <Button severity="contrast" :disabled="isLoadingBackground" outlined
                                                        @click="fileInput?.click()">
                                                        <Icon name="lucide:refresh-cw" size="18" />
                                                        <span class="hidden sm:inline">Remplacer</span>
                                                    </Button>
                                                    <Button severity="danger" @click="removeBackgroundImage"
                                                        :disabled="isLoadingBackground" outlined>
                                                        <Icon name="lucide:trash-2" size="18" />
                                                        <span class="hidden sm:inline">Supprimer</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                    <div class="flex flex-row w-full gap-3 items-center"
                                        v-if="schedule?.style?.backgroundUrl">
                                        <span class="font-semibold text-sm min-w-16">Opacité</span>
                                        <InputNumber v-model="backgroundOpacity" :min="0" :max="100" fluid
                                            @update:modelValue="updateBackgroundOpacity" showButtons
                                            buttonLayout="horizontal" style="--p-inputtext-focus-border-color: white">
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
                                                    <span
                                                        class="text-sm sm:text-base lg:text-sm xl:text-base">Couleur</span>
                                                    <ColorPicker ref="textColorPicker" v-model="scheduleTextColorLocal"
                                                        format="hex" @click.stop
                                                        style="--p-colorpicker-preview-focus-ring-color :none" />
                                                </div>
                                            </InputGroupAddon>
                                            <InputText v-model="scheduleTextColorLocal" @blur="validateTextColor"
                                                style="--p-inputtext-focus-border-color:white" maxlength="7"
                                                :invalid="!isTextColorValid"
                                                :style="{ color: !isTextColorValid ? '#f87171' : '#ffffff' }" />
                                        </InputGroup>
                                        <div class="flex flex-col gap-2">
                                            <p class="font-semibold text-sm">Police</p>
                                            <button
                                                class="flex items-center justify-between px-3 py-2.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all w-full"
                                                @click="fontModal = true">
                                                <span class="text-sm" :style="{ fontFamily: currentFont }">{{
                                                    currentFont ??
                                                    'Inter' }}</span>
                                                <Icon name="lucide:chevron-right" size="16" class="text-zinc-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <Divider />

                                    <!-- Modal polices -->
                                    <Dialog v-model:visible="fontModal" modal dismissableMask
                                        header="Choisir une police" :style="{ width: '32rem', margin: '1rem' }"
                                        :draggable="false">
                                        <div class="grid grid-cols-2 gap-2">
                                            <button v-for="font in FONTS" :key="font.name"
                                                class="relative flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all"
                                                :class="currentFont === font.name
                                                    ? 'border-white bg-white/10'
                                                    : 'border-zinc-700 hover:border-zinc-500'"
                                                @click="onFontClick(font)">
                                                <span class="text-sm" :style="{ fontFamily: font.name }">
                                                    {{ font.label }}</span>
                                                <span v-if="font.premium && !isSub && !hasFeature('premium_theme')"
                                                    class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                                                    Premium
                                                </span>
                                            </button>
                                        </div>
                                    </Dialog>
                                    <FeatureUnlockModal v-model="premiumModal" featureKey="premium_theme" />


                                    <!-- Section Options -->
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2">
                                            <Icon name="lucide:settings-2" size="16" class="text-gray-400 shrink-0" />
                                            <p class="font-semibold text-xs uppercase tracking-wider text-gray-400">
                                                Options d'affichage
                                            </p>
                                        </div>
                                        <div class="space-y-1">
                                            <!-- Avec séparateur subtil -->
                                            <div class="flex justify-between items-center px-3 py-2.5">
                                                <div class="flex items-center gap-2">
                                                    <Icon name="lucide:calendar" size="18"
                                                        class="text-gray-400 shrink-0" />
                                                    <span class="text-xs sm:text-sm">Date automatique</span>
                                                </div>
                                                <ToggleSwitch v-model="autoSubtitle"
                                                    style="--p-toggleswitch-checked-background: white; --p-toggleswitch-checked-hover-background: white"
                                                    @change="toggleAutoSubtitle" />
                                            </div>
                                            <div class="flex justify-between items-center px-3 py-2.5">
                                                <div class="flex items-center gap-2">
                                                    <Icon name="lucide:type" size="18" class="text-gray-400 shrink-0" />
                                                    <span class="text-xs sm:text-sm">Afficher les titres</span>
                                                </div>
                                                <ToggleSwitch v-model="titleVisible"
                                                    style="--p-toggleswitch-checked-background: white; --p-toggleswitch-checked-hover-background: white"
                                                    @click="toggleTitleVisibility" />
                                            </div>

                                            <div class="flex justify-between items-center px-3 py-2.5">
                                                <div class="flex items-center gap-2">
                                                    <Icon name="lucide:clock" size="18"
                                                        class="text-gray-400 shrink-0" />
                                                    <span class="text-xs sm:text-sm">Afficher l'heure de fin</span>
                                                </div>
                                                <ToggleSwitch v-model="endTimeVisible"
                                                    style="--p-toggleswitch-checked-background: white; --p-toggleswitch-checked-hover-background: white"
                                                    @click="toggleEndTimeVisibility" />
                                            </div>

                                            <div class="flex justify-between items-center px-3 py-2.5">
                                                <div class="flex items-center gap-2">
                                                    <Icon name="lucide:calendar-off" size="18"
                                                        class="text-gray-400 shrink-0" />
                                                    <span class="text-xs sm:text-sm">Afficher les jours sans
                                                        stream</span>
                                                </div>
                                                <ToggleSwitch v-model="daysWithoutStreamVisible"
                                                    style="--p-toggleswitch-checked-background: white; --p-toggleswitch-checked-hover-background: white"
                                                    @click="toggleDaysWithoutStreamVisibility" />
                                            </div>
                                            <div class="flex justify-between items-center px-3 py-2.5">
                                                <div class="flex items-center gap-2">
                                                    <Icon name="lucide:badge-check" size="18"
                                                        class="text-gray-400 shrink-0" />
                                                    <span class="text-xs sm:text-sm">Masquer le branding</span>
                                                </div>
                                                <ToggleSwitch v-model="brandingToggle"
                                                    style="--p-toggleswitch-checked-background: white; --p-toggleswitch-checked-hover-background: white"
                                                    @click.prevent="onToggleBranding" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>

                <FeatureUnlockModal v-model="noBrandingModal" featureKey="no_branding" />

                <div class="flex-1 min-w-0 flex flex-col gap-4">

                    <!-- Barre d'outils -->
                    <Menubar class="w-full">
                        <template #start>
                            <!-- Toggle format -->
                            <SelectButton v-model="formatValue" :options="formatOptions" :allowEmpty="false"
                                @update:modelValue="onFormatChange">
                                <template #option="{ option }">
                                    <Icon :name="option === 'landscape' ? 'lucide:monitor' : 'lucide:smartphone'"
                                        size="16" />
                                </template>
                            </SelectButton>
                        </template>
                        <template #end>
                            <div class="flex items-center gap-1 sm:gap-2">
                                <!-- <Button severity="secondary">
                                    <Icon name="lucide:share" size="18" />
                                    <span
                                    class="hidden sm:inline text-xs md:text-base lg:text-xs xl:text-base">Partager</span>
                                </Button> -->
                                <Button severity="secondary" :disabled="isPreviewing" :loading="isPreviewing"
                                    @click="mobileFormat ? previewScheduleMobile(currentFont, showBranding) : previewSchedule(currentFont, showBranding)">
                                    <Icon v-if="isPreviewing" name="lucide:loader-circle" size="18"
                                        class="animate-spin" />
                                    <Icon v-else name="lucide:eye" size="18" />
                                    <span
                                        class="hidden sm:inline text-xs md:text-base lg:text-xs xl:text-base whitespace-nowrap">Aperçu
                                        du planning</span>
                                </Button>
                                <!-- Bouton export adaptatif -->
                                <Button severity="contrast" :disabled="isExporting" :loading="isExporting"
                                    @click="mobileFormat ? exportScheduleMobile(currentFont, showBranding) : exportSchedule(currentFont, showBranding)">
                                    <Icon v-if="isExporting" name="lucide:loader-circle" size="18"
                                        class="animate-spin" />
                                    <Icon v-else name="lucide:download" size="18" />
                                    <span class="text-xs md:text-base lg:text-xs xl:text-base">Télécharger</span>
                                </Button>
                            </div>
                        </template>
                    </Menubar>
                    <FeatureUnlockModal v-model="mobileExportModal" featureKey="mobile_export" />

                    <!-- Planning hebdomadaire -->
                    <div ref="viewportRef" class="relative w-full flex justify-center">
                        <!-- Planning mobile-->
                        <div class="absolute" :style="[scalerStyleMobile, {
                            opacity: mobileFormat ? 1 : 0,
                            pointerEvents: mobileFormat ? 'auto' : 'none'
                        }]">
                            <ScheduleMobileCard :schedule="schedule" :slots="slots" :daysOptions="daysOptions"
                                :scheduleBgColor="scheduleBgColor" :scheduleTextColor="scheduleTextColor"
                                :backgroundOpacity="backgroundOpacity" :formatTime="formatTime"
                                :slotsForDay="slotsForDay" :endTimeVisible="endTimeVisible" :titleVisible="titleVisible"
                                :showBranding="schedule?.style?.showBranding !== false" />
                        </div>
                        <div class="absolute" :style="[scalerStyle, {
                            opacity: mobileFormat ? 0 : 1,
                            pointerEvents: mobileFormat ? 'none' : 'auto'
                        }]">
                            <!-- Planning desktop -->
                            <div v-show="!mobileFormat" id="scheduleCard">
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
                                            <div class="flex flex-col w-full"
                                                :style="{ color: scheduleTextColor, textShadow: '0 0 2px rgba(0,0,0,0.8)' }">
                                                <!-- Titre -->
                                                <template v-if="editing.field === 'title'">
                                                    <input :ref="el => inputRefs['title'] = el" v-model="editing.value"
                                                        @blur="saveEdit" @keyup.enter="saveEdit"
                                                        @keyup.esc.prevent.stop="cancelEdit"
                                                        class="text-4xl font-bold bg-transparent border-none focus:outline-none"
                                                        maxlength="60" :style="{ fontFamily: currentFont }" />
                                                </template>
                                                <template v-else>
                                                    <div class="flex items-center gap-2 hover:cursor-pointer"
                                                        @click="editField('title')">
                                                        <h1 class="text-4xl font-bold"
                                                            :style="{ fontFamily: currentFont }"> {{ schedule?.title }}
                                                        </h1>
                                                        <Icon name="lucide:pencil" size="34"
                                                            class="transition ignore-export" />
                                                    </div>
                                                </template>
                                                <!-- Sous-titre -->
                                                <template v-if="editing.field === 'subtitle'">
                                                    <input :ref="el => inputRefs['subtitle'] = el"
                                                        :disabled="autoSubtitle" v-model="editing.value"
                                                        @blur="saveEdit" @keyup.enter="saveEdit"
                                                        @keyup.esc.prevent.stop="cancelEdit"
                                                        class="text-base font-semibold bg-transparent border-none focus:outline-none w-full"
                                                        :style="{ fontFamily: currentFont }" maxlength="100" />
                                                </template>
                                                <template v-else>
                                                    <div class="flex items-center gap-2 hover:cursor-pointer"
                                                        :class="autoSubtitle ? 'pointer-events-none' : ''"
                                                        @click="editField('subtitle')">
                                                        <div class="text-base font-semibold"
                                                            :style="{ fontFamily: currentFont }"> {{ schedule?.subtitle
                                                            }}
                                                        </div>
                                                        <Icon v-if="!autoSubtitle" name="lucide:pencil" size="18"
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
                                                        :style="{ color: scheduleTextColor, textShadow: '0 0 2px rgba(0,0,0,0.8)', fontFamily: currentFont }">
                                                        {{ day.label }}</div>
                                                    <!-- Créneaux -->
                                                    <div class="h-130 w-full">

                                                        <!-- CAS : aucun créneau -->
                                                        <template v-if="slotsForDay(day.label).length === 0">
                                                            <div
                                                                class="day-slot-empty h-full w-full bg-black/20 rounded-lg">
                                                                <div class="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer border-zinc-400 hover:border-zinc-200 
                            transition-all h-full w-full " @click="openSlotModal(day.label)">
                                                                    <div
                                                                        class="flex flex-col items-center justify-center gap-1 ">
                                                                        <Icon name="lucide:plus" size="18"
                                                                            class="text-zinc-400" />
                                                                        <!-- <span class="text-center text-xs text-zinc-400">Ajouter un
                                        stream</span> -->
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>

                                                        <!-- CAS : il y a des créneaux -->
                                                        <template v-else>
                                                            <div class="h-full bg-black/20 rounded-lg">
                                                                <div
                                                                    class="grid grid-rows-[auto_1fr_auto] gap-2 h-full export-day-column">
                                                                    <!-- Zone + en haut -->
                                                                    <div class="h-6 border-2 border-dashed border-zinc-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-zinc-200 transition-all w-full row-span-1 ignore-export"
                                                                        @click="openSlotModal(day.label, undefined, 'before')"
                                                                        v-tooltip.bottom="{ value: `Ajouter un stream avant`, pt: { text: '!text-sm' } }">
                                                                        <Icon name="lucide:plus" size="14"
                                                                            class="text-zinc-400" />
                                                                    </div>
                                                                    <!-- Créneaux -->
                                                                    <div
                                                                        class="flex flex-col gap-1 overflow-hidden w-full export-day-column-content">
                                                                        <template v-for="slot in slotsForDay(day.label)"
                                                                            :key="slot.id">
                                                                            <div class="border-4 rounded-lg min-h-0 w-full relative flex flex-col group transition-all day-slot"
                                                                                :data-start-hour="parseInt(slot.start_at.split(':')[0])"
                                                                                :data-size="slot.size"
                                                                                :style="[slotStyle(slot), slotFlexStyle(slot, day.label)]">
                                                                                <div class="flex-1"></div>
                                                                                <!-- Tag titre -->
                                                                                <div class="bg-black/80 text-sm font-bold px-2 py-1 rounded-b-md z-60 line-clamp-1"
                                                                                    v-if="titleVisible"
                                                                                    :style="{ fontFamily: currentFont }">
                                                                                    {{ slot.title }}
                                                                                </div>
                                                                                <!-- Heure -->
                                                                                <div class="absolute top-[-1px] left-[-1px] z-100 px-2 py-1 text-base font-semibold rounded-br-md rounded-tl-sm"
                                                                                    :style="slot.game.cover ? { backgroundColor: `#${slot.color}`, fontFamily: currentFont } : { fontFamily: currentFont }">
                                                                                    {{ formatTime(slot.start_at) }}
                                                                                    <span v-if="endTimeVisible">
                                                                                        -
                                                                                        {{ formatTime(slot.end_at) }}
                                                                                    </span>
                                                                                </div>
                                                                                <!-- Overlay desktop -->
                                                                                <div class="hidden lg:flex absolute opacity-0 group-hover:opacity-100 z-50 transition-opacity h-full w-full top-0 left-0 rounded-sm overflow-hidden"
                                                                                    :class="slotOverlayDirection(slot, day.label)">
                                                                                    <!-- Modifier -->
                                                                                    <div class="flex-1 flex items-center justify-center bg-black/50 hover:bg-black/70 cursor-pointer"
                                                                                        @click.prevent="openSlotModal(day.label, slot)">
                                                                                        <Icon name="lucide:pencil"
                                                                                            size="24"
                                                                                            class="text-white" />
                                                                                    </div>
                                                                                    <!-- Supprimer -->
                                                                                    <div class="flex-1 flex items-center justify-center bg-black/50 hover:bg-black/70 cursor-pointer"
                                                                                        @click.prevent="showDeleteConfirmation = true; slotToDelete = slot">
                                                                                        <Icon name="lucide:trash-2"
                                                                                            size="24"
                                                                                            class="text-white" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </template>
                                                                    </div>
                                                                    <!-- Zone + en bas -->
                                                                    <div class="h-6 border-2 border-dashed border-zinc-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-zinc-200 transition-all w-full row-span-1 ignore-export"
                                                                        @click="openSlotModal(day.label, undefined, 'after')"
                                                                        v-tooltip.bottom="{ value: `Ajouter un stream après`, pt: { text: '!text-sm' } }">
                                                                        <Icon name="lucide:plus" size="14"
                                                                            class="text-zinc-400" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                    <!-- Footer -->
                                    <div v-if="schedule?.style?.showBranding !== false"
                                        class="absolute bottom-4 right-6 z-20 pointer-events-none ignore-export">
                                        <div class="text-right leading-none select-none">
                                            <div class="text-[10px] font-light uppercase tracking-widest text-white/70"
                                                style="text-shadow: 0 1px 3px rgba(0,0,0,0.8)">
                                                Made with
                                            </div>
                                            <div class="text-xs font-semibold uppercase tracking-wide text-white/90"
                                                style="text-shadow: 0 1px 3px rgba(0,0,0,0.8)">
                                                StreamLink
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </template>

    <!-- Modal d'ajout de créneau -->
    <Dialog v-model:visible="visible" dismissable-mask modal
        :header="editingSlot ? 'Modifier le stream' : 'Ajouter un stream'" :style="{ width: '30rem', margin: '1rem' }"
        :draggable="false">
        <div class="flex flex-col space-y-5 mb-2">

            <!-- Catégorie Twitch -->
            <div class="flex flex-col gap-2">
                <label for="game-search" class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                    <Icon name="lucide:gamepad-2" size="16" class="shrink-0" />
                    Catégorie Twitch
                    <span class="text-red-500">*</span>
                </label>
                <InputGroup>
                    <InputGroupAddon>
                        <Icon name="lucide:search" size="18" class="text-zinc-500" />
                    </InputGroupAddon>
                    <AutoComplete v-model="selectedGame" :suggestions="gameSuggestions" @complete="searchGames"
                        optionLabel="label" placeholder="Ex: League of Legends, Valorant..." fluid forceSelection
                        style="--p-inputtext-focus-border-color:white" id="game-search" showClear>
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <img v-if="slotProps.option.cover" :src="slotProps.option.cover"
                                    :alt="slotProps.option.label"
                                    class="w-8 h-10 rounded border border-zinc-700 flex-shrink-0" />
                                <div v-else
                                    class="w-8 h-10 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                                    <Icon name="lucide:image-off" size="18" class="text-zinc-600 shrink-0" />
                                </div>
                                <span>{{ slotProps.option.label }}</span>
                            </div>
                        </template>
                        <template #empty>
                            <div class="flex justify-center items-center py-2 text-sm text-zinc-400">
                                <span v-if="isSearching">Recherche en cours...</span>
                                <span v-else-if="selectedGame.length > 0 && selectedGame.length < 3">
                                    Tapez au moins 3 caractères…
                                </span>
                                <span v-else>
                                    Aucun jeu trouvé
                                </span>
                            </div>
                        </template>
                    </AutoComplete>
                </InputGroup>
            </div>

            <!-- Titre du stream -->
            <div class="flex flex-col gap-2 relative">
                <label for="stream-title" class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                    <Icon name="lucide:type" size="16" class="shrink-0" />
                    Titre du stream
                </label>
                <InputText id="stream-title" type="text" v-model="title"
                    :placeholder="`${selectedGame?.label || 'Ex: Gameplay, collaboration...'}`" fluid maxlength="30"
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
                        <label class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                            <Icon name="lucide:palette" size="16" class="shrink-0" />
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
                        <Icon name="lucide:wand-2" size="14" class="shrink-0" />
                        Modifiée
                    </div>
                </div>

                <InputGroup>
                    <InputGroupAddon style="--p-inputgroup-addon-color:white">
                        <ColorPicker ref="slotColorPicker" v-model="colorInput" format="hex" @click.stop
                            style="--p-colorpicker-preview-focus-ring-color :none" @change="useGameColor = false" />
                    </InputGroupAddon>
                    <InputText v-model="colorInput" @blur="colorInput = slotColor" @input="useGameColor = false"
                        style="--p-inputtext-focus-border-color:white" maxlength="7"
                        :style="{ color: isColorInvalid ? '#f87171' : '#ffffff' }" />
                    <InputGroupAddon v-tooltip.bottom="'Réinitialiser en couleur automatique'"
                        class="cursor-pointer flex items-center gap-1" @click="resetColor">
                        <Icon name="lucide:rotate-ccw" size="18" class="shrink-0" />
                        <span class="text-sm sm:text-base">Réinitialiser</span>
                    </InputGroupAddon>
                </InputGroup>
            </div>

            <!-- Jours de stream -->
            <div class="flex flex-col gap-2">
                <label class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                    <Icon name="lucide:calendar-days" size="16" class="shrink-0" />
                    Jours de stream
                    <span class="text-red-500">*</span>
                </label>
                <span class="text-xs text-zinc-500">
                    {{ editingSlot
                        ? 'Sélectionne un nouveau jour pour déplacer ce créneau'
                        : 'Sélectionne un ou plusieurs jours pour ce créneau' }}
                </span>
                <SelectButton v-model="selectedDays" :options="daysOptions" optionLabel="label" :multiple="!editingSlot"
                    aria-labelledby="multiple" class="mt-1" :pt="{
                        root: { class: 'flex gap-1 w-full flex-wrap' },
                        pcToggleButton: {
                            root: { class: 'flex-1 min-w-[80px] sm:min-w-[90px] !rounded-lg' },
                            label: { class: 'text-xs sm:text-base' }
                        }
                    }" />
            </div>

            <!-- Horaires -->
            <div class="flex flex-col gap-2">
                <label class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                    <Icon name="lucide:clock" size="16" />
                    Horaires
                    <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                    <div class="flex flex-col gap-1">
                        <label for="start-time" class="text-xs text-zinc-500">Début</label>
                        <InputText id="start-time" type="time" v-model="startTime"
                            style="--p-inputtext-focus-border-color:white" />
                    </div>
                    <Icon name="lucide:arrow-right" size="18" class="text-zinc-500 mt-5 shrink-0" />
                    <div class="flex flex-col gap-1">
                        <label for="end-time" class="text-xs text-zinc-500">Fin</label>
                        <InputText id="end-time" type="time" v-model="endTime"
                            style="--p-inputtext-focus-border-color:white" />
                    </div>
                </div>
            </div>

            <!-- Taille du créneau -->
            <div class="flex flex-col gap-2">
                <label class="font-semibold text-xs sm:text-sm flex items-center gap-2">
                    <Icon name="lucide:maximize-2" size="16" class="shrink-0" />
                    Taille du créneau
                    <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div v-for="option in sizeOptions" :key="option.value"
                        class="flex flex-col items-center gap-1 p-2 rounded-lg border-2 cursor-pointer transition-all"
                        :class="selectedSize === option.value
                            ? 'border-white bg-white/10'
                            : 'border-zinc-700 hover:border-zinc-500 '" @click="selectedSize = option.value">
                        <Icon :name="option.value === 'fixed' ? 'lucide:square-split-vertical' : 'lucide:expand'"
                            size="16" :class="selectedSize === option.value ? 'text-white' : 'text-zinc-400'" />
                        <span class="text-sm font-semibold"
                            :class="selectedSize === option.value ? 'text-white' : 'text-zinc-400'">
                            {{ option.label }}
                        </span>
                        <span class="text-xs text-center leading-tight"
                            :class="selectedSize === option.value ? 'text-zinc-300' : 'text-zinc-500'">
                            {{ option.value === 'fixed'
                                ? 'Moitié de journée'
                                : 'Prend tout l\'espace disponible' }}
                        </span>
                    </div>
                </div>
            </div>

        </div>
        <template #footer>
            <div class="flex gap-2 w-full">
                <Button type="button" label="Annuler" severity="secondary" @click="visible = false" outlined
                    class="flex-1">
                    <Icon name="lucide:x" size="18" class="shrink-0" />
                    <span class="text-xs sm:text-base shrink-0">Annuler</span>
                </Button>
                <Button type="button" :label="editingSlot ? 'Mettre à jour' : 'Enregistrer'" severity="contrast"
                    @click="saveSlot"
                    :disabled="isColorInvalid || !selectedGame?.label || !startTime || !endTime || selectedDays.length === 0"
                    class="flex-1">
                    <Icon :name="editingSlot ? 'lucide:check' : 'lucide:save'" size="18" class="shrink-0" />
                    <span class="text-xs sm:text-base shrink-0">
                        {{ editingSlot ? 'Mettre à jour' : 'Enregistrer' }}</span>
                </Button>
            </div>
        </template>
    </Dialog>

    <!-- Modal d'aperçu de planning -->
    <Dialog v-model:visible="showPreview" dismissableMask modal :style="{ width: mobileFormat ? '25vw' : '65vw' }"
        :draggable="false" :pt="{ root: { style: 'border-radius: 8px; overflow: hidden' } }">
        <template #container="{ closeCallback }">
            <img v-if="previewDataUrl" :src="previewDataUrl" :style="mobileFormat
                ? { height: '90vh', width: 'auto', display: 'block', margin: '0 auto' }
                : { width: '100%', height: 'auto' }" />
        </template>
    </Dialog>

    <!-- Modal d'aperçu de confirmation de suppression -->
    <Dialog v-model:visible="showDeleteConfirmation" dismissableMask modal :draggable="false"
        :style="{ margin: '1rem' }">
        <template #container="{ closeCallback }">
            <div class="flex flex-col items-center space-y-4 p-6 ">
                <h2 class="text-md sm:text-xl font-bold text-center">Confirmer la suppression</h2>
                <p class="text-center text-zinc-500 text-xs sm:text-base">
                    Es-tu sûr de vouloir supprimer le stream de <strong>{{ slotToDelete?.game.label }}</strong> le
                    <strong>{{ slotToDelete?.day }}</strong> à <strong>{{ formatTime(slotToDelete?.start_at) }}</strong>
                    ?
                </p>
                <div class="flex gap-2 w-full items-center justify-center">
                    <Button severity="secondary" @click="showDeleteConfirmation = false" class="flex-1">
                        <Icon name="lucide:x" size="18" class="shrink-0" />
                        <span class="text-sm sm:text-base">Annuler</span>
                    </Button>
                    <Button severity="danger" @click="confirmDeleteSlot" class="flex-1">
                        <Icon name="lucide:trash-2" size="18" class="shrink-0" />
                        <span class="text-sm sm:text-base">Supprimer</span>
                    </Button>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
const scheduleStore = useScheduleStore()
const scheduleSlotStore = useScheduleSlotStore()
const { loading, schedule } = storeToRefs(scheduleStore)
const { slots } = storeToRefs(scheduleSlotStore)
const supabase = useSupabaseClient()

const formatValue = ref('landscape')
const formatOptions = ref(['landscape', 'mobile'])
const mobileFormat = computed(() => formatValue.value === 'mobile')

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

// Gestion du sous-titre automatique
const autoSubtitle = ref(schedule?.autoSubtitle ?? false)
async function toggleAutoSubtitle() {
    await scheduleStore.updateSchedule({
        autoSubtitle: autoSubtitle.value,
        subtitle: autoSubtitle.value
            ? getCurrentWeekSubtitle()
            : scheduleStore.schedule?.subtitle
    })
}
watch(
    () => scheduleStore.schedule,
    (schedule) => {
        if (!schedule) return
        autoSubtitle.value = schedule.autoSubtitle ?? false
    },
    { immediate: true }
)

// Charge les slots
async function loadSlots() {
    if (!schedule.value) return
    await scheduleSlotStore.fetchSlots(schedule.value.id)
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

// Fonction pour générer le style de flex d'un slot selon sa taille et les autres slots du même jour
function slotFlexStyle(slot: any, dayLabel: string) {
    const daySlots = slotsForDay(dayLabel)

    // FULL → prend tout
    if (slot.size === 'auto') {
        return { flex: '1 1 0%' }
    }

    // Fixed → compter tous les fixed de la journée
    const allFixedSlots = daySlots.filter(s => s.size === 'fixed')

    // Si un seul fixed dans toute la journée → 50% et position selon période
    if (allFixedSlots.length === 1) {
        const hour = parseInt(slot.start_at.split(':')[0])
        const isAfternoon = hour >= 12
        return {
            flex: '0 0 50%',
            ...(isAfternoon ? { marginTop: 'auto' } : {})
        }
    }

    // Sinon → tous les fixed partagent l'espace restant
    return { flex: '1 1 0%' }
}

// Fonction pour déterminer la direction de l'overlay d'un slot selon le nombre de slots du même jour
function slotOverlayDirection(slot: any, dayLabel: string) {
    const slots = slotsForDay(dayLabel)

    if (slot.size === 'fixed' || slots.length > 1) return 'flex-row'
    return 'flex-col'
}

// Affiche la confirmation de suppression d'un slot
const showDeleteConfirmation = ref(false)
const slotToDelete = ref<any>(null)

// Confirme la suppression d'un créneau
async function confirmDeleteSlot() {
    if (slotToDelete.value) {
        await scheduleSlotStore.deleteSlot(slotToDelete.value.id)
        await loadSlots()
        slotToDelete.value = null
    }
    showDeleteConfirmation.value = false
}

// Formate une heure au format HH:mm en HHhmm
function formatTime(time: string) {
    if (!time) return ''
    const [h, m] = time.split(':')
    return `${h}h${m}`
}

// Gestion des couleurs du planning
const {
    localValue: scheduleBgColorLocal,
    validateValue: validateBgColor,
    isValid: isBgColorValid,
} = useScheduleColor(scheduleStore, 'bgColor')

const {
    localValue: scheduleTextColorLocal,
    validateValue: validateTextColor,
    isValid: isTextColorValid,
} = useScheduleColor(scheduleStore, 'textColor')

const scheduleBgColor = computed(() => {
    return `#${schedule.value?.style?.bgColor || ''}`
})

const scheduleTextColor = computed(() => {
    return `#${schedule.value?.style?.textColor || ''}`
})

// Police actuelle
const currentFont = computed(() => schedule.value?.style?.fontFamily ?? null)
const fontModal = ref(false)
const premiumModal = ref(false)

// Mise à jour de la police
const onFontClick = (font: any) => {
    if (font.premium && !hasFeature('premium_theme')) {
        premiumModal.value = true
        fontModal.value = false
        return
    }
    scheduleStore.updateSchedule({ style: { fontFamily: font.name } })
}

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
    const updatedStyle = {
        ...(schedule.value.style as Record<string, any> ?? {}),  // ← merge avec le style existant
        ...newStyle
    }

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

// Toggle du branding
const brandingToggle = computed(() => hasFeature('no_branding') && schedule.value?.style?.showBranding === false)
const showBranding = computed(() => schedule.value?.style?.showBranding !== false)
const noBrandingModal = ref(false)

const onToggleBranding = () => {
    if (!hasFeature('no_branding')) {
        noBrandingModal.value = true
        return
    }
    updateStyle({ showBranding: brandingToggle.value ? true : false })
}

// Gestion de la génération d'aperçu et de l'export du planning
const {
    previewSchedule,
    previewScheduleMobile,
    exportSchedule,
    exportScheduleMobile,
    previewDataUrl,
    showPreview,
    isExporting,
    isPreviewing
} = useScheduleScreenshot()

const scheduleId = computed(() => schedule.value?.id)

// Gestion de la modal de créneau
const {
    visible,
    selectedGame,
    isSearching,
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
    selectedSize,
    sizeOptions,
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
const BASE_SCALE = 0.92
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
    transformOrigin: 'center top'
}))

// Gestion du redimensionnement et du scaling du planning en mobile (format vertical)
const MOBILE_WIDTH = 1080
const MOBILE_HEIGHT = 1920

const scalerStyleMobile = computed(() => {
    if (!viewportWidth.value) return {}

    const scaleByWidth = viewportWidth.value / MOBILE_WIDTH
    const scaleByHeight = (viewportWidth.value * 0.5) / MOBILE_HEIGHT // 80% de la hauteur viewport
    const scale = Math.min(scaleByWidth, scaleByHeight, 0.4) // max 0.4 pour pas trop grand

    return {
        width: `${MOBILE_WIDTH}px`,
        height: `${MOBILE_HEIGHT}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'center top'
    }
})

// Gestion de l'upload d'image d'arrière-plan
const imageUrl = ref<string | null>(null)
const isLoadingBackground = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const onFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    isLoadingBackground.value = true
    imageUrl.value = URL.createObjectURL(file)

    try {
        await replaceBackgroundImage(file)
    } finally {
        isLoadingBackground.value = false
        input.value = '' // permet de re-sélectionner le même fichier
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
const backgroundOpacity = ref(100) // valeur par défaut

// Watch pour mettre à jour l'opacité de l'arrière-plan dès que le planning est chargé ou que l'opacité change
watch(
    () => schedule.value?.style?.backgroundOpacity,
    (val) => {
        if (val !== undefined && val !== backgroundOpacity.value) {
            backgroundOpacity.value = val
        }
    },
    { immediate: true }
)

let timeout: ReturnType<typeof setTimeout> | null = null

// Met à jour l'opacité de l'arrière-plan dans le store avec un debounce pour éviter les mises à jour trop fréquentes
const updateBackgroundOpacity = (value: number) => {
    backgroundOpacity.value = value
    if (!schedule.value) return

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
        scheduleStore.updateSchedule({ style: { backgroundOpacity: value } })
    }, 300)
}

onMounted(async () => {
    await scheduleStore.getOrCreateSchedule()
    await loadSlots()

    // Si autoSubtitle activé → mettre à jour le sous-titre avec la semaine courante
    if (autoSubtitle.value) {
        const currentWeekSubtitle = getCurrentWeekSubtitle()
        if (schedule!.subtitle !== currentWeekSubtitle) {
            await scheduleStore.updateSchedule({ subtitle: currentWeekSubtitle })
        }
    }

    update()
    window.addEventListener('resize', update)
})

onUnmounted(() => {
    window.removeEventListener('resize', update)
})

definePageMeta({
    layout: 'fullscreen'
})

const { hasFeature, isSub } = useFeatures()

const onFormatChange = (val: string) => {
    if (val === 'mobile' && !hasFeature('mobile_export')) {
        mobileExportModal.value = true
        nextTick(() => {
            formatValue.value = 'landscape'
        })
        return
    }
    formatValue.value = val
}

const mobileExportModal = ref(false)
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

.tab-panels-scroll {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #9F9F9F transparent;
}
</style>
