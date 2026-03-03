<template>
    <div class="p-6 w-full sm:w-xl">
        <h1 class="text-2xl font-bold mb-4">Newsletter - Envoi segmenté</h1>

        <div class="mb-6 flex flex-col md:flex-row items-start md:items-center w-full gap-4">
            <Select v-model="selectedSegment" :options="segments" optionValue="value" optionLabel="label"
                placeholder="Sélectionner un segment" class="w-full md:w-xs" />
            <Button @click="loadPreview" severity="contrast">
                Voir
            </Button>
        </div>

        <div v-if="loading">Chargement…</div>

        <div v-if="preview">
            <p><strong>Template :</strong> {{ preview.templateId }}</p>
            <p><strong>Nombre d’utilisateurs :</strong> {{ preview.count }}</p>

            <h3 class="mt-4 font-medium">Exemple d’utilisateurs :</h3>
            <ul class="ml-4 list-disc">
                <li v-for="u in preview.sample" :key="u.email">{{ u.username }} ({{ u.email }})</li>
            </ul>

            <div class="mt-4">
                <Button @click="sendEmails" severity="contrast">
                    Envoyer
                </Button>
            </div>

            <div v-if="sentCount !== null" class="mt-2 text-green-700">
                {{ sentCount }} emails envoyés !
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const segments = ref([
    { value: 'update', label: 'Mises à jour' },
    { value: 'notVisible', label: 'Streameurs non visibles' },
    { value: 'notSchedule', label: 'Streameurs sans planning' },
]);

const selectedSegment = ref(null);
const preview = ref<any>(null)
const loading = ref(false)
const sentCount = ref<number | null>(null)

async function loadPreview() {
    loading.value = true
    preview.value = null
    sentCount.value = null
    try {
        const res = await $fetch('/api/admin/mail/preview', {
            params: { segment: selectedSegment.value }
        })
        preview.value = res
    } catch (err) {
        console.error(err)
        alert('Erreur lors du chargement de l’aperçu')
    } finally {
        loading.value = false
    }
}

async function sendEmails() {
    try {
        const res = await $fetch('/api/admin/mail/send', {
            method: 'POST',
            body: {
                segment: selectedSegment.value,
            }
        })
        sentCount.value = res.sent
    } catch (err) {
        console.error(err)
        alert('Erreur lors de l’envoi des emails')
    }
}
</script>