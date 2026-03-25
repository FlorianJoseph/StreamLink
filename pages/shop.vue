<template>
    <div class="flex flex-col gap-8 fade-in py-4">

        <!-- Header -->
        <div class="flex flex-col lg:items-start items-center gap-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-center lg:text-left">Boutique</h1>
            <p class="text-sm sm:text-base text-gray-400 text-center lg:text-left">
                Dépense tes Coins ou passe en Pro pour débloquer toutes les fonctionnalités
            </p>
        </div>

        <!-- Solde actuel -->
        <div class="flex items-center gap-3 p-4 rounded-xl border border-zinc-700 bg-zinc-800/30 w-fit">
            <Icon name="lucide:coins" size="20" class="text-amber-400 shrink-0" />
            <span class="text-sm text-gray-400">Ton solde</span>
            <span class="text-xl font-bold text-amber-400">{{ balance }}</span>
            <span class="text-sm text-gray-500">Coins</span>
        </div>

        <!-- Section Abonnement Pro -->
        <div id="pro-section">
            <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="lucide:crown" size="20" class="text-amber-400" />
                Abonnement Pro
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="pack in proPacks" :key="pack.label"
                    class="relative flex flex-col gap-3 p-5 rounded-xl border-2 transition-all cursor-pointer" :class="pack.popular
                        ? 'border-amber-500/60 bg-amber-500/5 hover:border-amber-500'
                        : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-500'">
                    <div v-if="pack.popular"
                        class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-amber-950">
                        Populaire
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="font-bold text-base">{{ pack.label }}</span>
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-2xl font-bold">{{ pack.price }}€</span>
                            <span class="text-xs text-gray-500">{{ pack.duration }}</span>
                        </div>
                    </div>
                    <span class="text-sm font-semibold text-amber-400">✦ {{ pack.access }}</span>
                    <Button :severity="pack.popular ? 'contrast' : 'secondary'" class="w-full mt-auto">
                        <Icon name="lucide:zap" size="16" />
                        <span class="text-sm">Choisir ce plan</span>
                    </Button>
                </div>
            </div>
            <!-- Avantages communs -->
            <div class="flex flex-wrap gap-3 mt-4">
                <div v-for="benefit in proBenefits" :key="benefit"
                    class="flex items-center gap-2 text-xs text-gray-300">
                    <Icon name="lucide:check" size="14" class="text-emerald-400 shrink-0" />
                    {{ benefit }}
                </div>
            </div>
        </div>

        <Divider />

        <!-- Bandeau avant les features -->
        <div
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
            <Icon name="lucide:flame" size="14" class="shrink-0" />
            Astuce : le Pro devient rentable dès 2 fonctionnalités utilisées
        </div>
        <!-- Section Features à débloquer -->
        <div>
            <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="lucide:sparkles" size="20" class="text-purple-400" />
                Fonctionnalités à la carte
            </h2>
            <div v-if="featuresLoading" class="flex justify-center py-8">
                <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="6" />
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="feature in features" :key="feature.key"
                    class="flex flex-col gap-4 p-5 rounded-xl border border-zinc-700 bg-zinc-800/30">
                    <div class="flex items-start gap-3">
                        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-700 shrink-0">
                            <Icon :name="feature.icon" size="18" class="text-purple-400" />
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <div class="flex items-center gap-2">
                                <span class="font-semibold text-sm">{{ feature.label }}</span>
                                <span v-if="hasFeature(feature.key)"
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                                    Actif
                                </span>
                            </div>
                            <p class="text-xs text-gray-400">{{ feature.description }}</p>
                            <p v-if="hasFeature(feature.key)" class="text-xs text-emerald-400 mt-1">
                                {{ getExpiryLabel(feature.key) }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div v-for="price in feature.FeaturePrices?.slice().sort((a, b) => a.duration_days - b.duration_days)"
                            :key="price.id"
                            class="flex items-center justify-between px-3 py-2 rounded-lg border transition-all cursor-pointer"
                            :class="hasFeature(feature.key)
                                ? 'border-emerald-500/30 hover:border-emerald-500/60'
                                : 'border-zinc-700 hover:border-zinc-500'" @click="handleSpend(feature, price)">
                            <span class="text-xs text-gray-300">
                                {{ hasFeature(feature.key) ? 'Prolonger de ' : 'Débloquer ' }}{{ price.label }}
                            </span>
                            <div class="flex items-center gap-1">
                                <Icon name="lucide:coins" size="12" class="text-amber-400" />
                                <span class="text-xs font-bold text-amber-400">{{ price.cost }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Divider />

        <!-- Section Packs de Coins -->
        <div id="coins-section">
            <h2 class="text-lg font-semibold mb-1 flex items-center gap-2">
                <Icon name="lucide:coins" size="20" class="text-amber-400" />
                Acheter des Coins
            </h2>
            <p class="text-xs text-gray-500 mb-4">Utilise tes Coins pour débloquer des fonctionnalités à la carte</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="pack in coinPacks" :key="pack.label"
                    class="relative flex flex-col gap-3 p-5 rounded-xl border transition-all cursor-pointer"
                    :class="pack.best ? 'border-amber-500/60 bg-amber-500/5 hover:border-amber-500' : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-500'">
                    <div v-if="pack.best"
                        class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-amber-950">
                        Meilleur choix
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon name="lucide:coins" size="20" class="text-amber-400 shrink-0" />
                        <span class="text-xl font-bold text-amber-400">{{ pack.coins }} {{ pack.bonus ?
                            `(${pack.bonus})` : '' }}</span>
                    </div>
                    <div class="flex flex-col gap-0.5">
                        <span class="font-semibold text-sm">{{ pack.label }}</span>
                        <span class="text-xs text-gray-400">{{ pack.description }}</span>
                    </div>
                    <Button severity="secondary" class="w-full" @click="openCheckout(pack.priceId)">
                        <span class="text-sm font-bold">{{ pack.price }}€</span>
                    </Button>
                </div>
            </div>
        </div>

    </div>

    <!-- Modales -->
    <FeatureUnlockModal v-for="feature in features" :key="feature.key" v-model="featureModals[feature.key]"
        :featureKey="feature.key" />

    <!-- Modale confirmation achat -->
    <Dialog v-model:visible="confirmModal" modal dismissableMask header="Confirmer l'achat"
        :style="{ width: '22rem', margin: '1rem' }" :draggable="false">
        <div class="flex flex-col gap-4">
            <p class="text-sm text-gray-400">
                Tu vas dépenser <span class="font-bold text-amber-400">{{ pendingPrice?.cost }} Coins</span>
                <span class="text-gray-500">(~{{ coinToEuro(pendingPrice?.cost) }}€)</span>
                pour débloquer <span class="font-semibold text-white">{{ pendingFeature?.label }}</span>
                pendant <span class="font-semibold text-white">{{ pendingPrice?.label }}</span>.
            </p>

            <!-- Tension Pro -->
            <div class="flex items-center justify-between p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer transition-all"
                @click="confirmModal = false; scrollToPro()">
                <div class="flex flex-col gap-0.5">
                    <div class="flex items-center gap-2">
                        <Icon name="lucide:crown" size="14" class="text-amber-400 shrink-0" />
                        <span class="text-xs font-semibold text-amber-400">
                            {{ upsellDiff ? `Pro pour seulement ${upsellDiff}€ de plus`
                                : 'Passer au Pro pour 9,99€/mois' }}
                        </span>
                    </div>
                    <p class="text-[11px] text-gray-400">
                        Accès illimité + économise jusqu'à <span class="text-amber-400 font-semibold">
                            ~{{ savedWithProAllFeatures }}€/mois</span> vs acheter les fonctionnalités à la carte
                    </p>
                </div>
                <Icon name="lucide:arrow-right" size="14" class="text-amber-400 shrink-0" />
            </div>

            <!-- Soldes -->
            <div class="flex items-center justify-between text-xs text-gray-500 px-1">
                <span>Solde actuel</span>
                <div class="flex items-center gap-1">
                    <Icon name="lucide:coins" size="12" class="text-amber-400" />
                    <span class="text-amber-400 font-semibold">{{ balance }}</span>
                </div>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500 px-1">
                <span>Solde après achat</span>
                <div class="flex items-center gap-1">
                    <Icon name="lucide:coins" size="12" class="text-amber-400" />
                    <span class="font-semibold"
                        :class="balance - (pendingPrice?.cost ?? 0) < 0 ? 'text-red-400' : 'text-amber-400'">
                        {{ balance - (pendingPrice?.cost ?? 0) }}
                    </span>
                </div>
            </div>
            <div v-if="balance < (pendingPrice?.cost ?? 0)" class="flex flex-col gap-2">
                <p class="text-xs text-red-400">
                    Il te manque {{ (pendingPrice?.cost ?? 0) - balance }} Coins
                </p>
                <Button severity="contrast" size="small" class="w-full" @click="confirmModal = false; scrollToCoins()">
                    <span class="text-xs">Acheter le pack recommandé : ✦ {{ recommendedPack?.coins }} - {{
                        recommendedPack?.price }}€</span>
                </Button>
            </div>
        </div>

        <template #footer>
            <div class="flex gap-2 w-full">
                <Button severity="secondary" outlined @click="confirmModal = false" class="flex-1">
                    <Icon name="lucide:x" size="18" />
                    <span class="text-xs sm:text-base">Annuler</span>
                </Button>
                <Button severity="contrast" class="flex-1" :disabled="balance < (pendingPrice?.cost ?? 0) || spending"
                    @click="confirmSpend">
                    <Icon name="lucide:coins" size="18" />
                    <span class="text-xs sm:text-base">Confirmer</span>
                </Button>
            </div>
        </template>
    </Dialog>

    <Dialog v-model:visible="checkoutModal" modal dismissableMask :style="{ width: '480px', margin: '1rem' }"
        :draggable="false">
        <StripeCheckout v-if="checkoutClientSecret" :clientSecret="checkoutClientSecret" />
    </Dialog>

</template>

<script setup lang="ts">
const { balance, fetchBalance } = useWallet()
const { hasFeature, getExpiryLabel, spend, fetchAccess } = useFeatures()
const config = useRuntimeConfig()

// Features depuis l'API
const { data: features, pending: featuresLoading } = await useFetch('/api/features')

// Modales par feature
const featureModals = ref<Record<string, boolean>>({})
const confirmModal = ref(false)
const pendingFeature = ref<any>(null)
const pendingPrice = ref<any>(null)
const spending = ref(false)

const handleSpend = (feature: any, price: any) => {
    pendingFeature.value = feature
    pendingPrice.value = price
    confirmModal.value = true
}

const confirmSpend = async () => {
    if (!pendingFeature.value || !pendingPrice.value) return
    spending.value = true
    try {
        await spend(pendingFeature.value.key, pendingPrice.value.id)
        await fetchBalance()
        await fetchAccess()
        confirmModal.value = false
    } catch (e) {
        console.error('Erreur achat', e)
    } finally {
        spending.value = false
        pendingFeature.value = null
        pendingPrice.value = null
    }
}

// Packs Pro
const proPacks = [
    { label: 'Starter', price: 4.99, duration: '/ 7 jours', access: 'Ta page devient unique — 7 jours', popular: false },
    { label: 'Popular', price: 9.99, duration: '/ mois', access: 'Tu te démarques instantanément', popular: true },
    { label: 'Pro', price: 79.99, duration: '/ an', access: 'Plus pro que 90% des streamers', popular: false },
]

const proBenefits = [
    '15 thèmes exclusifs et 23 polices premium pour une page unique',
    'Planning au format story Instagram / X en 1 clic',
    'Zéro logo StreamLink, 100% toi',
]

// Packs Coins
const coinPacks = [
    { label: 'Starter', coins: 300, price: 2.99, best: false, priceId: 'coins_starter', description: 'Parfait pour tester une feature' },
    { label: 'Popular', coins: 700, price: 6.99, best: true, priceId: 'coins_popular', bonus: '+50 offerts', description: 'Le plus rentable pour les créateurs actifs' },
    { label: 'Pro', coins: 1500, price: 14.99, best: false, priceId: 'coins_pro', bonus: '+200 offerts', description: 'Maximise ta visibilité sur plusieurs semaines' },
]

const priceIdMap: Record<string, string> = {
    coins_starter: config.public.stripePriceCoinsStarter,
    coins_popular: config.public.stripePriceCoinsPopular,
    coins_pro: config.public.stripePriceCoinsPro,
}

const coinToEuro = (coins: number) => {
    // Base : 300 coins = 2.99€ → ~0.01€/coin
    return ((coins * 2.99) / 300).toFixed(2)
}

// Coût total si toutes les features achetées 30j
const allFeaturesMonthlyCoins = computed(() => {
    if (!features.value) return 0
    return features.value.reduce((total: number, feature: any) => {
        const price30j = feature.FeaturePrices?.find((p: any) => p.duration_days === 30)
        return total + (price30j?.cost ?? 0)
    }, 0)
})

const allFeaturesMonthlyEuro = computed(() =>
    parseFloat(coinToEuro(allFeaturesMonthlyCoins.value)).toFixed(2)
)

const savedWithProAllFeatures = computed(() =>
    Math.max(0, parseFloat(allFeaturesMonthlyEuro.value) - 9.99).toFixed(2)
)

const upsellDiff = computed(() => {
    if (!pendingPrice.value) return 0
    const coinCost = parseFloat(coinToEuro(pendingPrice.value.cost))
    if (coinCost < 3) return null
    return Math.max(0, (9.99 - coinCost)).toFixed(2)
})

const scrollToPro = () => {
    document.getElementById('pro-section')?.scrollIntoView({ behavior: 'smooth' })
}

const recommendedPack = computed(() => {
    if (!pendingPrice.value) return coinPacks[0]
    const missing = pendingPrice.value.cost - balance.value
    return coinPacks.find(p => p.coins >= missing) ?? coinPacks[coinPacks.length - 1]
})

const scrollToCoins = () => {
    document.getElementById('coins-section')?.scrollIntoView({ behavior: 'smooth' })
}

const checkoutClientSecret = ref<string | null>(null)
const checkoutModal = ref(false)

const openCheckout = async (packPriceId: string) => {
    const priceId = priceIdMap[packPriceId]
    const { clientSecret } = await $fetch('/api/stripe/checkout', {
        method: 'POST',
        body: { priceId }
    })
    checkoutClientSecret.value = clientSecret
    checkoutModal.value = true
}


definePageMeta({
    layout: 'fullscreen'
})
</script>

<style scoped>
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