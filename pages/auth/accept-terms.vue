<template>
    <Card class="w-full sm:w-[600px] lg:w-[750px]">
        <template #title>
            <div class="py-4">
                <div class="flex flex-col items-center h-12 justify-end">
                    <!-- Titre -->
                    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                        Conditions d'utilisation
                    </h1>
                    <!-- Sous-titre -->
                    <p class="text-sm sm:text-base text-center max-w-xl">
                        Vous devez accepter les conditions d'utilisation pour continuer.
                    </p>
                </div>
            </div>
        </template>
        <template #content>
            <div class="flex flex-col gap-6">
                <div class="flex items-start gap-3 w-full">
                    <Checkbox v-model="checked" binary style="--p-checkbox-checked-background: #f0f0f0;
           --p-checkbox-checked-border-color: #f0f0f0;
           --p-checkbox-checked-hover-border-color: #f0f0f0;
           --p-checkbox-checked-hover-background: #f0f0f0;" />
                    <div class="flex-1 text-sm">
                        <p class="flex flex-wrap">
                            J'ai lu et j'accepte les&nbsp;
                            <NuxtLink to="/privacy" class="hover:underline text-blue-500">
                                Conditions d'utilisation
                            </NuxtLink>
                            <span>&nbsp;et la&nbsp;</span>
                            <NuxtLink to="/privacy" class="hover:underline text-blue-500">
                                Politique de confidentialité
                            </NuxtLink>.
                        </p>
                        <div v-if="error" class="text-red-500 text-sm mt-1">
                            {{ error }}
                        </div>
                    </div>
                </div>
                <Button severity="contrast" class="font-semibold w-full" @click="acceptTerms">
                    <Icon name="lucide:check" size="20" />
                    <span class="text-sm sm:text-base font-semibold">Accepter</span>
                </Button>
            </div>
        </template>
    </Card>
</template>

<script setup>
const checked = ref(false)
const error = ref(null)
const router = useRouter()
const route = useRoute()

async function acceptTerms() {
    if (!checked.value) {
        error.value = "Vous devez accepter les conditions pour continuer."
        return
    }

    const redirect = route.query.redirect ? decodeURIComponent(route.query.redirect) : '/'
    router.push(`/auth/callback?redirect=${encodeURIComponent(redirect)}&accept=true`)
}

definePageMeta({
    layout: 'auth'
})
</script>
