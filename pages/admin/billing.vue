<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else class="flex flex-col fade-in py-4 lg:w-3xl">

        <!-- En-tête -->
        <div class="py-4">
            <div class="flex flex-col items-center h-12 justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                    Facturation
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center max-w-xl text-gray-400">
                    Gère ton abonnement et consulte tes transactions
                </p>
            </div>
        </div>

        <div class="flex flex-col gap-6 w-full mx-auto">
            <!-- Abonnement -->
            <div class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold flex items-center gap-2">
                    <Icon name="lucide:crown" size="20" class="text-amber-400" />
                    Abonnement
                </h2>
                <div class="p-5 rounded-xl border-2 transition-all"
                    :class="isSub ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-700 bg-zinc-800/30'">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                                :class="isSub ? 'bg-emerald-500/20' : 'bg-zinc-700'">
                                <Icon :name="isSub ? 'lucide:crown' : 'lucide:lock'" size="18"
                                    :class="isSub ? 'text-amber-400' : 'text-zinc-400'" />
                            </div>
                            <div class="flex flex-col">
                                <span class="font-semibold text-sm">
                                    {{ isSub ? 'Abonnement actif' : 'Aucun abonnement' }}
                                </span>
                                <span class="text-xs text-gray-400">
                                    {{ isSub
                                        ? subscription?.status === 'canceled'
                                            ? 'Annulé : accès maintenu jusqu\'à expiration'
                                            : 'Accès illimité à toutes les fonctionnalités'
                                        : 'Passe au niveau supérieur pour tout débloquer' }}
                                </span>
                            </div>
                        </div>
                        <Button v-if="isSub" severity="secondary" outlined @click="openPortal" class="w-full sm:w-auto">
                            <Icon name="lucide:settings" size="16" />
                            <span class="text-sm">Gérer</span>
                        </Button>
                        <NuxtLink v-else to="/shop#sub-section">
                            <Button severity="contrast">
                                <Icon name="lucide:zap" size="16" />
                                <span class="text-sm">S'abonner</span>
                            </Button>
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <!-- Historique transactions -->
            <div class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold flex items-center gap-2">
                    <Icon name="lucide:clock" size="20" class="text-gray-400" />
                    Historique des transactions
                </h2>
                <div v-if="historyLoading" class="flex justify-center py-8">
                    <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="6" />
                </div>
                <div v-else-if="!history?.length"
                    class="flex flex-col items-center justify-center py-12 text-center border border-zinc-700 rounded-xl">
                    <Icon name="lucide:inbox" size="40" class="text-zinc-600 mb-3" />
                    <p class="text-sm text-zinc-500">Aucune transaction pour l'instant</p>
                </div>
                <div v-else class="flex flex-col gap-2">
                    <div v-for="tx in history" :key="tx.id"
                        class="flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/30">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                                :class="tx.operation === 'credit' ? 'bg-emerald-500/15' : 'bg-red-500/15'">
                                <Icon :name="txIcon(tx.type)" size="16"
                                    :class="tx.operation === 'credit' ? 'text-emerald-400' : 'text-red-400'" />
                            </div>
                            <div class="flex flex-col">
                                <span class="text-xs sm:text-sm font-medium">{{ txLabel(tx.type) }}</span>
                                <span class="text-xs text-gray-500">{{ formatDate(tx.created_at) }}</span>
                            </div>
                        </div>
                        <span class="text-xs sm:text-sm font-bold"
                            :class="tx.operation === 'credit' ? 'text-emerald-400' : 'text-red-400'">
                            {{ tx.operation === 'credit' ? '+' : '-' }}{{ tx.amount }}
                            <span class="text-xs font-normal text-gray-500">Coins</span>
                        </span>
                    </div>
                </div>
                <Button v-if="historyHasMore" severity="secondary" outlined class="w-full mt-2"
                    :loading="historyLoading" @click="historyPage++; loadHistory()">
                    Charger plus
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { isSub, fetchSubscription, subscription } = useFeatures()

const loading = ref(true)
const history = ref<any[]>([])
const historyPage = ref(0)
const historyHasMore = ref(true)
const historyLoading = ref(false)

const loadHistory = async () => {
    historyLoading.value = true
    const data = await $fetch('/api/wallet/history', { query: { page: historyPage.value } })
    if (data.length < 10) historyHasMore.value = false
    history.value.push(...data)
    historyLoading.value = false
}

const openPortal = async () => {
    const { url } = await $fetch('/api/stripe/portal', { method: 'POST' })
    const width = 1000
    const height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    window.open(url, 'stripe-portal', `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`)
}

const txIcon = (type: string) => {
    const icons: Record<string, string> = {
        purchase: 'lucide:shopping-bag',
        quest: 'lucide:trophy',
        spend: 'lucide:sparkles',
        raid: 'lucide:swords',
        referral: 'lucide:users',
        stream: 'lucide:radio',
        daily: 'lucide:calendar-check',
    }
    return icons[type] ?? 'lucide:coins'
}

const txLabel = (type: string) => {
    const labels: Record<string, string> = {
        purchase: 'Achat de Coins',
        quest: 'Quête complétée',
        spend: 'Fonctionnalité débloquée',
        raid: 'Raid',
        referral: 'Parrainage',
        stream: 'Stream',
        daily: 'Connexion quotidienne',
    }
    return labels[type] ?? type
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

onMounted(async () => {
    await fetchSubscription()
    await loadHistory()
    loading.value = false
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