<template>
    <div id="checkout" />
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'

const props = defineProps<{ clientSecret: string }>()
const config = useRuntimeConfig()

onMounted(async () => {
    const stripe = await loadStripe(config.public.stripePublishableKey)
    if (!stripe) return

    const checkout = await stripe.initEmbeddedCheckout({
        clientSecret: props.clientSecret,
    })

    checkout.mount('#checkout')
})
</script>