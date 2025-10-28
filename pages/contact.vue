<template>
    <div class="flex flex-col gap-4 mt-8 min-w-full">
        <!-- En-tête -->
        <div class="py-4">
            <div class="flex flex-col items-center h-12 justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                    Formulaire de contact
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center max-w-xl">
                    Contactez-nous pour toute question ou demande d'information.
                </p>
            </div>
        </div>
        <!-- Formulaire de contact -->
        <div class="flex flex-col text-center">
            <p>Le formulaire de contact sera bientôt disponible.</p>
            <p>En attendant, vous pouvez nous envoyer un email à nordik.contact@gmail.com</p>
        </div>
    </div>
    <!-- <Card>
        <template #content>
            <div class="flex justify-center flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="username">Nom</label>
                    <InputText v-model="nom" class="w-full" style="--p-inputtext-focus-border-color : #ffffff" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="email">Email</label>
                    <InputText v-model="email" class="w-full" style="--p-inputtext-focus-border-color : #ffffff" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="message">Message</label>
                    <Textarea v-model="message" rows="5" cols="30" style="--p-textarea-focus-border-color : #ffffff" />
                </div>
                <Button type="submit" severity="contrast" label="Soumettre" class="mt-2" />
            </div>
        </template>
</Card> -->
</template>

<script setup>
const message = ref('');
const nom = ref('');
const email = ref('');
</script>
