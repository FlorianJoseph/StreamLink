<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :style="{ width: '25rem', margin: '1rem' }"
        :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
        <template #container>
            <div class="flex flex-col gap-4 p-5 rounded-xl border border-white/8 bg-dark">

                <!-- Header -->
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                        <img src="/images/mascotte/charmi-happy-violet.svg" class="w-11 h-11 shrink-0" alt="" />
                        <div>
                            <h2 class="font-heading text-2xl font-bold text-white">Charmi+</h2>
                            <div class="flex items-baseline gap-2">
                                <span class="text-base font-bold text-accent">7 jours gratuits</span>
                                <span class="text-xs text-muted">puis 7,99€/mois</span>
                            </div>
                        </div>
                    </div>
                    <button @click="visible = false"
                        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/8 text-muted hover:text-white transition-colors">
                        <Icon name="lucide:x" size="22" />
                    </button>
                </div>

                <!-- Titre contextuel -->
                <p class="text-xs text-muted">
                    <template v-if="featureKey">
                        <span class="text-white font-semibold">
                            {{benefits.find(b => b.key === featureKey)?.label}}</span> mais aussi :
                    </template>
                    <template v-else>
                        Tout ce qui est inclus dans Charmi+
                    </template>
                </p>

                <!-- Benefits 2 colonnes -->
                <div class="grid grid-cols-2 gap-1.5">
                    <div v-for="benefit in benefits.filter(b => b.key !== featureKey)" :key="benefit.label"
                        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-dark border border-white/8 transition-colors"
                        :class="benefit.full ? 'col-span-2' : ''">
                        <Icon :name="benefit.icon" size="13" class="text-primary shrink-0" />
                        <span class="text-xs leading-tight text-white/80">{{ benefit.label }}</span>
                    </div>
                </div>

                <!-- Reassurance + CTA -->
                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-center gap-3 text-xs text-muted">
                        <div class="flex items-center gap-1">
                            <Icon name="lucide:lock" size="11" />
                            <span>Paiement sécurisé</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <Icon name="lucide:x-circle" size="11" />
                            <span>Annulation à tout moment</span>
                        </div>
                    </div>
                    <button @click="subscribe" :disabled="subscribing"
                        class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-primary hover:bg-primary/80 text-white font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                        <Icon v-if="subscribing" name="lucide:loader-circle" size="16" class="animate-spin" />
                        {{ subscribing ? 'Redirection...' : 'Essayer Charmi+ gratuitement' }}
                    </button>
                </div>

            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
const toast = useToast()
const config = useRuntimeConfig()

const props = defineProps<{
    featureKey?: string
}>()

const visible = defineModel<boolean>()

const benefits = [
    { key: 'daily', icon: 'lucide:coins', label: 'Reçois 6 Charm/jour automatiquement' },
    { key: 'badge', icon: 'lucide:badge-check', label: 'Sois reconnu sur la Découverte' },
    { key: 'premium_theme', icon: 'lucide:palette', label: '13 thèmes et 23 polices exclusifs' },
    { key: 'mobile_export', icon: 'lucide:smartphone', label: 'Planning partageable en story' },
    { key: 'no_branding', icon: 'lucide:eye-off', label: 'Masque le logo Charmi' },
]

const openCheckout = async () => {
    const priceId = config.public.stripePriceSub
    const { clientSecret } = await $fetch('/api/stripe/checkout', {
        method: 'POST',
        body: { priceId, mode: 'subscription' }
    })
    sessionStorage.setItem('stripe_client_secret', clientSecret)
    const width = 500, height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const popup = window.open('/checkout', 'stripe-checkout',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`)
    return popup
}

const subscribing = ref(false)

const subscribe = async () => {
    subscribing.value = true
    try {
        const popup = await openCheckout()
        if (!popup) {
            toast.add({
                group: 'app',
                severity: 'error',
                summary: 'Popup bloquée',
                detail: 'Autorise les popups pour accéder au paiement',
                life: 5000,
            })
        }
    } finally {
        subscribing.value = false
        visible.value = false
    }
}
</script>