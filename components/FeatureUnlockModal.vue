<template>
    <Dialog v-model:visible="visible" dismissableMask modal :draggable="false"
        :style="{ width: '25rem', margin: '1rem' }"
        :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
        <template #container>
            <div class="flex flex-col gap-5 p-5 rounded-xl border border-white/8 bg-dark">

                <!-- Header -->
                <div class="flex items-center justify-between">
                    <h2 class="font-heading text-xl font-bold text-white">{{ feature?.label }}</h2>
                    <button @click="visible = false"
                        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/8 text-muted hover:text-white transition-colors">
                        <Icon name="lucide:x" size="22" />
                    </button>
                </div>

                <!-- Description -->
                <p class="text-sm text-muted">{{ feature?.description }}</p>

                <!-- Upsell Charmi+ -->
                <div class="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/8 hover:bg-primary/15 cursor-pointer transition-all"
                    @click="visible = false; navigateTo('/shop')">
                    <img src="/images/mascotte/charmi-happy-violet.svg" alt="" class="w-8 h-8 shrink-0 opacity-80" />
                    <div class="flex flex-col gap-0.5 flex-1">
                        <span class="text-sm font-semibold text-[#a89ff0]">Passe à Charmi+ pour tout débloquer</span>
                        <p class="text-xs text-muted">Accès illimité pour seulement 7,99€/mois</p>
                    </div>
                    <Icon name="lucide:arrow-right" size="14" class="text-[#a89ff0] shrink-0" />
                </div>

                <div class="flex items-center gap-2">
                    <div class="h-px flex-1 bg-white/8" />
                    <span class="text-xs text-muted">ou débloquer temporairement avec des Charm</span>
                    <div class="h-px flex-1 bg-white/8" />
                </div>

                <!-- Prix -->
                <div class="flex flex-col gap-2">
                    <div v-for="price in prices" :key="price.id"
                        class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all"
                        :class="selectedPrice?.id === price.id
                            ? 'border-primary bg-primary/20 text-white'
                            : 'border-white/8 hover:border-white/20'" @click="selectedPrice = price">
                        <span class="text-sm font-medium">{{ price.label }}</span>
                        <div class="flex items-center gap-1.5 px-2 py-1 rounded-full ">
                            <img src="/images/assets/charmi-monnaie-jaune.svg" alt="Charm" class="w-3 h-3 shrink-0" />
                            <span class="text-xs font-bold text-accent">{{ price.cost }}</span>
                        </div>
                    </div>
                </div>

                <!-- Solde -->
                <div class="flex flex-col gap-1.5 rounded-lg border border-white/8 bg-surface-darker p-3">
                    <div class="flex items-center justify-between text-xs text-muted">
                        <span>Solde actuel</span>
                        <div class="flex items-center gap-1">
                            <img src="/images/assets/charmi-monnaie-jaune.svg" alt="Charm" class="w-3 h-3 shrink-0" />
                            <span class="text-accent font-semibold">{{ balance }}</span>
                        </div>
                    </div>
                    <div v-if="selectedPrice?.id" class="flex items-center justify-between text-xs text-muted">
                        <span>Solde après achat</span>
                        <div class="flex items-center gap-1">
                            <img src="/images/assets/charmi-monnaie-jaune.svg" alt="Charm" class="w-3 h-3 shrink-0" />
                            <span class="font-semibold"
                                :class="balance - (selectedPrice?.cost ?? 0) < 0 ? 'text-red-400' : 'text-accent'">
                                {{ balance - (selectedPrice?.cost ?? 0) }}
                            </span>
                        </div>
                    </div>
                    <p v-if="selectedPrice && balance < selectedPrice.cost" class="text-xs text-red-400 mt-1">
                        Il te manque {{ selectedPrice.cost - balance }} Charm
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                    <button v-if="selectedPrice && balance < selectedPrice.cost"
                        @click="visible = false; navigateTo('/shop')"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors">
                        <img src="/images/assets/charmi-monnaie-blanc.svg" alt="" class="w-4 h-4" />
                        <span>Acheter des Charm</span>
                    </button>
                    <button v-else :disabled="!selectedPrice || spending" @click="handleSpend"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <Icon name="lucide:unlock" size="16" />
                        <span>Débloquer</span>
                    </button>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
const toast = useToast()

const props = defineProps<{
    featureKey: string
}>()

const visible = defineModel<boolean>()

const { spend } = useFeatures()
const { balance } = useWallet()

const selectedPrice = ref(null)
const spending = ref(false)

const { data: features } = await useFetch('/api/features')
const feature = computed(() => features.value?.find(f => f.key === props.featureKey))
const prices = computed(() =>
    feature.value?.FeaturePrices
        ?.slice()
        .sort((a: { duration_days: number }, b: { duration_days: number }) => a.duration_days - b.duration_days) ?? []
)

const handleSpend = async () => {
    if (!selectedPrice.value) return
    spending.value = true
    try {
        await spend(props.featureKey, selectedPrice.value.id)
        visible.value = false
        toast.add({
            group: 'app',
            severity: 'success',
            summary: `${feature.value?.label} débloqué`,
            detail: `Actif pendant ${selectedPrice.value.label}`,
            life: 4000,
        })
        selectedPrice.value = null
    } catch (error) {
        toast.add({
            group: 'app',
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de débloquer la fonctionnalité',
            life: 4000,
        })
    } finally {
        spending.value = false
    }
}
</script>