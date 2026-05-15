<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 40px; height: 40px; --p-progressspinner-color-one:#6A5AE0; --p-progressspinner-color-two:#8B7FF0; --p-progressspinner-color-three:#6A5AE0; --p-progressspinner-color-four:#4A3AC0"
            strokeWidth="6" fill="transparent" animationDuration=".5s" />
    </div>
    <div v-else class="flex flex-col fade-in py-6 lg:w-3xl gap-6">

        <!-- Solde -->
        <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden">
            <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex flex-col gap-0.5">
                    <span class="text-xs text-muted">Solde actuel</span>
                    <div class="flex items-center gap-1.5">
                        <img src="/images/assets/charmi-monnaie-jaune.svg" alt="Charm" class="w-4 h-4 shrink-0" />
                        <span class="text-2xl font-bold text-white">{{ balance }}</span>
                        <span class="text-sm text-muted">Charm</span>
                    </div>
                </div>
                <NuxtLink to="/shop">
                    <button
                        class="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors w-full sm:w-auto">
                        <img src="/images/assets/charmi-monnaie-blanc.svg" alt="" class="w-4 h-4" />
                        Acheter des Charm
                    </button>
                </NuxtLink>
            </div>
        </section>

        <!-- Historique transactions -->
        <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                <Icon name="lucide:clock" size="18" class="text-muted shrink-0" />
                <span class="text-sm font-bold text-white">Historique des transactions</span>
            </div>

            <div class="p-4">
                <!-- Loading -->
                <div v-if="historyLoading && !history.length" class="flex justify-center py-8">
                    <ProgressSpinner
                        style="width: 32px; height: 32px; --p-progressspinner-color-one:#6A5AE0; --p-progressspinner-color-two:#8B7FF0; --p-progressspinner-color-three:#6A5AE0; --p-progressspinner-color-four:#4A3AC0"
                        strokeWidth="6" fill="transparent" />
                </div>

                <!-- Empty state -->
                <div v-else-if="!history?.length" class="flex flex-col items-center gap-3 py-12 text-center">
                    <img src="/images/mascotte/charmi-confused-violet.svg" alt="" class="w-16 h-16 opacity-60" />
                    <p class="text-sm text-muted">Aucune transaction pour l'instant</p>
                </div>

                <!-- Liste -->
                <div v-else class="flex flex-col gap-2">
                    <div v-for="tx in history" :key="tx.id"
                        class="flex items-center justify-between px-4 py-3 rounded-xl border border-white/8 bg-surface-darker">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                                :class="tx.operation === 'credit' ? 'bg-emerald-500/15' : 'bg-red-500/15'">
                                <Icon :name="txIcon(tx.type)" size="15"
                                    :class="tx.operation === 'credit' ? 'text-emerald-400' : 'text-red-400'" />
                            </div>
                            <div class="flex flex-col gap-0.5">
                                <span class="text-xs sm:text-sm font-medium text-white">{{ txLabel(tx.type) }}</span>
                                <span class="text-xs text-muted">{{ formatDate(tx.created_at) }}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <span class="text-xs sm:text-sm font-bold"
                                :class="tx.operation === 'credit' ? 'text-emerald-400' : 'text-red-400'">
                                {{ tx.operation === 'credit' ? '+' : '-' }}{{ tx.amount }}
                            </span>
                            <img src="/images/assets/charmi-monnaie-jaune.svg" alt="Charm" class="w-3 h-3 shrink-0" />
                        </div>
                    </div>

                    <!-- Charger plus -->
                    <button v-if="historyHasMore" @click="historyPage++; loadHistory()" :disabled="historyLoading"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-sm font-semibold text-muted hover:text-white transition-colors mt-2 disabled:opacity-40">
                        <Icon v-if="historyLoading" name="lucide:loader-circle" size="16" class="animate-spin" />
                        <span>{{ historyLoading ? 'Chargement...' : 'Charger plus' }}</span>
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">

useSeoMeta({ title: 'Mes Charm' })

const { balance } = useWallet()

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