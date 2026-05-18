<template>
    <div class="flex flex-col gap-4">
        <!-- Avatar et bouton de modification -->
        <div class="flex flex-row gap-4 items-center max-w-2xl lg:w-lg xl:w-2xl">
            <AvatarUploader />
            <div class="min-w-0">
                <div class="flex flex-col" @click="openStreamerModal()">
                    <div class="flex items-center gap-2">
                        <span class="font-medium hover:underline cursor-pointer">
                            {{ streamer?.username }}
                        </span>
                        <img v-if="streamer?.language && streamer.language !== 'OTHER'"
                            :src="`https://flagcdn.com/w80/${getFlag(streamer.language)}.png`"
                            class="w-4 h-[12px] object-cover rounded-xs shadow-sm hover:cursor-pointer" />
                        <span v-else-if="streamer?.language === 'OTHER'" class="flex items-center">
                            <Icon name="lucide:globe" size="16" />
                        </span>
                        <span v-else class="text-xs text-muted hover:underline cursor-pointer">
                            Choisir une langue
                        </span>
                    </div>
                    <span class="block text-sm font-medium text-muted hover:underline cursor-pointer truncate">
                        {{ streamer?.bio || 'Ajouter une description' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Modal de modification du profil -->
        <Dialog v-model:visible="streamerModal" modal dismissableMask :draggable="false"
            :style="{ width: '25rem', margin: '1rem' }"
            :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
            <template #container>
                <div class="flex flex-col rounded-xl border border-white/8 bg-dark overflow-y-auto max-h-[90vh]">

                    <!-- Header -->
                    <div class="flex items-center justify-between px-5 pt-5 top-0 bg-dark z-10">
                        <h2 class="font-heading text-xl font-bold text-white">Modifier le profil</h2>
                        <button @click="streamerModal = false"
                            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/8 text-muted hover:text-white transition-colors">
                            <Icon name="lucide:x" size="22" />
                        </button>
                    </div>

                    <!-- Contenu -->
                    <div class="flex flex-col gap-5 p-5">

                        <!-- Nom -->
                        <div class="flex flex-col gap-2 relative">
                            <label for="username" class="text-xs sm:text-sm font-semibold flex items-center gap-2">
                                <Icon name="lucide:user" size="16" class="shrink-0" />
                                Nom <span class="text-red-400">*</span>
                            </label>
                            <InputText id="username" v-model="username" maxlength="30"
                                placeholder="Ton pseudo de streamer" fluid
                                style="--p-inputtext-focus-border-color:#6A5AE0; --p-inputtext-background:#18191c" />
                            <span class="absolute right-2 bottom-1 text-xs text-muted/50">
                                {{ username.length }}/30
                            </span>
                        </div>

                        <span v-if="usernameError" class="text-xs text-red-400">{{ usernameError }}</span>

                        <!-- Description -->
                        <div class="flex flex-col gap-2 relative">
                            <label for="description" class="text-xs sm:text-sm font-semibold flex items-center gap-2">
                                <Icon name="lucide:align-left" size="16" class="shrink-0" />
                                Description
                            </label>
                            <Textarea id="description" v-model="bio" rows="4" autoResize maxlength="120"
                                placeholder="Une courte description" fluid
                                style="--p-textarea-focus-border-color:#6A5AE0; --p-textarea-background:#18191c" />
                            <span class="absolute right-2 bottom-1 text-xs text-muted/50">{{ bio.length }}/120</span>
                        </div>

                        <!-- Langue -->
                        <div class="flex flex-col gap-2">
                            <label for="language" class="text-xs sm:text-sm font-semibold flex items-center gap-2">
                                <Icon name="lucide:globe" size="16" class="shrink-0" />
                                Langue
                            </label>
                            <Select id="language" v-model="language" :options="languageOptions" optionLabel="label"
                                optionValue="value" placeholder="Sélectionne une langue" showClear
                                :highlightOnSelect="false" fluid
                                style="--p-select-focus-border-color:#6A5AE0; --p-select-background:#18191c"
                                :pt="{ pcFilter: { root: { style: '--p-inputtext-focus-border-color:#6A5AE0' } } }">
                                <template #option="{ option }">
                                    <div class="flex items-center gap-2">
                                        <img v-if="option.value !== 'OTHER'"
                                            :src="`https://flagcdn.com/w80/${option.flag}.png`"
                                            class="h-[15px] w-5 object-cover rounded-xs shadow-sm" />
                                        <Icon v-else name="lucide:globe" size="16" />
                                        <span>{{ option.label }}</span>
                                    </div>
                                </template>
                                <template #value="{ value }">
                                    <div v-if="value" class="flex items-center gap-2">
                                        <img v-if="value !== 'OTHER'"
                                            :src="`https://flagcdn.com/w80/${getFlag(value)}.png`"
                                            class="h-[15px] w-5 object-cover rounded-xs shadow-sm" />
                                        <Icon v-else name="lucide:globe" size="16" />
                                        <span>{{ getLabel(value) }}</span>
                                    </div>
                                </template>
                            </Select>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex gap-2 px-5 pb-5 bottom-0 bg-dark">
                        <button type="button" @click="streamerModal = false"
                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors">
                            <Icon name="lucide:x" size="16" class="shrink-0" />
                            <span>Annuler</span>
                        </button>
                        <button type="button" @click="handleSave" :disabled="!username || !!usernameError"
                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                            <Icon name="lucide:check" size="16" class="shrink-0" />
                            <span>Mettre à jour</span>
                        </button>
                    </div>

                </div>
            </template>
        </Dialog>

        <!-- Stats rapides -->
        <template v-if="statsPending">
            <span class="animate-pulse h-4 w-42 bg-white/8 rounded" />
        </template>
        <template v-else>
            <div class="flex items-center gap-3 text-sm text-muted">
                <div class="flex items-center gap-1.5">
                    <Icon name="lucide:eye" size="16" />
                    <span>{{ stats?.total?.views ?? 0 }} vues</span>
                </div>
                <span class="text-white/20">|</span>
                <div class="flex items-center gap-1.5">
                    <Icon name="lucide:mouse-pointer-click" size="16" />
                    <span>{{ stats?.total?.clicks ?? 0 }} clics</span>
                </div>
            </div>
        </template>

        <!-- Bouton Ajouter un lien -->
        <button @click="newlinkModal = true"
            class="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-primary hover:bg-primary/80 text-white font-medium text-sm sm:text-base transition-colors">
            <Icon name="lucide:plus" size="18" />
            Ajouter un lien
        </button>

        <!-- Gérer les liens -->
        <div>
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-2 w-full ">
                    <!-- Liste des liens -->
                    <div v-if="links.length === 0" class="flex flex-col items-center gap-3 py-12 text-center">
                        <img src="/images/mascotte/charmi-confused-violet.svg" alt="" class="w-16 h-16 opacity-60" />
                        <p class="text-sm text-muted">Aucun lien pour l'instant</p>
                        <p class="text-xs text-muted/60">Clique sur "Ajouter un lien" pour commencer</p>
                    </div>
                    <Draggable v-model="links" item-key="id" handle=".drag-handle" @end="saveOrder"
                        class="flex flex-col gap-2" ghost-class="drag-ghost" chosen-class="drag-chosen"
                        :animation="100">
                        <template #item="{ element }">
                            <div class="rounded-xl p-3 bg-surface-dark border border-white/8">
                                <div class="flex flex-row gap-4 items-center">
                                    <!-- Drag handle avec icône GripVertical -->
                                    <div class="drag-handle cursor-grab flex-shrink-0">
                                        <Icon name="lucide:grip-vertical" size="20" class="text-muted shrink-0" />
                                    </div>
                                    <div class="flex flex-col flex-grow min-w-0 gap-2">
                                        <div class="flex justify-between items-center">
                                            <div class="flex flex-col flex-grow min-w-0">
                                                <!-- Titre -->
                                                <template v-if="editing.id === element.id && editing.field === 'title'">
                                                    <input :ref="el => inputRefs[`${element.id}-title`] = el"
                                                        v-model="editing.value" @blur="saveEdit(element)"
                                                        @keyup.enter="saveEdit(element)"
                                                        class="bg-transparent border-none focus:outline-none text-sm w-full my-1.5 truncate" />
                                                </template>
                                                <template v-else>
                                                    <div class="flex items-center my-1.5 gap-2 hover:cursor-pointer w-full min-w-0"
                                                        @click="editField(element, 'title')">
                                                        <span class="text-sm truncate max-w-[70%]">
                                                            {{ element.title }}
                                                        </span>
                                                        <Icon name="lucide:pencil" size="16"
                                                            class="text-muted shrink-0" />
                                                    </div>
                                                </template>
                                                <!-- URL -->
                                                <template v-if="editing.id === element.id && editing.field === 'url'">
                                                    <input :ref="el => inputRefs[`${element.id}-url`] = el"
                                                        v-model="editing.value" @blur="saveEdit(element)"
                                                        @keyup.enter="saveEdit(element)"
                                                        class="bg-transparent border-none focus:outline-none text-sm text-muted w-full truncate" />
                                                </template>
                                                <template v-else>
                                                    <div class="flex items-center gap-2 hover:cursor-pointer w-full min-w-0"
                                                        @click="editField(element, 'url')">
                                                        <span class="text-sm truncate max-w-[70%] text-muted">
                                                            {{ element.url }}
                                                        </span>
                                                        <Icon name="lucide:pencil" size="16"
                                                            class="text-muted shrink-0" />
                                                    </div>
                                                </template>
                                            </div>
                                            <div>
                                                <ToggleSwitch v-model="element.visible" class="flex-shrink-0 mr-1"
                                                    style="--p-toggleswitch-checked-background: #ffffff;--p-toggleswitch-checked-hover-background: #f3f4f6;"
                                                    @change="() => linkStore.toggleVisibility(element.id, element.visible)" />
                                            </div>
                                        </div>
                                        <!-- Actions -->
                                        <div class="flex justify-between items-center">
                                            <div class="flex items-center gap-1">
                                                <button
                                                    v-tooltip.bottom="{ value: 'Modifier l\'icône', pt: { text: '!text-sm' } }"
                                                    @click="openVignetteModal(element)"
                                                    class="w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-white hover:bg-white/5 transition-colors">
                                                    <Icon name="lucide:image" size="16" class="shrink-0" />
                                                </button>
                                                <button @click="toggleStatsPanel(element.id)"
                                                    class="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-muted hover:text-white hover:bg-white/5 transition-colors text-sm"
                                                    v-tooltip.bottom="{ value: 'Voir les statistiques', pt: { text: '!text-sm' } }">
                                                    <Icon name="lucide:chart-no-axes-column-increasing" size="16"
                                                        class="shrink-0" />
                                                    <Icon v-if="getLinkTrend(element.id) !== null"
                                                        :name="getLinkTrend(element.id) >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
                                                        size="14"
                                                        :class="getLinkTrend(element.id) >= 0 ? 'text-emerald-400' : 'text-muted'"
                                                        class="shrink-0" />
                                                    <span class="text-sm">
                                                        <template v-if="statsPending">—</template>
                                                        <template v-else>
                                                            {{stats?.links?.find((l: any) => l.link_id ===
                                                                element.id)?.total_clicks ?? 0}} clics
                                                        </template>
                                                    </span>
                                                </button>
                                            </div>
                                            <button @click="slotToDelete = element.id; showDeleteConfirmation = true"
                                                v-tooltip.bottom="{ value: 'Supprimer', pt: { text: '!text-sm' } }"
                                                class="w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                                <Icon name="lucide:trash-2" size="16" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Panneau de stats -->
                                <div v-if="openStatsId === element.id"
                                    class="mt-4 rounded-lg bg-surface-darker border border-white/8 overflow-hidden min-h-[230px]">

                                    <!-- Header -->
                                    <div class="flex items-center justify-between px-3 py-2 border-b border-white/8">
                                        <span class="text-sm text-white/80">Statistiques</span>
                                        <button @click="openStatsId = null"
                                            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-muted hover:text-white transition-colors">
                                            <Icon name="lucide:x" size="16" />
                                        </button>
                                    </div>

                                    <div v-if="!linkStatDetail" class="flex items-center justify-center py-18">
                                        <ProgressSpinner
                                            style="width:30px;height:30px;--p-progressspinner-color-one:#6A5AE0;--p-progressspinner-color-two:#8B7FF0;--p-progressspinner-color-three:#6A5AE0;--p-progressspinner-color-four:#4A3AC0"
                                            strokeWidth="6" fill="transparent" animationDuration=".5s" />
                                    </div>

                                    <!-- Contenu -->
                                    <div v-else class="flex flex-col gap-6 p-3">

                                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <span class="text-sm text-muted shrink-0">Choisis une période</span>
                                            <div @click="!isSub ? advancedStatsModal = true : null; !isSub ? openStatsId = null : null"
                                                :class="!isSub ? 'cursor-pointer pointer-events-auto' : ''">
                                                <DatePicker v-model="dateRange" selectionMode="range"
                                                    :manualInput="false" dateFormat="dd/mm/yy"
                                                    :class="!isSub ? 'pointer-events-none ' : ''" fluid size="small"
                                                    style="--p-inputtext-focus-border-color:#6A5AE0" :pt="{
                                                        pcInputText: { root: { style: 'min-width: 205px; cursor: pointer;' } },
                                                        panel: { style: 'background: #18191c; font-size: 0.875rem;' },
                                                        dayView: { style: 'font-size: 0.875rem;' },
                                                        day: ({ context }) => ({
                                                            style: context.selected
                                                                ? 'background: #6A5AE0; color: white; border-radius: 9999px;'
                                                                : context.inRange
                                                                    ? 'background: rgba(106,90,224,0.2); color: white;'
                                                                    : 'color: white;'
                                                        }),
                                                        month: ({ context }) => ({
                                                            style: context.selected
                                                                ? 'background: #6A5AE0; color: white;'
                                                                : 'color: white;'
                                                        }),
                                                        year: ({ context }) => ({
                                                            style: context.selected
                                                                ? 'background: #6A5AE0; color: white;'
                                                                : 'color: white;'
                                                        }),
                                                    }" />
                                            </div>
                                        </div>

                                        <!-- Texte motivant -->
                                        <div class="text-center">
                                            <template v-if="!linkStatDetail?.total">
                                                <p class="text-sm text-white/80">Partage ton lien pour obtenir tes
                                                    premiers clics</p>
                                            </template>
                                            <template v-else>
                                                <p class="text-sm text-white/80">
                                                    Ton lien a été cliqué <span class="text-white font-bold">
                                                        {{ linkStatDetail?.total }} fois</span>
                                                </p>
                                            </template>
                                        </div>

                                        <!-- Stats -->
                                        <div class="flex items-center gap-6">
                                            <!-- Total -->
                                            <div class="flex flex-col gap-0.5">
                                                <span
                                                    class="text-[10px] text-muted uppercase tracking-widest">Total</span>
                                                <span class="text-white font-bold text-lg">
                                                    {{ linkStatDetail?.total ?? 0 }}
                                                </span>
                                            </div>

                                            <!-- 7j -->
                                            <div class="flex flex-col gap-0.5">
                                                <span class="text-[10px] text-muted uppercase tracking-widest">7
                                                    jours</span>
                                                <div class="flex items-center gap-1">
                                                    <span class="text-white font-bold text-lg"
                                                        :class="!isSub ? 'blur-xs select-none pointer-events-none' : ''">
                                                        {{ linkStatDetail?.week ?? 0 }}
                                                    </span>
                                                    <Icon
                                                        v-if="linkStatDetail?.weekTrend !== null && linkStatDetail?.weekTrend !== undefined && isSub"
                                                        :name="linkStatDetail.weekTrend >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
                                                        size="14"
                                                        :class="linkStatDetail.weekTrend >= 0 ? 'text-emerald-400' : 'text-muted'" />
                                                </div>
                                            </div>

                                            <!-- 30j -->
                                            <div class="flex flex-col gap-0.5">
                                                <span class="text-[10px] text-muted uppercase tracking-widest">30
                                                    jours</span>
                                                <div class="flex items-center gap-1">
                                                    <span class="text-white font-bold text-lg"
                                                        :class="!isSub ? 'blur-xs select-none pointer-events-none' : ''">
                                                        {{ linkStatDetail?.month ?? 0 }}
                                                    </span>
                                                    <Icon
                                                        v-if="linkStatDetail?.monthTrend !== null && linkStatDetail?.monthTrend !== undefined && isSub"
                                                        :name="linkStatDetail.monthTrend >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
                                                        size="14"
                                                        :class="linkStatDetail.monthTrend >= 0 ? 'text-emerald-400' : 'text-muted'" />
                                                </div>
                                            </div>

                                            <!-- Custom -->
                                            <div class="flex flex-col gap-0.5">
                                                <span
                                                    class="text-[10px] text-muted uppercase tracking-widest">Période</span>
                                                <span v-if="statsFrom && statsTo" class="text-white font-bold text-lg"
                                                    :class="!isSub ? 'blur-xs select-none pointer-events-none' : ''">
                                                    {{ linkStatDetail?.custom ?? 0 }}
                                                </span>
                                                <span v-else class="text-muted font-bold text-lg"
                                                    :class="!isSub ? 'blur-xs select-none pointer-events-none' : ''">
                                                    -
                                                </span>
                                            </div>
                                        </div>

                                        <!-- CTA -->
                                        <div v-if="!isSub"
                                            class="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-primary rounded-xl">
                                            <div class="flex items-center gap-2 flex-1">
                                                <img src="/images/mascotte/charmi-happy-blanc.svg" alt=""
                                                    class="w-8 h-8" />
                                                <div class="flex flex-col gap-0.5 text-left flex-1">
                                                    <span class="text-sm font-bold text-white">
                                                        Transforme tes stats en plus de clics</span>
                                                    <span class="text-xs text-white/80">
                                                        Analyse tes liens en détail et bien plus
                                                    </span>
                                                </div>
                                            </div>
                                            <button @click="advancedStatsModal = true; openStatsId = null"
                                                class="flex items-center gap-2 px-3 py-2 rounded-full bg-white hover:bg-white/90 text-primary font-semibold text-sm transition-colors">
                                                Essayer Charmi+ gratuitement
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Draggable>

                    <FeatureUnlockModal v-model="advancedStatsModal" featureKey="advanced_stats" />

                    <!-- Modal suppression -->
                    <Dialog v-model:visible="showDeleteConfirmation" dismissableMask modal :draggable="false"
                        :style="{ margin: '1rem' }"
                        :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
                        <template #container>
                            <div
                                class="flex flex-col items-center gap-5 p-6 rounded-xl border border-white/8 bg-dark w-[20rem]">
                                <div class="flex flex-col items-center gap-2 text-center">
                                    <h2 class="font-heading text-xl font-bold text-white">Supprimer le lien ?</h2>
                                    <p class="text-muted text-sm">Cette action est irréversible.</p>
                                </div>
                                <div class="flex gap-2 w-full">
                                    <button @click="showDeleteConfirmation = false"
                                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors">
                                        <Icon name="lucide:x" size="16" class="shrink-0" />
                                        Annuler
                                    </button>
                                    <button @click="linkStore.deleteLink(slotToDelete); showDeleteConfirmation = false"
                                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 text-red-400 text-sm font-semibold transition-colors">
                                        <Icon name="lucide:trash-2" size="16" class="shrink-0" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </template>
                    </Dialog>

                    <div v-if="links.length > 0" class="h-px bg-white/8 my-4" />

                    <div v-if="links.length > 0" class="rounded-xl p-4 bg-surface-dark border border-white/8">
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex flex-col gap-0.5">
                                <span class="text-sm font-semibold text-white">Masquer le logo</span>
                                <span class="text-xs text-muted">
                                    <template v-if="isSub">Inclus dans Charmi+</template>
                                    <template v-else-if="hasFeature('no_branding')">
                                        {{ getExpiryLabel('no_branding') }}</template>
                                    <template v-else>
                                        Masque le logo Charmi sur ta page de liens et ton
                                        planning
                                    </template>
                                </span>
                            </div>

                            <ToggleSwitch :modelValue="brandingToggle"
                                @click.prevent="onToggleBranding(() => { brandingModal = true })"
                                style="--p-toggleswitch-checked-background:white;--p-toggleswitch-checked-hover-background:#F2F3F7" />
                        </div>
                        <FeatureUnlockModal v-model="brandingModal" featureKey="no_branding" />
                    </div>

                    <!-- Modal Icone ou image -->
                    <Dialog v-model:visible="thumbnailModal" dismissableMask modal :draggable="false"
                        :style="{ width: '30rem', margin: '1rem' }"
                        :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
                        <template #container>
                            <div
                                class="flex flex-col gap-5 p-5 rounded-xl border border-white/8 bg-dark overflow-y-auto max-h-[90vh]">

                                <!-- Header -->
                                <div class="flex items-center justify-between">
                                    <h2 class="font-heading text-xl font-bold text-white">Modifier l'icône du lien</h2>
                                    <button @click="thumbnailModal = false"
                                        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/8 text-muted hover:text-white transition-colors">
                                        <Icon name="lucide:x" size="22" />
                                    </button>
                                </div>

                                <Stepper value="1" style="--p-stepper-steppanel-background: transparent;">
                                    <StepPanels>
                                        <!-- Étape 1 : Upload / Crop -->
                                        <StepPanel v-slot="{ activateCallback }" value="1">
                                            <div class="flex flex-col gap-4">
                                                <div v-if="!imageUrl" class="flex flex-col gap-3">
                                                    <div class="flex gap-2">
                                                        <FileUpload mode="basic" @select="onFileSelect" auto
                                                            chooseLabel="Choisir une image"
                                                            class="p-button-contrast flex-1" accept="image/*"
                                                            @click="showIcons = false" />
                                                        <button @click="activateCallback('2')"
                                                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors">
                                                            <Icon name="lucide:layout-grid" size="16"
                                                                class="shrink-0" />
                                                            Choisir une icône
                                                        </button>
                                                    </div>
                                                    <button @click="deleteIcon" :disabled="!currentLinkRef?.icon_url"
                                                        class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-400 text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none">
                                                        <Icon name="lucide:trash-2" size="16" class="shrink-0" />
                                                        Supprimer l'image
                                                    </button>
                                                </div>

                                                <div v-else class="w-full max-h-[60vh]">
                                                    <div class="relative w-full flex justify-center items-center overflow-hidden"
                                                        style="aspect-ratio: 1 / 1">
                                                        <Cropper :src="imageUrl" :stencil-props="{ aspectRatio: 1 }"
                                                            @change="onCropChange" image-restriction="fit-area"
                                                            :stencil-component="CircleStencil"
                                                            :style="{ width: '100%', height: '100%' }"
                                                            :default-size="defaultSize" />
                                                    </div>
                                                    <div class="flex gap-2 mt-4">
                                                        <button @click="imageUrl = null; croppedImage = null"
                                                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors">
                                                            <Icon name="lucide:arrow-left" size="16" class="shrink-0" />
                                                            Retour
                                                        </button>
                                                        <button @click="saveImage" :disabled="!croppedImage"
                                                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ">
                                                            <Icon name="lucide:check" size="16" class="shrink-0" />
                                                            Mettre à jour
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </StepPanel>

                                        <!-- Étape 2 : Icônes -->
                                        <StepPanel v-slot="{ activateCallback }" value="2">
                                            <div class="flex flex-col gap-4">
                                                <IconField>
                                                    <InputIcon>
                                                        <Icon name="lucide:search" size="15" />
                                                    </InputIcon>
                                                    <InputText v-model="searchIcon" placeholder="Rechercher une icône…"
                                                        fluid
                                                        style="--p-inputtext-focus-border-color:#6A5AE0; --p-inputtext-background:#18191c" />
                                                </IconField>

                                                <div class="flex flex-wrap gap-5 overflow-y-auto h-[35vh]">
                                                    <div v-for="(icons, category) in filteredIconsByCategory"
                                                        :key="category" class="flex flex-col gap-3 px-1">
                                                        <h3
                                                            class="text-xs font-bold text-muted uppercase tracking-wider">
                                                            {{ category }}</h3>
                                                        <div class="flex flex-wrap gap-2">
                                                            <button v-for="icon in icons" :key="icon"
                                                                class="flex items-center justify-center w-10 h-10 rounded-md transition-colors"
                                                                :class="selectedIcon === icon
                                                                    ? 'bg-primary/20 ring-1 ring-primary'
                                                                    : 'hover:bg-white/5'" @click="selectIcon(icon)">
                                                                <Icon :name="icon" size="20" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="flex gap-2">
                                                    <button @click="activateCallback('1')"
                                                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors">
                                                        <Icon name="lucide:arrow-left" size="16" class="shrink-0" />
                                                        Retour
                                                    </button>
                                                    <button @click="saveImage" :disabled="!selectedIcon"
                                                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ">
                                                        <Icon name="lucide:check" size="16" class="shrink-0" />
                                                        Mettre à jour
                                                    </button>
                                                </div>
                                            </div>
                                        </StepPanel>
                                    </StepPanels>
                                </Stepper>
                            </div>
                        </template>
                    </Dialog>

                    <!-- Modal Ajouter / Modifier -->
                    <Dialog v-model:visible="newlinkModal" dismissableMask modal :draggable="false"
                        :style="{ width: '25rem', margin: '1rem' }"
                        :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
                        <template #container>
                            <div class="flex flex-col gap-5 p-5 rounded-xl border border-white/8 bg-dark">

                                <!-- Header -->
                                <div class="flex items-center justify-between">
                                    <h2 class="font-heading text-xl font-bold text-white">Ajouter un lien</h2>
                                    <button @click="newlinkModal = false"
                                        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/8 text-muted hover:text-white transition-colors">
                                        <Icon name="lucide:x" size="22" />
                                    </button>
                                </div>

                                <!-- Titre -->
                                <div class="flex flex-col gap-2">
                                    <label for="title" class="text-xs sm:text-sm font-semibold flex items-center gap-2">
                                        <Icon name="lucide:type" size="16" class="shrink-0" />
                                        Titre <span class="text-red-400">*</span>
                                    </label>
                                    <InputText id="title" v-model="form.title"
                                        placeholder="Ex : Twitch, TikTok, Discord…" fluid
                                        style="--p-inputtext-focus-border-color:#6A5AE0; --p-inputtext-background:#18191c" />
                                </div>

                                <!-- URL -->
                                <div class="flex flex-col gap-2">
                                    <label for="url" class="text-xs sm:text-sm font-semibold flex items-center gap-2">
                                        <Icon name="lucide:link" size="16" class="shrink-0" />
                                        URL <span class="text-red-400">*</span>
                                    </label>
                                    <InputText id="url" v-model="form.url" placeholder="https://…" fluid
                                        style="--p-inputtext-focus-border-color:#6A5AE0; --p-inputtext-background:#18191c" />
                                </div>

                                <!-- Footer -->
                                <div class="flex gap-2">
                                    <button type="button" @click="newlinkModal = false"
                                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors">
                                        <Icon name="lucide:x" size="16" class="shrink-0" />
                                        Annuler
                                    </button>
                                    <button type="button" @click="saveNewLink()" :disabled="!form.title || !form.url"
                                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                        <Icon name="lucide:save" size="16" class="shrink-0" />
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        </template>
                    </Dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const { data: stats, pending: statsPending } = useFetch('/api/trackingStats/totals')

import Draggable from 'vuedraggable'

// Stores
const linkStore = useLinkStore()
const { links } = storeToRefs(linkStore)
const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)

// Actions de modification du Streamer
const streamerModal = ref(false)
const username = ref('')
const bio = ref('')
const usernameError = ref('')
const language = ref(streamer?.value?.language ?? null)

const { hasFeature, getExpiryLabel, isSub } = useFeatures()

// Initialisation des champs du modal avec les données du streamer
watchEffect(() => {
    username.value = streamer?.value?.username || ''
    bio.value = streamer?.value?.bio || ''
    language.value = streamer?.value?.language || null
})

watch(username, () => {
    usernameError.value = ''
})

const openStreamerModal = async () => {
    username.value = streamer?.value?.username
    language.value = streamer?.value?.language ?? null
    streamerModal.value = true;
}

// Sauvegarder les modifications du streamer
const handleSave = async () => {
    const result = await streamerStore.updateStreamer({
        username: username.value,
        bio: bio.value,
        language: language.value
    })
    // Gestion de l'erreur
    if (result.error) {
        if (result.error.code === '23505') {
            // Conflit unique Postgres
            usernameError.value = 'Ce pseudo est déjà utilisé !'
        } else {
            usernameError.value = result.error.message
        }
        return
    }

    usernameError.value = ''
    streamerModal.value = false;
};

// Draggable
const localLinks = ref([])
watchEffect(() => {
    localLinks.value = [...links.value]
})
const saveOrder = async () => {
    await linkStore.updateOrder(localLinks.value)
}

// Actions de modification du lien
const newlinkModal = ref(false);
const form = reactive({ title: '', url: '', icon: 'link' })
const newLink = ref(null)
const inputRefs = ref({})
const { getDefaultIcon } = useLinkIcon()

// Ajouter un nouveau lien
const saveNewLink = async () => {
    const icon = getDefaultIcon(form.url)
    const maxOrder = links.value.length ? Math.max(...links.value.map(l => l.order || 0)) : 0
    const newLink = await linkStore.addLink({ title: form.title, url: form.url, icon, order: maxOrder + 1 })
    localLinks.value.push(newLink.data)
    resetForm()
}

const editing = ref({
    id: null,
    field: null,
    value: ''
})

// Editer un champ (titre ou url)
const editField = (link: any, field: string) => {
    editing.value.id = link.id
    editing.value.field = field
    editing.value.value = link[field]

    nextTick(() => {
        const key = `${link.id}-${field}`
        if (inputRefs.value[key]) {
            inputRefs.value[key].focus()
        }
    })
}

// Toggle Branding
const { brandingToggle, onToggleBranding } = useBranding()

// Sauvegarder les modifications d'un champ
const saveEdit = async (link: any) => {
    if (!editing.value.id || !editing.value.field) return

    const field = editing.value.field
    const newValue = editing.value.value

    let icon = link.icon
    if (field === 'url' && !link.icon_url && link.custom_icon === false) {
        icon = getDefaultIcon(newValue)
    }

    if (newValue !== link[field] || icon !== link.icon) {
        await linkStore.updateLink(link.id, {
            [field]: newValue,
            icon
        })

        link[field] = newValue
        link.icon = icon
    }

    editing.value = { id: null, field: null, value: '' }
}

// Réinitialiser le formulaire d'ajout de lien
const resetForm = () => {
    form.title = ''
    form.url = ''
    form.icon = 'link'
    newLink.value = null
    newlinkModal.value = false
}

const showDeleteConfirmation = ref(false)
const slotToDelete = ref(null)

// Changer l'icone
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

const thumbnailModal = ref(false);
const iconModal = ref(false)
const currentLinkRef = ref(null)
const showIcons = ref(false)

// Composable VignetteUploader
const {
    imageUrl,
    croppedImage,
    selectedIcon,
    onFileSelect,
    onCropChange,
    selectIcon,
    saveVignette,
    searchIcon,
    filteredIconsByCategory,
    removeVignette
} = useVignetteUploader(currentLinkRef)

// Ouvrir le modal de modification de l'icone
const openVignetteModal = (link: any) => {
    currentLinkRef.value = link
    thumbnailModal.value = true
    showIcons.value = false
    imageUrl.value = null
}

const closeModal = () => {
    thumbnailModal.value = false
    imageUrl.value = null
    croppedImage.value = null
    iconModal.value = false
}

// Sauvegarder l'icone
const saveImage = async () => {
    await saveVignette()
    closeModal()
}

// Supprimer l'icone
const deleteIcon = async () => {
    await removeVignette()
    closeModal()
}

// Cropper
const defaultSize = ({ imageSize, visibleArea }: { imageSize: { width: number, height: number }, visibleArea: { width: number, height: number } | null }) => {
    return {
        width: (visibleArea || imageSize).width,
        height: (visibleArea || imageSize).height,
    };
};


// Stats
const today = new Date()
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate() - 7)
const dateRange = ref<Date[]>([sevenDaysAgo, today])

const statsFrom = ref(sevenDaysAgo.toISOString().slice(0, 10))
const statsTo = ref(today.toISOString().slice(0, 10))
const openStatsId = ref<string | null>(null)

const { data: linkStatDetail, refresh: refreshLinkStat } = useFetch('/api/trackingStats/link', {
    query: computed(() => ({
        linkId: openStatsId.value,
        from: statsFrom.value || undefined,
        to: statsTo.value || undefined,
    })),
    watch: [statsFrom, statsTo],
    immediate: false,
})

// Déclenche manuellement quand openStatsId change
watch(openStatsId, (val) => {
    if (val) {
        linkStatDetail.value = null  // reset immédiat
        statsFrom.value = sevenDaysAgo.toISOString().slice(0, 10)
        statsTo.value = today.toISOString().slice(0, 10)
        dateRange.value = [sevenDaysAgo, today]
        refreshLinkStat()
    }
})

const toggleStatsPanel = (id: string) => {
    openStatsId.value = openStatsId.value === id ? null : id
}

const getLinkTrend = (linkId: string) => {
    return stats.value?.links?.find((l: any) => l.link_id === linkId)?.trend ?? null
}


watch(dateRange, (val) => {
    if (val && val[0] && val[1]) {
        statsFrom.value = val[0].toISOString().slice(0, 10)
        statsTo.value = val[1].toISOString().slice(0, 10)
    }
})


const brandingModal = ref(false)
const advancedStatsModal = ref(false)
</script>

<style scoped>
.drag-ghost {
    background: rgba(106, 90, 224, 0.15);
    border: 1px dashed #6A5AE0;
}

.drag-chosen {
    background: rgba(106, 90, 224, 0.15);
    border: 1px dashed #6A5AE0;
}
</style>