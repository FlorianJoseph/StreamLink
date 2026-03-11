<template>
    <div class="w-full space-y-8">

        <!-- Header -->
        <div class="border-b pb-4">
            <h1 class="text-2xl font-bold tracking-tight">Newsletter</h1>
            <p class="text-sm text-zinc-500 mt-0.5">Envoi segmenté vers vos utilisateurs</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Colonne gauche — Envoi -->
            <div class="space-y-4">
                <label class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Segment cible</label>
                <div class="flex gap-3">
                    <Select v-model="selectedSegment" :options="segments" optionValue="value" optionLabel="label"
                        placeholder="Sélectionner un segment" class="flex-1" />
                </div>

                <Transition name="fade">
                    <div v-if="loading" class="flex items-center gap-2 text-sm text-zinc-400 py-4">
                        <Icon name="lucide:loader-2" size="16" class="animate-spin" />
                        Chargement…
                    </div>

                    <div v-else-if="preview" class="space-y-4">
                        <div class="grid grid-cols-2 gap-3">
                            <div class="rounded-xl border p-4">
                                <p class="text-xs text-zinc-500 mb-1">Template</p>
                                <p class="font-semibold text-sm truncate">{{ preview.templateId }}</p>
                            </div>
                            <div class="rounded-xl border p-4">
                                <p class="text-xs text-zinc-500 mb-1">Destinataires</p>
                                <p class="font-semibold text-2xl">{{ preview.count }}</p>
                            </div>
                        </div>

                        <div class="rounded-xl border overflow-hidden">
                            <div class="px-4 py-2.5 border-b bg-zinc-50 dark:bg-zinc-900">
                                <p class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Échantillon</p>
                            </div>
                            <ul class="divide-y">
                                <li v-for="u in preview.sample" :key="u.email"
                                    class="flex items-center justify-between px-4 py-2.5">
                                    <span class="text-sm font-medium">{{ u.username }}</span>
                                    <span class="text-xs text-zinc-400 font-mono">{{ u.email }}</span>
                                </li>
                            </ul>
                        </div>

                        <div class="flex items-center gap-3">
                            <Button @click="sendEmails" severity="contrast">
                                <Icon name="lucide:send" size="16" />
                                Envoyer {{ preview.count }} emails
                            </Button>
                            <Transition name="fade">
                                <span v-if="sentCount !== null"
                                    class="text-sm text-green-600 font-medium flex items-center gap-1.5">
                                    <Icon name="lucide:check-circle" size="16" />
                                    {{ sentCount }} envoyés
                                </span>
                            </Transition>
                        </div>
                    </div>
                </Transition>
            </div>

            <!-- Colonne droite — Historique -->
            <div class="space-y-3">
                <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Historique</h2>

                <div v-if="emailsLoading" class="flex items-center gap-2 text-sm text-zinc-400 py-4">
                    <Icon name="lucide:loader-2" size="16" class="animate-spin" />
                    Chargement…
                </div>

                <div v-else class="rounded-xl border overflow-hidden">
                    <div class="divide-y">
                        <div v-for="mail in emails" :key="mail.id"
                            class="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                            <!-- Statut -->
                            <span :class="[
                                'w-1.5 h-1.5 rounded-full flex-shrink-0',
                                mail.last_event === 'delivered' ? 'bg-green-500' :
                                    mail.last_event === 'bounced' ? 'bg-red-500' :
                                        'bg-zinc-300'
                            ]" />
                            <!-- To -->
                            <span class="text-xs text-zinc-400 font-mono w-50 flex-shrink-0">
                                {{ mail.to[0] }}
                            </span>
                            <!-- Subject -->
                            <span class="text-sm font-medium truncate flex-1">{{ mail.subject }}</span>
                            <!-- Date -->
                            <span class="text-xs text-zinc-400 flex-shrink-0">
                                {{ timeAgo(mail.created_at) }}
                            </span>
                        </div>
                    </div>

                    <div v-if="hasMore" class="border-t px-4 py-2.5">
                        <button @click="loadEmails"
                            class="text-xs text-zinc-400 hover:text-zinc-600 transition-colors font-medium">
                            Charger plus
                        </button>
                    </div>
                </div>
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

const emails = ref<any[]>([])
const emailsLoading = ref(false)
const hasMore = ref(true)
const nextCursor = ref<string | null>(null)

async function loadEmails() {
    if (!hasMore.value) return

    emailsLoading.value = true

    try {
        const res = await $fetch('/api/admin/mail/list', {
            query: {
                limit: 15,
                after: nextCursor.value
            }
        })

        emails.value.push(...res.emails)
        hasMore.value = res.hasMore
        nextCursor.value = res.nextCursor
    } catch (err) {
        console.error(err)
        alert('Erreur chargement emails')
    } finally {
        emailsLoading.value = false
    }
}

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "À l'instant"
    if (mins < 60) return `il y a ${mins}min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `il y a ${hours}h`
    const days = Math.floor(hours / 24)
    return `il y a ${days}j`
}

watch(selectedSegment, (val) => {
    if (val) loadPreview()
    else { preview.value = null; sentCount.value = null }
})

onMounted(() => {
    loadEmails()
})
</script>