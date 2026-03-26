<template>
    <div id="checkout" />
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'

const route = useRoute()
const config = useRuntimeConfig()

onMounted(async () => {
    // Si on revient après paiement (return_url)
    if (route.query.session_id) {
        if (window.opener) {
            window.opener.postMessage({
                type: 'payment_success',
                session_id: route.query.session_id
            }, '*')
        }
        window.close()
        return
    }

    const clientSecret = sessionStorage.getItem('stripe_client_secret')
    sessionStorage.removeItem('stripe_client_secret')
    if (!clientSecret) return

    const stripe = await loadStripe(config.public.stripePublishableKey)
    if (!stripe) return

    const checkout = await stripe.initEmbeddedCheckout({
        clientSecret,
    })

    checkout.mount('#checkout')
})

definePageMeta({
    layout: false // pas de navbar
})
</script>