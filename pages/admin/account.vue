<template>
    <div class="flex flex-col gap-4 mt-8 min-w-full">
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

        <Card class="w-full mx-auto overflow-hidden" v-if="user">
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
        <Card>
            <template #title>
                <div class="flex flex-col">
                    <span class="font-semibold">Supprimer pour toujours</span>
                    <span class="text-sm text-gray-400">
                        Supprimez définitivement votre profil StreamLink.
                    </span>
                </div>
            </template>
            <template #content>
                <div class="flex justify-center mt-4">
                    <ConfirmDialog></ConfirmDialog>
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

import { TriangleAlert } from 'lucide-vue-next'

const svgIcons = {
    TriangleAlert: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
};

const confirmDelete = () => {
    confirm.require({
        message: 'Etes-vous sûr de vouloir supprimer votre compte ?',
        header: 'Confirmation',
        icon: TriangleAlert,
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