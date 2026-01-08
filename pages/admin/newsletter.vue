<template>
    <Card class="w-full max-w-md mx-auto mt-4 text-center">
        <template #title>
            <span class="font-semibold">Envoyer la newsletter</span>
        </template>

        <template #content>
            <Button @click="handleSend" :loading="sending" :disabled="sending">
                Envoyer la newsletter
            </Button>

            <p v-if="result">Newsletter envoyée à {{ result.sent }} abonnés</p>
            <p v-if="error" class="text-red-500">{{ error }}</p>
        </template>
    </Card>
</template>

<script setup>
const { sendNewsletter, sending, result, error } = useNewsletterAdmin()

const handleSend = async () => {
    await sendNewsletter()
}
</script>
