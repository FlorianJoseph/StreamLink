<template>
    <div class="flex flex-col justify-center items-center min-h-full text-center ">
        <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="5" fill="transparent" animationDuration=".5s"
            aria-label="Chargement..." />
        <h2 class="text-lg font-medium mt-4">Connexion en cours...</h2>
        <p class="text-gray-400 text-sm">
            Ne fermez pas cette page, vous allez être redirigé automatiquement.
        </p>
    </div>
</template>

<script setup>
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient()

onMounted(async () => {
    try {
        // Récupère la session actuelle
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        // Si l'utilisateur est authentifié, redirige vers la page souhaitée
        const redirect = route.query.redirect || '/'
        if (session) {
            router.replace(redirect)
        } else {
            throw new Error('Utilisateur non authentifié')
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de la session :', err)
        router.replace('/auth/login')
    }
})

onMounted(async () => {
    if (user.value) {
        await streamerStore.fetchStreamer()
    }
})

</script>
