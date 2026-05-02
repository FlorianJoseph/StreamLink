<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 40px; height: 40px; --p-progressspinner-color-one:#6A5AE0; --p-progressspinner-color-two:#8B7FF0; --p-progressspinner-color-three:#6A5AE0; --p-progressspinner-color-four:#4A3AC0"
            strokeWidth="6" fill="transparent" animationDuration=".5s" />
    </div>
    <div v-else class="flex flex-col gap-4 w-full lg:w-3xl py-6">

        <!-- Mes informations -->
        <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                <Icon name="lucide:user" size="18" class="text-muted shrink-0" />
                <span class="text-sm font-bold text-white">Mes informations</span>
            </div>
            <div class="p-4 flex flex-col gap-4" v-if="user">
                <div class="flex flex-col gap-0.5">
                    <span class="text-xs text-muted">Nom d'utilisateur</span>
                    <span class="text-sm font-medium text-white">{{ user.user_metadata.nickname }}</span>
                </div>
                <div class="flex flex-col gap-0.5">
                    <span class="text-xs text-muted">Email</span>
                    <span class="text-sm font-medium text-white">{{ user.user_metadata.email }}</span>
                    <span class="text-xs text-muted mt-1">
                        Tes informations ne peuvent pas être modifiées car tu t'es inscrit avec ton compte Twitch.
                    </span>
                </div>
            </div>
        </section>

        <!-- Notifications -->
        <section class="rounded-xl border border-white/8 bg-surface-dark overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                <Icon name="lucide:bell" size="18" class="text-muted shrink-0" />
                <span class="text-sm font-bold text-white">Notifications par email</span>
            </div>
            <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p class="text-sm text-muted">Reçois les mises à jour importantes et nouveautés de Charmi.</p>
                <button @click="newsletterStore.toggle"
                    class="flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-semibold transition-colors shrink-0"
                    :class="newsletterStore.subscribed
                        ? 'border-white/8 text-muted hover:border-white/20 hover:text-white'
                        : 'bg-primary hover:bg-primary/80 text-white border-transparent'">
                    <Icon :name="newsletterStore.subscribed ? 'lucide:mail-x' : 'lucide:mail-plus'" size="16" />
                    {{ newsletterStore.subscribed ? 'Désactiver' : 'Activer' }}
                </button>
            </div>
        </section>

        <!-- Supprimer le compte -->
        <section class="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-red-500/20">
                <Icon name="lucide:triangle-alert" size="18" class="text-red-400 shrink-0" />
                <span class="text-sm font-bold text-white">Zone dangereuse</span>
            </div>
            <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex flex-col gap-0.5">
                    <span class="text-sm font-semibold text-white">Supprimer mon compte</span>
                    <span class="text-xs text-muted">Cette action est irréversible. Toutes tes données seront
                        perdues.</span>
                </div>
                <button @click="confirmDelete()"
                    class="flex items-center gap-2 px-4 py-2 rounded-md border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-400 text-sm font-semibold transition-colors shrink-0">
                    <Icon name="lucide:trash-2" size="16" />
                    Supprimer le compte
                </button>
            </div>
        </section>

        <!-- Modal suppression -->
        <Dialog v-model:visible="showDeleteConfirm" dismissableMask modal :draggable="false" :style="{ margin: '1rem' }"
            :pt="{ root: { style: 'background: transparent; border: none; box-shadow: none;' } }">
            <template #container>
                <div class="flex flex-col items-center gap-5 p-6 rounded-xl border border-white/8 bg-dark w-[20rem]">
                    <div class="flex flex-col items-center gap-2 text-center">
                        <h2 class="font-heading text-xl font-bold text-white">Supprimer le compte ?</h2>
                        <p class="text-muted text-sm">Cette action est irréversible. Toutes tes données seront
                            définitivement perdues.</p>
                    </div>
                    <div class="flex gap-2 w-full">
                        <button @click="showDeleteConfirm = false"
                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-white/8 hover:border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors">
                            <Icon name="lucide:x" size="16" class="shrink-0" />
                            Annuler
                        </button>
                        <button @click="handleDelete"
                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 text-red-400 text-sm font-semibold transition-colors">
                            <Icon name="lucide:trash-2" size="16" class="shrink-0" />
                            Supprimer
                        </button>
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
const user = useSupabaseUser()
const router = useRouter()
const supabase = useSupabaseClient()
const newsletterStore = useNewsletterStore()
const { loading } = storeToRefs(newsletterStore)

onMounted(() => newsletterStore.fetchStatus())

const showDeleteConfirm = ref(false)

const confirmDelete = () => {
    showDeleteConfirm.value = true
}

const handleDelete = async () => {
    try {
        await $fetch('/api/account/delete', { method: 'DELETE' })
        await supabase.auth.signOut()
        router.push('/')
    } catch (err) {
        console.error('Erreur lors de la suppression :', err.message)
    }
}
</script>