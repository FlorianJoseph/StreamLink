<template>
    <div class="flex flex-col gap-6 py-6 max-w-sm w-full mx-auto">
        <!-- App toasts -->
        <section class="flex flex-col gap-3">
            <p class="text-xs font-bold text-muted uppercase tracking-wider">Toast app</p>
            <div class="flex flex-wrap gap-2">
                <button
                    @click="toast.add({ group: 'app', severity: 'success', summary: 'Succès', detail: 'Opération réussie avec succès', life: 16000 })"
                    class="px-4 py-2 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
                    Success
                </button>
                <button
                    @click="toast.add({ group: 'app', severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue', life: 16000 })"
                    class="px-4 py-2 rounded-md bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-semibold">
                    Error
                </button>
                <button
                    @click="toast.add({ group: 'app', severity: 'warn', summary: 'Attention', detail: 'Cette action peut avoir des conséquences', life: 16000 })"
                    class="px-4 py-2 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-semibold">
                    Warn
                </button>
                <button
                    @click="toast.add({ group: 'app', severity: 'info', summary: 'Info', detail: 'Une information importante', life: 16000 })"
                    class="px-4 py-2 rounded-md bg-primary/15 border border-primary/30 text-[#a89ff0] text-sm font-semibold">
                    Info
                </button>
                <button
                    @click="toast.add({ group: 'app', severity: 'secondary', summary: 'Raid lancé !', detail: 'Tes viewers sont en route', life: 16000 })"
                    class="px-4 py-2 rounded-md bg-accent/15 border border-accent/30 text-accent text-sm font-semibold">
                    Secondary (Raid)
                </button>
            </div>
        </section>

        <!-- Quest toast -->
        <section class="flex flex-col gap-3">
            <p class="text-xs font-bold text-muted uppercase tracking-wider">Toast quête</p>
            <button
                @click="toast.add({ group: 'quest', severity: 'success', summary: 'Premier raid effectué', detail: '15', life: 16000 })"
                class="w-fit px-4 py-2 rounded-md bg-accent/15 border border-accent/30 text-accent text-sm font-semibold">
                Quête complétée
            </button>
        </section>

        <!-- Payment toast -->
        <section class="flex flex-col gap-3">
            <p class="text-xs font-bold text-muted uppercase tracking-wider">Toast paiement</p>
            <div class="flex flex-wrap gap-2">
                <button
                    @click="toast.add({ group: 'payment', severity: 'success', summary: 'Pack 50 Charm', detail: '50', life: 16000 })"
                    class="px-4 py-2 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
                    Achat Charm
                </button>
                <button
                    @click="toast.add({ group: 'payment', severity: 'success', summary: 'Abonnement Charmi+', detail: 'NaN', life: 16000 })"
                    class="px-4 py-2 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
                    Achat Charmi+
                </button>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
const toast = useToast()

definePageMeta({ layout: 'fullscreen' })
</script>