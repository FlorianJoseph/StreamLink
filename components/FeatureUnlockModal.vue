<template>
    <Dialog v-model:visible="visible" modal dismissableMask :header="feature?.label"
        :style="{ width: '25rem', margin: '1rem' }" :draggable="false">
        <div class="flex flex-col gap-4">
            <p class="text-sm text-zinc-400">{{ feature?.description }}</p>
            <div class="flex flex-col gap-2">
                <div v-for="price in prices" :key="price.id"
                    class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all"
                    :class="selectedPrice?.id === price.id ? 'border-white bg-white/10' : 'border-zinc-700 hover:border-zinc-500'"
                    @click="selectedPrice = price">
                    <span class="text-sm font-medium text-gray-300">{{ price.label }}</span>
                    <div class="flex items-center gap-1">
                        <Icon name="lucide:coins" size="14" class="text-amber-400 shrink-0" />
                        <span class="text-sm font-bold text-amber-400">{{ price.cost }}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span>Solde actuel</span>
                <div class="flex items-center gap-1">
                    <Icon name="lucide:coins" size="12" class="text-amber-400 shrink-0" />
                    <span class="text-amber-400 font-semibold">{{ balance }}</span>
                </div>
            </div>
            <div v-if="selectedPrice?.id" class="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span>Solde après achat</span>
                <div class="flex items-center gap-1">
                    <Icon name="lucide:coins" size="12" class="text-amber-400 shrink-0" />
                    <span class="font-semibold"
                        :class="balance - (selectedPrice?.cost ?? 0) < 0 ? 'text-red-400' : 'text-amber-400'">
                        {{ balance - (selectedPrice?.cost ?? 0) }}
                    </span>
                </div>
            </div>
            <p v-if="selectedPrice && balance < selectedPrice.cost" class="text-xs text-red-400">
                Il te manque {{ selectedPrice.cost - balance }} Coins
            </p>
            <!-- Upsell abonnement -->
            <div class="flex items-center justify-between p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer transition-all"
                @click="visible = false; navigateTo('/shop#sub-section')">
                <div class="flex flex-col gap-0.5">
                    <div class="flex items-center gap-2">
                        <Icon name="lucide:crown" size="14" class="text-amber-400 shrink-0" />
                        <span class="text-xs font-semibold text-amber-400">S'abonner pour 7,99€/mois</span>
                    </div>
                    <p class="text-[11px] text-gray-400">Accès illimité à toutes les fonctionnalités</p>
                </div>
                <Icon name="lucide:arrow-right" size="14" class="text-amber-400 shrink-0" />
            </div>
        </div>
        <template #footer>
            <div class="w-full">
                <Button v-if="selectedPrice && balance < selectedPrice.cost" severity="contrast" class="w-full"
                    @click="visible = false; navigateTo('/shop#coins-section')">
                    <Icon name="lucide:coins" size="18" />
                    <span class="text-xs sm:text-base">Acheter des Coins</span>
                </Button>
                <Button v-else severity="contrast" class="w-full" :disabled="!selectedPrice || spending"
                    @click="handleSpend">
                    <Icon name="lucide:unlock" size="18" />
                    <span class="text-xs sm:text-base">Débloquer</span>
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
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
        selectedPrice.value = null
    } catch (error) {
        console.error('Erreur déblocage', props.featureKey, error)
    } finally {
        spending.value = false
    }
}
</script>