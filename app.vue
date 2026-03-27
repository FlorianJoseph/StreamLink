<template>
    <NuxtLayout>
        <!-- Toasts personnalisés pour les quêtes -->
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
        <!-- Toast personnalisé pour les paiements -->
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
        <!-- Toast générique pour les messages d'application -->
        <Toast position="top-right" group="app" :pt="{
            root: { style: 'top: 64px' },
            message: { style: 'width: 320px; min-width: 0; background: #27272a; margin-left: auto' },
            messageContent: { style: 'align-items: flex-start; position: relative; padding-right: 28px' },
            closeButton: { style: 'position: absolute; top: 4px; right: 4px; margin: 0' },
            closeIcon: { style: 'width: 14px; height: 14px' }
        }">
            <template #message="slotProps">
                <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                        :style="{ background: severityGradient(slotProps.message.severity) }">
                        <Icon :name="severityIcon(slotProps.message.severity)" size="20" class="text-white" />
                    </div>
                    <div class="flex flex-col gap-0.5 flex-1">
                        <span class="text-[11px] font-semibold uppercase tracking-widest"
                            :class="severityColor(slotProps.message.severity)">
                            {{ slotProps.message.summary }}
                        </span>
                        <span class="text-[13px] text-zinc-200">{{ slotProps.message.detail }}</span>
                    </div>
                </div>
            </template>
        </Toast>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
    htmlAttrs: {
        class: 'app-dark'
    }
})

const severityGradient = (severity: string) => {
    const map: Record<string, string> = {
        success: 'linear-gradient(135deg, #059669, #10b981)',
        error: 'linear-gradient(135deg, #dc2626, #ef4444)',
        warn: 'linear-gradient(135deg, #d97706, #f59e0b)',
        info: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    }
    return map[severity] ?? map.info
}

const severityIcon = (severity: string) => {
    const map: Record<string, string> = {
        success: 'lucide:check',
        error: 'lucide:x',
        warn: 'lucide:alert-triangle',
        info: 'lucide:info',
    }
    return map[severity] ?? 'lucide:info'
}

const severityColor = (severity: string) => {
    const map: Record<string, string> = {
        success: 'text-emerald-400',
        error: 'text-red-400',
        warn: 'text-amber-400',
        info: 'text-blue-400',
    }
    return map[severity] ?? 'text-blue-400'
}
</script>