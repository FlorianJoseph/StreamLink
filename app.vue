<template>
    <NuxtLayout>
        <!-- Toast quête -->
        <Toast position="top-right" group="quest" :pt="{
            root: { style: 'top: 64px' },
            message: { style: 'width: 320px; min-width: 0; margin-left: auto; background: #2A2B2F; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.4)' },
            messageContent: { style: 'align-items: flex-start; position: relative; padding-right: 28px' },
            closeButton: { style: 'position: absolute; top: 4px; right: 4px; margin: 0' },
            closeIcon: { style: 'width: 14px; height: 14px; color: #9A9BA0' }
        }">
            <template #message="slotProps">
                <div class="flex items-center gap-3 p-1">
                    <img src="/images/mascotte/charmi-happy-violet.svg" class="w-12 h-12 shrink-0" alt="" />
                    <div class="flex flex-col gap-0.5 flex-1">
                        <span class="text-xs font-bold text-accent">Quête complétée</span>
                        <span class="text-sm font-semibold text-white">{{ slotProps.message.summary }}</span>
                        <div class="flex items-center gap-1 mt-0.5">
                            <img src="/images/assets/charmi-monnaie-jaune.svg" class="w-3.5 h-3.5" alt="" />
                            <span class="text-sm font-bold text-accent">+{{ slotProps.message.detail }} Charm</span>
                        </div>
                    </div>
                </div>
            </template>
        </Toast>

        <!-- Toast paiement -->
        <Toast position="top-right" group="payment" :pt="{
            root: { style: 'top: 64px' },
            message: { style: 'width: 320px; min-width: 0; margin-left: auto; background: #2A2B2F; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.4)' },
            messageContent: { style: 'align-items: flex-start; position: relative; padding-right: 28px' },
            closeButton: { style: 'position: absolute; top: 4px; right: 4px; margin: 0' },
            closeIcon: { style: 'width: 14px; height: 14px; color: #9A9BA0' }
        }">
            <template #message="slotProps">
                <div class="flex items-center gap-3 p-1">
                    <img src="/images/mascotte/charmi-happy-violet.svg" class="w-12 h-12 shrink-0" alt="" />
                    <div class="flex flex-col gap-0.5 flex-1">
                        <span class="text-xs font-bold text-emerald-400">Paiement réussi</span>
                        <span class="text-sm font-semibold text-white">{{ slotProps.message.summary }}</span>
                        <div v-if="!isNaN(Number(slotProps.message.detail))" class="flex items-center gap-1 mt-0.5">
                            <img src="/images/assets/charmi-monnaie-jaune.svg" class="w-3.5 h-3.5" alt="" />
                            <span class="text-sm font-bold text-accent">+{{ slotProps.message.detail }} Charm
                                crédités</span>
                        </div>
                    </div>
                </div>
            </template>
        </Toast>

        <!-- Toast app générique -->
        <Toast position="top-right" group="app" :pt="{
            root: { style: 'top: 64px' },
            message: { style: 'width: 320px; min-width: 0; margin-left: auto; background: #2A2B2F; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.4)' },
            messageContent: { style: 'align-items: flex-start; position: relative; padding-right: 28px' },
            closeButton: { style: 'position: absolute; top: 4px; right: 4px; margin: 0' },
            closeIcon: { style: 'width: 14px; height: 14px; color: #9A9BA0' }
        }">
            <template #message="slotProps">
                <div class="flex items-center gap-3 p-1">
                    <img :src="severityMascotte(slotProps.message.severity)" class="w-12 h-12 shrink-0" alt="" />
                    <div class="flex flex-col gap-0.5 flex-1">
                        <span class="text-xs font-bold" :class="severityColor(slotProps.message.severity)">
                            {{ slotProps.message.summary }}
                        </span>
                        <span class="text-sm text-white">{{ slotProps.message.detail }}</span>
                    </div>
                </div>
            </template>
        </Toast>

        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
useHead({ htmlAttrs: { class: 'app-dark' } })

const supabase = useSupabaseClient()

supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.provider_token) {
        await $fetch('/api/auth/store-token', {
            method: 'POST',
            body: {
                accessToken: session.provider_token,
                refreshToken: session.provider_refresh_token,
            }
        })
    }
})

const severityMascotte = (severity: string) => {
    const map: Record<string, string> = {
        success: '/images/mascotte/charmi-happy-violet.svg',
        error: '/images/mascotte/charmi-dead-violet.svg',
        warn: '/images/mascotte/charmi-shocked-violet.svg',
        info: '/images/mascotte/charmi-confused-violet.svg',
        secondary: '/images/mascotte/charmi-happy-violet.svg',
    }
    return map[severity] ?? '/images/mascotte/charmi-confused-violet.svg'
}

const severityColor = (severity: string) => {
    const map: Record<string, string> = {
        success: 'text-emerald-400',
        error: 'text-red-400',
        warn: 'text-amber-400',
        info: 'text-primary',
        secondary: 'text-accent',
    }
    return map[severity] ?? 'text-primary'
}
</script>