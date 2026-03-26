<template>
    <NuxtLayout>
        <Toast />
        <Toast position="top-right" group="quest" :pt="{
            root: { style: 'top: 64px' },
            message: { style: 'width: 320px; min-width: 0; margin-left: auto' },
            messageContent: { style: 'align-items: flex-start; position: relative; padding-right: 28px' },
            closeButton: { style: 'position: absolute; top: 4px; right: 4px; margin: 0' },
            closeIcon: { style: 'width: 14px; height: 14px' }
        }">
            <template #message="slotProps">
                <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                        style="background: linear-gradient(135deg, #7c3aed, #a855f7)">
                        <Icon name="lucide:coins" size="20" class="text-white" />
                    </div>
                    <div class="flex flex-col gap-0.5 flex-1">
                        <span class="text-[11px] font-semibold uppercase tracking-widest text-purple-400">Quête
                            complétée</span>
                        <span class="text-[13px] font-medium text-zinc-200">{{ slotProps.message.summary }}</span>
                        <span class="text-[13px] font-bold text-amber-400">+{{ slotProps.message.detail }} Coins</span>
                    </div>
                </div>
            </template>
        </Toast>
        <Toast position="top-right" group="payment" :pt="{
            root: { style: 'top: 64px' },
            message: { style: 'width: 320px; min-width: 0; margin-left: auto' },
            messageContent: { style: 'align-items: flex-start; position: relative; padding-right: 28px' },
            closeButton: { style: 'position: absolute; top: 4px; right: 4px; margin: 0' },
            closeIcon: { style: 'width: 14px; height: 14px' }
        }">
            <template #message="slotProps">
                <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                        style="background: linear-gradient(135deg, #7c3aed, #a855f7)">
                        <Icon name="lucide:coins" size="20" class="text-white" />
                    </div>
                    <div class="flex flex-col gap-0.5 flex-1">
                        <span class="text-[11px] font-semibold uppercase tracking-widest text-purple-400">Paiement
                            réussi</span>
                        <span class="text-[13px] font-medium text-zinc-200">{{ slotProps.message.summary }}</span>
                        <span v-if="!isNaN(Number(slotProps.message.detail))"
                            class="text-[13px] font-bold text-amber-400">
                            +{{ slotProps.message.detail }} Coins crédités
                        </span>
                    </div>
                </div>
            </template>
        </Toast>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup>
useHead({
    htmlAttrs: {
        class: 'app-dark'
    }
})
</script>