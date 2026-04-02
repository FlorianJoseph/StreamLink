<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else>
        <div class="flex flex-col fade-in">

            <!-- En-tête -->
            <div class="py-4">
                <div class="flex flex-col lg:items-start items-center justify-end">
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left">
                        Boutique
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center lg:text-left max-w-xl text-gray-400" id="header">
                        Dépense tes Coins ou abonne-toi pour débloquer toutes les fonctionnalités
                    </p>
                </div>
            </div>

            <div class="flex flex-col gap-6">

                <!-- Section Abonnement -->
                <div id="sub-section">
                    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="lucide:crown" size="20" class="text-amber-400" />
                        Abonnement
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div v-for="pack in subPacks" :key="pack.label"
                            class="relative flex flex-col gap-3 p-5 rounded-xl border-2 transition-all cursor-pointer"
                            :class="isSub
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : pack.popular
                                    ? 'border-amber-500/60 bg-amber-500/5 hover:border-amber-500 cursor-pointer'
                                    : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-500 cursor-pointer'">

                            <!-- Badge -->
                            <div v-if="!isSub && pack.popular"
                                class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-amber-950">
                                Meilleur choix
                            </div>
                            <div v-if="isSub"
                                class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                                Actif
                            </div>

                            <div class="flex flex-col gap-1">
                                <span class="font-bold text-base">{{ pack.label }}</span>
                                <div class="flex items-baseline gap-1.5">
                                    <span class="text-2xl font-bold">{{ pack.price }}€</span>
                                    <span class="text-xs text-gray-500">{{ pack.duration }}</span>
                                </div>
                            </div>

                            <span class="text-sm font-semibold text-amber-400">✦ {{ pack.access }}</span>

                            <div v-if="pack.features" class="flex flex-col gap-1 mt-2">
                                <div v-for="feature in pack.features" :key="feature"
                                    class="flex items-center gap-2 text-xs text-gray-400">
                                    <Icon name="lucide:check" size="14" class="text-emerald-400 shrink-0" />
                                    {{ feature }}
                                </div>
                            </div>

                            <!-- Footer : date si sub, bouton sinon -->
                            <div class="mt-auto flex flex-col gap-2">
                                <Button :severity="isSub ? 'secondary' : pack.popular ? 'contrast' : 'secondary'"
                                    class="w-full"
                                    @click="isSub ? openPortal() : openCheckout(pack.priceId, 'subscription')">
                                    <Icon :name="isSub ? 'lucide:settings' : 'lucide:zap'" size="16" />
                                    <span class="text-sm">{{ isSub ? 'Gérer mon abonnement' : 'S\'abonner' }}</span>
                                </Button>
                                <div class="flex items-center justify-center gap-3 text-xs text-gray-500">
                                    <div class="flex items-center gap-1">
                                        <Icon name="lucide:lock" size="12" class="shrink-0" />
                                        <span>Paiement sécurisé par Stripe</span>
                                    </div>
                                    <span>·</span>
                                    <div class="flex items-center gap-1">
                                        <Icon name="lucide:calendar-x" size="12" class="shrink-0" />
                                        <span>Sans engagement</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                <!-- Bandeau avant les features -->
                <template v-if="!isSub">
                    <div
                        class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
                        <Icon name="lucide:flame" size="14" class="shrink-0" />
                        Astuce : l'abonnement devient rentable dès 2 fonctionnalités utilisées
                    </div>
                </template>
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
                                        <span v-if="hasFeature(feature.key) && !isSub"
                                            class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                                            {{ getExpiryLabel(feature.key) }}
                                        </span>
                                    </div>
                                    <p class="text-xs text-gray-400">{{ feature.description }}</p>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <!-- Si abonné — une seule ligne -->
                                <div v-if="isSub"
                                    class="flex items-center justify-between px-3 py-2 rounded-lg border opacity-50 border-zinc-700">
                                    <span class="text-xs text-gray-300">Inclus dans ton abonnement</span>
                                    <Icon name="lucide:check" size="12" class="text-emerald-400" />
                                </div>
                                <!-- Sinon — liste des prix -->
                                <template v-else>
                                    <div v-for="price in feature.FeaturePrices?.slice().sort((a, b) => a.duration_days - b.duration_days)"
                                        :key="price.id"
                                        class="flex items-center justify-between px-3 py-2 rounded-lg border transition-all cursor-pointer border-zinc-700 hover:border-zinc-500"
                                        @click="handleSpend(feature, price)">
                                        <span class="text-xs text-gray-300">
                                            {{ hasFeature(feature.key) ? 'Prolonger de ' : 'Débloquer pendant ' }}{{
                                                price.label }}
                                        </span>
                                        <div class="flex items-center gap-1">
                                            <Icon name="lucide:coins" size="12" class="text-amber-400" />
                                            <span class="text-xs font-bold text-amber-400">{{ price.cost }}</span>
                                        </div>
                                    </div>
                                </template>
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
                        <div class="flex items-center gap-1.5 ml-auto text-xs text-gray-400 font-normal">
                            <Icon name="lucide:coins" size="14" class="text-amber-400" />
                            <span>{{ balance }} disponibles</span>
                        </div>
                    </h2>
                    <p class="text-xs text-gray-500 mb-4">Utilise tes Coins pour débloquer des fonctionnalités à la
                        carte
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div v-for="pack in coinPacks" :key="pack.label"
                            class="relative flex flex-col gap-3 p-5 rounded-xl border transition-all cursor-pointer"
                            :class="pack.best ? 'border-amber-500/60 bg-amber-500/5 hover:border-amber-500' : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-500'">
                            <div v-if="pack.best"
                                class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-amber-950">
                                Meilleur choix
                            </div>
                            <!-- Header : coins + prix -->
                            <div class="flex items-start justify-between">
                                <div class="flex flex-col">
                                    <div class="flex items-baseline gap-2">
                                        <Icon name="lucide:coins" size="18" class="text-amber-400 shrink-0" />
                                        <span class="text-xl font-bold text-amber-400">{{ pack.coins }}</span>
                                        <span v-if="pack.bonus" class="text-[11px] text-amber-500/70">
                                            {{ pack.bonus }}
                                        </span>
                                    </div>
                                </div>
                                <span class="text-lg font-bold text-white">{{ pack.price }}€</span>
                            </div>

                            <!-- Label + description -->
                            <div class="flex flex-col gap-0.5">
                                <span class="font-semibold text-sm">{{ pack.label }}</span>
                                <span class="text-xs text-gray-400">{{ pack.description }}</span>
                            </div>

                            <Button severity="secondary" class="w-full" @click="openCheckout(pack.priceId)">
                                <Icon name="lucide:coins" size="16" />
                                <span class="text-sm font-bold">Acheter {{ pack.coins }} Coins</span>
                            </Button>
                        </div>
                    </div>
                    <div class="flex items-center justify-center gap-2 text-xs text-gray-500 mt-2">
                        <Icon name="lucide:lock" size="12" class="shrink-0" />
                        <span>Paiement sécurisé par Stripe</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Modales -->
    <FeatureUnlockModal v-for="feature in features" :key="feature.key" v-model="featureModals[feature.key]"
        :featureKey="feature.key" />

    <!-- Modale confirmation achat -->
    <Dialog v-model:visible="confirmModal" modal dismissableMask header="Confirmer l'achat"
        :style="{ width: '25rem', margin: '1rem' }" :draggable="false">
        <div class="flex flex-col gap-4">
            <p class="text-sm text-gray-400">
                Tu vas dépenser <span class="font-bold text-amber-400">{{ pendingPrice?.cost }} Coins</span>
                pour <span>
                    {{ hasFeature(pendingFeature.key) ? 'prolonger ' : 'débloquer ' }}
                </span> <span class="font-semibold text-white">{{ pendingFeature?.label }}</span>
                pendant <span class="font-semibold text-white">{{ pendingPrice?.label }}</span>.
            </p>

            <!-- Tension Sub -->
            <div class="flex items-center justify-between p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer transition-all"
                @click="confirmModal = false; openCheckout('sub', 'subscription')">
                <div class="flex flex-col gap-0.5">
                    <div class="flex items-center gap-2">
                        <Icon name="lucide:crown" size="14" class="text-amber-400 shrink-0" />
                        <span class="text-xs font-semibold text-amber-400">
                            {{ upsellDiff ? `Abonne-toi pour seulement ${upsellDiff}€ de plus`
                                : 'S\'abonner pour 7,99€/mois' }}
                        </span>
                    </div>
                    <p class="text-[11px] text-gray-400">
                        Accès illimité + économise jusqu'à <span class="text-amber-400 font-semibold">
                            ~{{ savedWithSubAllFeatures }}€/mois</span> vs acheter les fonctionnalités à la carte
                    </p>
                </div>
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
            </div>
        </div>

        <template #footer>
            <div class="flex gap-2 w-full">
                <Button v-if="balance < (pendingPrice?.cost ?? 0)" severity="contrast" class="w-full"
                    @click="confirmModal = false; openCheckout(recommendedPack?.priceId)">
                    <Icon name="lucide:coins" size="18" />
                    <span class="text-xs sm:text-base">Acheter {{ recommendedPack?.coins }} Coins</span>
                </Button>
                <Button v-else severity="contrast" class="w-full" :disabled="spending" @click="confirmSpend">
                    <Icon name="lucide:coins" size="18" />
                    <span class="text-xs sm:text-base">Confirmer</span>
                </Button>
            </div>
        </template>
    </Dialog>

</template>

<script setup lang="ts">

const { balance, fetchBalance } = useWallet()
const { hasFeature, getExpiryLabel, spend, fetchAccess, fetchSubscription, isSub } = useFeatures()
const config = useRuntimeConfig()
const { uid } = useSupabase()

const openPortal = async () => {
    const { url } = await $fetch('/api/stripe/portal', { method: 'POST' })

    const width = 1000
    const height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
        url,
        'stripe-portal',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    )
}

// Features depuis l'API
const { data: features, pending: featuresLoading } = await useFetch('/api/features')

const route = useRoute()
const toast = useToast()

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
        toast.add({
            group: 'app',
            severity: 'success',
            summary: `${pendingFeature.value.label} débloqué`,
            detail: `Actif pendant ${pendingPrice.value.label}`,
            life: 4000,
        })
    } catch (e) {
        toast.add({
            group: 'app',
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de débloquer la fonctionnalité',
            life: 4000,
        })
    } finally {
        spending.value = false
        pendingFeature.value = null
        pendingPrice.value = null
    }
}

// Packs Sub
const subPacks = [
    {
        label: 'Mensuel',
        price: 7.99,
        duration: '/ mois',
        priceId: 'sub',
        access: 'Tu te démarques instantanément',
        popular: true,
        features: [
            '13 thèmes exclusifs et 23 polices premium',
            'Génère ton planning au format story Instagram / X en 1 clic',
            'Masque le footer sur ta page et ton planning',
        ]
    },
]

// Packs Coins
const coinPacks = [
    {
        label: 'Essai rapide',
        coins: 300, price: 2.99, best: false,
        priceId: 'coins_little',
        description: 'Parfait pour tester une fonctionnalité'
    },
    {
        label: 'Le plus rentable',
        coins: 800, price: 6.99, best: true,
        priceId: 'coins_middle',
        bonus: '750 + 50 offerts',
        description: 'Le choix des créateurs actifs'
    },
    {
        label: 'Boost créateur',
        coins: 2000, price: 14.99, best: false,
        priceId: 'coins_big',
        bonus: '1800 + 200 offerts',
        description: 'Maximise ta visibilité sur plusieurs semaines'
    },
]

const priceIdMap: Record<string, string> = {
    sub: config.public.stripePriceSub,
    coins_little: config.public.stripePriceCoinsLittle,
    coins_middle: config.public.stripePriceCoinsMiddle,
    coins_big: config.public.stripePriceCoinsBig,
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

const savedWithSubAllFeatures = computed(() =>
    Math.max(0, parseFloat(allFeaturesMonthlyEuro.value) - 7.99).toFixed(2)
)

const upsellDiff = computed(() => {
    if (!pendingPrice.value) return 0
    const coinCost = parseFloat(coinToEuro(pendingPrice.value.cost))
    if (coinCost < 2) return null
    const diff = parseFloat((7.99 - coinCost).toFixed(2))
    return diff > 0 ? diff : null
})

const recommendedPack = computed(() => {
    if (!pendingPrice.value) return coinPacks[0]
    const missing = pendingPrice.value.cost - balance.value
    return coinPacks.find(p => p.coins >= missing) ?? coinPacks[coinPacks.length - 1]
})

const openCheckout = async (packPriceId: string, mode: 'payment' | 'subscription' = 'payment') => {
    const priceId = priceIdMap[packPriceId]
    const { clientSecret } = await $fetch('/api/stripe/checkout', {
        method: 'POST',
        body: { priceId, mode }
    })

    // Stocker temporairement
    sessionStorage.setItem('stripe_client_secret', clientSecret)

    const width = 500
    const height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
        '/checkout',
        'stripe-checkout',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    )
}

const onMessage = async (e: MessageEvent) => {
    if (e.data.type === 'payment_success') {
        const { coins, mode } = await $fetch('/api/stripe/session', {
            query: { session_id: e.data.session_id }
        })
        await fetchBalance()
        await fetchAccess()
        await fetchSubscription()
        toast.add({
            severity: 'secondary',
            group: 'payment',
            summary: mode === 'subscription' ? 'Abonnement activé !' : 'Coins ajoutés à ton solde',
            detail: mode === 'subscription' ? 'Toutes les features sont débloquées' : String(coins),
            life: 4000,
        })
    }
}

const loading = ref(true)
onMounted(async () => {
    await fetchSubscription()

    const alreadyTracked = sessionStorage.getItem('tracked_shop_visit') === 'true'

    if (route.query.utm_source && !alreadyTracked) {
        $fetch('/api/marketing/event', {
            method: 'POST',
            body: {
                type: 'shop_visit',
                utm_source: route.query.utm_source,
                utm_campaign: route.query.utm_campaign ?? null,
                userId: uid.value
            }
        })

        sessionStorage.setItem('tracked_shop_visit', 'true')
    }
    loading.value = false
    window.addEventListener('message', onMessage)
})

onUnmounted(() => {
    window.removeEventListener('message', onMessage)
})

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