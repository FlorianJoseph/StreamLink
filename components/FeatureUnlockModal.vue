<template>
    <Dialog v-model:visible="visible" modal dismissableMask :header="feature?.label"
        :style="{ width: '22rem', margin: '1rem' }" :draggable="false">
        <div class="flex flex-col gap-4">
            <p class="text-sm text-zinc-400">{{ feature?.description }}</p>
            <div class="flex flex-col gap-2">
                <div v-for="price in prices" :key="price.id"
                    class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all"
                    :class="selectedPrice?.id === price.id ? 'border-white bg-white/10' : 'border-zinc-700 hover:border-zinc-500'"
                    @click="selectedPrice = price">
                    <span class="text-sm font-medium">{{ price.label }}</span>
                    <div class="flex items-center gap-1">
                        <Icon name="lucide:coins" size="14" class="shrink-0" />
                        <span class="text-sm font-bold">{{ price.cost }}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span>Solde actuel</span>
                <div class="flex items-center gap-1">
                    <Icon name="lucide:coins" size="12" class="shrink-0" />
                    <span class="text-white font-semibold">{{ balance }}</span>
                </div>
            </div>
            <p v-if="selectedPrice && balance < selectedPrice.cost" class="text-xs text-red-400">
                Solde insuffisant : complète les quêtes pour gagner plus de monnaie ou achète en dans la boutique.
            </p>
        </div>
        <template #footer>
            <div class="flex gap-2 w-full">
                <Button severity="secondary" outlined @click="visible = false" class="flex-1">
                    <Icon name="lucide:x" size="18" />
                    <span class="text-xs sm:text-base">Annuler</span>
                </Button>
                <Button severity="contrast" class="flex-1"
                    :disabled="!selectedPrice || balance < selectedPrice.cost || spending" @click="handleSpend">
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