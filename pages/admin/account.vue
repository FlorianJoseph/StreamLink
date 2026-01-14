<template>
    <div v-if="loading" class="flex justify-center items-center pt-100 w-full">
        <ProgressSpinner
            style="width: 50px; height: 50px;--p-progressspinner-color-one
:#FFFFFF;--p-progressspinner-color-two :#F8F9FA;--p-progressspinner-color-three :#E9ECEF;--p-progressspinner-color-four:#DEE2E6 "
            strokeWidth="6" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else class="flex flex-col gap-4 w-full lg:w-3xl">
        <!-- En-tête -->
        <div class="py-4">
            <div class="flex flex-col items-center h-12 justify-end">
                <!-- Titre -->
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                    Mon Profil
                </h1>
                <!-- Sous-titre -->
                <p class="text-sm sm:text-base text-center max-w-xl">
                    Modifiez vos informations personnelles
                </p>
            </div>
        </div>

        <Card class="w-full mx-auto" v-if="user">
            <template #title>
                <p class="font-semibold">Mes informations</p>
            </template>
            <template #content>
                <div class="flex flex-col mb-4">
                    <span class="text-sm text-gray-400">Nom d'utilisateur</span>
                    <span>{{ user.user_metadata.nickname }}</span>
                </div>
                <div class="flex flex-col mb-4">
                    <span class="text-sm text-gray-400">Email</span>
                    <span>{{ user.user_metadata.email }}</span>
                    <span class="text-sm text-gray-500 mt-2">
                        Vos informations ne peuvent pas être modifiées car vous vous êtes inscrit à l'aide de votre
                        compte Twitch.
                    </span>
                </div>
            </template>
        </Card>

        <Card class="w-full mx-auto">
            <template #title>
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-col">
                        <span class="font-semibold">Notifications par email</span>
                        <span class="text-sm text-gray-400">
                            Recevoir les mises à jour importantes et nouveautés de StreamLink
                        </span>
                    </div>
                    <Button @click="newsletterStore.toggle"
                        :severity="newsletterStore.subscribed ? 'secondary' : 'info'">
                        <Icon :name="newsletterStore.subscribed ? 'lucide:mail-x' : 'lucide:mail-plus'" size="16" />
                        {{ newsletterStore.subscribed ? 'Désactiver' : 'Activer' }}
                    </Button>
                </div>
            </template>
        </Card>
        <Card class="w-full mx-auto">
            <template #title>
                <div class="flex flex-col">
                    <span class="font-semibold">Supprimer pour toujours</span>
                    <span class="text-sm text-gray-400">
                        Supprimez définitivement votre profil StreamLink.
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col items-center mt-4">
                    <ConfirmDialog />
                    <Button @click="confirmDelete()" severity="danger" variant="outlined" label="Supprimer le compte" />
                </div>
            </template>
        </Card>
    </div>
</template>


<script setup>
const user = useSupabaseUser();
const confirm = useConfirm();
const router = useRouter();
const streamerStore = useStreamerStore()
const supabase = useSupabaseClient();
const newsletterStore = useNewsletterStore()
const { loading } = storeToRefs(newsletterStore)

onMounted(() => newsletterStore.fetchStatus())

const confirmDelete = () => {
    confirm.require({
        message: 'Etes-vous sûr de vouloir supprimer votre compte ?',
        header: 'Confirmation',
        rejectProps: {
            label: 'Annuler',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Supprimer',
            severity: 'danger',
        },
        accept: async () => {
            try {
                // Supprimer le streamer et les liens
                const success = await streamerStore.deleteStreamerWithLinks(user.value?.sub);
                if (!success) throw new Error('La suppression a échoué');

                // Déconnexion
                await supabase.auth.signOut();

                // Redirection
                router.push('/');
            } catch (err) {
                console.error('Erreur lors de la suppression :', err.message);
            }
        },
    });
};

</script>