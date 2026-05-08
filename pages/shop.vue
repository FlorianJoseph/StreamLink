<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width:40px;height:40px;--p-progressspinner-color-one:#6A5AE0;--p-progressspinner-color-two:#8B7FF0;--p-progressspinner-color-three:#6A5AE0;--p-progressspinner-color-four:#4A3AC0"
            strokeWidth="6" fill="transparent" animationDuration=".5s" />
    </div>

    <div v-else class="flex flex-col gap-10 fade-in py-6 max-w-6xl mx-auto w-full">

        <!-- Section Abonnement -->
        <section>
            <div class="flex items-center gap-2 mb-5">
                <img src="/images/mascotte/charmi-happy-violet.svg" class="w-5 h-5" alt="" />
                <h2 class="text-xl font-bold text-white">Charmi+</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="pack in subPacks" :key="pack.label"
                    class="relative flex flex-col gap-5 p-5 border-primary/20 bg-primary/5 rounded-xl border">

                    <img src="/images/mascotte/charmi-happy-violet.svg"
                        class="absolute top-4 right-4 w-16 h-16 opacity-10 pointer-events-none" alt="" />

                    <!-- Badge statut -->
                    <div v-if="isSub"
                        class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                        Actif
                    </div>
                    <div v-else-if="pack.popular"
                        class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold bg-accent text-dark hidden sm:block">
                        Recommandé
                    </div>

                    <!-- Prix -->
                    <div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-3xl font-bold text-accent">7 jours gratuits</span>
                            <span class="text-sm text-muted">puis {{ pack.price }}€{{ pack.duration }}</span>
                        </div>
                    </div>

                    <!-- Features -->
                    <div class="flex flex-col gap-2">
                        <div v-for="feature in pack.features" :key="feature" class="flex items-center gap-2">
                            <Icon name="lucide:check" size="13" class="text-primary shrink-0" />
                            <span class="text-xs text-white/80">{{ feature }}</span>
                        </div>
                    </div>

                    <!-- CTA -->
                    <div class="flex flex-col gap-2 mt-auto">
                        <div class="flex flex-wrap justify-center gap-3 text-xs text-muted">
                            <div class="flex items-center gap-1">
                                <Icon name="lucide:lock" size="11" class="shrink-0" />
                                <span>Paiement sécurisé Stripe</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <Icon name="lucide:x-circle" size="11" class="shrink-0" />
                                <span>Annulation à tout moment</span>
                            </div>
                        </div>
                        <button @click="isSub ? openPortal() : openCheckout(pack.priceId, 'subscription')"
                            class="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-md font-bold transition-colors"
                            :class="isSub
                                ? 'bg-white/5 text-white border border-white/8 hover:bg-white/10'
                                : 'bg-primary text-white hover:bg-primary/90'">
                            {{ isSub ? 'Gérer mon abonnement' : 'Essayer Charmi+ gratuitement' }}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Bandeau économie -->
        <div v-if="!isSub"
            class="flex items-center px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 text-xs sm:text-sm text-accent font-bold">
            L'abonnement Charmi+ te revient moins cher à partir de 2 fonctionnalités
        </div>

        <!-- Section Features à la carte -->
        <section>
            <div class="flex items-center gap-2 mb-5">
                <img src="/images/assets/charmi-monnaie-violet.svg" class="w-5 h-5" alt="" />
                <h2 class="text-xl font-bold text-white">Débloque ce dont tu as besoin</h2>
            </div>

            <div v-if="featuresLoading" class="flex justify-center py-12">
                <div class="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="feature in features" :key="feature.key"
                    class="flex flex-col gap-4 p-5 rounded-xl border border-white/8 bg-surface-dark">

                    <div class="flex items-start gap-3">
                        <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                            <Icon :name="feature.icon" size="16" class="text-primary" />
                        </div>
                        <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="font-bold text-sm text-white">{{ feature.label }}</span>
                                <span v-if="hasFeature(feature.key) && !isSub"
                                    class="text-xs px-1.5 py-0.5 rounded-full bg-[#6A5AE0]/20 text-[#a89ff0]">
                                    {{ getExpiryLabel(feature.key) }}
                                </span>
                            </div>
                            <p class="text-xs text-muted">{{ feature.description }}</p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5 mt-auto">
                        <!-- Abonné -->
                        <div v-if="isSub"
                            class="flex items-center justify-between px-3 py-2 rounded-md border border-white/5 opacity-50">
                            <span class="text-xs text-muted">Inclus dans Charmi+</span>
                            <Icon name="lucide:check" size="12" class="text-primary" />
                        </div>
                        <!-- Prix à la carte -->
                        <template v-else>
                            <div v-for="price in feature.FeaturePrices?.slice().sort((a, b) => a.duration_days - b.duration_days)"
                                :key="price.id"
                                class="flex items-center justify-between px-3 py-2 rounded-md border border-white/8 hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
                                @click="handleSpend(feature, price)">
                                <span class="text-xs text-white/70">
                                    {{ hasFeature(feature.key) ? 'Prolonger de ' : 'Débloquer pendant ' }}
                                    {{ price.label }}
                                </span>
                                <div class="flex items-center gap-1 shrink-0">
                                    <img src="/images/assets/charmi-monnaie-violet.svg" alt="" class="w-3.5 h-3.5" />
                                    <span class="text-xs font-bold text-primary">{{ price.cost }}</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </section>

        <div class="h-px bg-white/5" />

        <!-- Section Packs de Charm -->
        <section id="coins-section">
            <div class="flex items-center gap-2 mb-5">
                <img src="/images/assets/charmi-monnaie-jaune.svg" alt="Charm" class="w-5 h-5" />
                <div class="flex flex-col gap-0.5">
                    <h2 class="text-xl font-bold text-white">Acheter des Charm</h2>
                    <p class="text-muted text-xs">Pas encore prêt à t'abonner ? Commence par ici</p>
                </div>
                <div class="flex items-center gap-1.5 ml-auto text-xs sm:text-sm text-muted">
                    <img src="/images/assets/charmi-monnaie-violet.svg" alt="" class="w-4 h-4" />
                    <span>{{ balance }} disponibles</span>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="pack in coinPacks" :key="pack.priceId"
                    class="relative flex items-center justify-between p-5 rounded-xl border cursor-pointer" :class="pack.best
                        ? 'border-accent/40 bg-accent/5 hover:border-accent/70 sm:scale-105'
                        : 'border-white/8 bg-surface-dark hover:border-white/15'" @click="openCheckout(pack.priceId)">

                    <div class="flex items-center gap-3">
                        <img src="/images/assets/charmi-monnaie-jaune.svg" alt=""
                            :class="pack.best ? 'w-9 h-9' : 'w-7 h-7'" />
                        <div>
                            <span :class="pack.best ? 'text-3xl' : 'text-2xl'" class="font-bold text-accent">
                                {{ pack.coins }}
                            </span>
                            <span v-if="pack.bonus" class="block text-[10px] text-accent/60 leading-tight">
                                {{ pack.bonus }}
                            </span>
                        </div>
                    </div>

                    <span :class="pack.best ? 'text-2xl' : 'text-xl'" class="font-bold text-white">
                        {{ pack.price }}€
                    </span>
                </div>
            </div>

            <div class="flex items-center justify-center gap-2 text-xs text-muted mt-4">
                <Icon name="lucide:lock" size="11" class="shrink-0" />
                <span>Paiement sécurisé Stripe</span>
            </div>
        </section>
    </div>

    <!-- Modales features -->
    <FeatureUnlockModal v-for="feature in features" :key="feature.key" v-model="featureModals[feature.key]"
        :featureKey="feature.key" />

    <!-- Modale confirmation achat -->
    <Dialog v-model:visible="confirmModal" dismissableMask modal :draggable="false"
        :style="{ width: '25rem', margin: '1rem' }"
        :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
        <template #container>
            <div class="flex flex-col gap-5 p-5 rounded-xl border border-white/8 bg-dark">

                <!-- Header -->
                <div class="flex items-center justify-between">
                    <h2 class="font-heading text-xl font-bold text-white">Confirmer l'achat</h2>
                    <button @click="confirmModal = false"
                        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/8 text-muted hover:text-white transition-colors">
                        <Icon name="lucide:x" size="22" />
                    </button>
                </div>

                <!-- Résumé -->
                <p class="text-sm text-muted">
                    Tu vas dépenser
                    <span class="font-bold text-accent">{{ pendingPrice?.cost }} Charm</span>
                    pour {{ hasFeature(pendingFeature?.key) ? 'prolonger ' : 'débloquer ' }}<span
                        class="font-bold text-white">{{ pendingFeature?.label }}</span>
                    pendant <span class="font-bold text-white">{{ pendingPrice?.label }}</span>.
                </p>

                <!-- Upsell Charmi+ -->
                <div class="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/8 hover:bg-primary/15 cursor-pointer transition-all"
                    @click="confirmModal = false; openCheckout('sub', 'subscription')">
                    <img src="/images/mascotte/charmi-happy-violet.svg" alt="" class="w-8 h-8 shrink-0 opacity-80" />
                    <div class="flex flex-col gap-0.5 flex-1">
                        <span class="text-sm font-semibold text-[#a89ff0]">Passe à Charmi+ pour tout débloquer</span>
                        <p class="text-xs text-muted">
                            {{ upsellDiff
                                ? `Accès illimité pour seulement ${upsellDiff}€ de plus`
                                : 'Accès illimité pour seulement 7,99€/mois' }}
                        </p>
                    </div>
                    <Icon name="lucide:arrow-right" size="14" class="text-[#a89ff0] shrink-0" />
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
                    <div class="flex items-center justify-between text-xs text-muted">
                        <span>Solde après achat</span>
                        <div class="flex items-center gap-1">
                            <img src="/images/assets/charmi-monnaie-jaune.svg" alt="Charm" class="w-3 h-3 shrink-0" />
                            <span class="font-semibold"
                                :class="balance - (pendingPrice?.cost ?? 0) < 0 ? 'text-red-400' : 'text-accent'">
                                {{ balance - (pendingPrice?.cost ?? 0) }}
                            </span>
                        </div>
                    </div>
                    <p v-if="balance < (pendingPrice?.cost ?? 0)" class="text-xs text-red-400 mt-1">
                        Il te manque {{ (pendingPrice?.cost ?? 0) - balance }} Charm
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                    <button v-if="balance < (pendingPrice?.cost ?? 0)"
                        @click="confirmModal = false; openCheckout(recommendedPack?.priceId)"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors">
                        <img src="/images/assets/charmi-monnaie-blanc.svg" alt="" class="w-4 h-4" />
                        <span>Acheter {{ recommendedPack?.coins }} Charm</span>
                    </button>
                    <button v-else :disabled="spending" @click="confirmSpend"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <Icon name="lucide:check" size="16" />
                        <span>Confirmer</span>
                    </button>
                </div>

            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">

const { balance, fetchBalance } = useWallet()
const { hasFeature, getExpiryLabel, spend, fetchAccess, isSub } = useFeatures()
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
        label: 'Charmi+ Mensuel',
        price: 7.99,
        duration: '/ mois',
        priceId: 'sub',
        access: 'Tout Charmi, sans limites',
        popular: true,
        features: [
            'Badge vérifié sur la Découverte',
            '6 Charm/jour automatiques',
            'Personnalisation avancée',
            'Planning pour tes stories',
            'Masque le logo Charmi',
        ]
    },
]

// Packs Coins
const coinPacks = [
    {
        coins: 300, price: 2.99, best: false,
        priceId: 'coins_little',
    },
    {
        coins: 800, price: 6.99, best: true,
        priceId: 'coins_middle',
        bonus: '700 + 100 offerts',
    },
    {
        coins: 2000, price: 14.99, best: false,
        priceId: 'coins_big',
        bonus: '1500 + 500 offerts',
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

const upsellDiff = computed(() => {
    if (!pendingPrice.value) return 0
    const coinCost = parseFloat(coinToEuro(pendingPrice.value.cost))
    if (coinCost < 2) return null
    const diffNum = 7.99 - coinCost
    return diffNum > 0 ? diffNum.toFixed(2) : null
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

const loading = ref(true)
onMounted(async () => {
    const alreadyTracked = sessionStorage.getItem('charmiplus_launch') === 'true'

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

        sessionStorage.setItem('charmiplus_launch', 'true')
    }
    loading.value = false
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