<template>
    <div class="flex flex-col justify-center items-center min-h-full text-center">
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
        if (!session?.user) throw new Error('Utilisateur non authentifié')

        const redirect = route.query.redirect ? decodeURIComponent(route.query.redirect) : '/'
        const accept = route.query.accept === 'true'

        // Si on vient d'accepter les conditions
        if (accept) {
            const { error: updateError } = await supabase.auth.updateUser({
                data: { terms_accepted: true }
            })
            if (updateError) throw updateError
            await supabase.auth.refreshSession()
            // Attends juste un petit délai pour que Supabase mette à jour la session côté client
            setTimeout(() => {
                router.replace(redirect)
            }, 300)

            return
        }

        // Si l'utilisateur a déjà accepté
        if (session.user.user_metadata?.terms_accepted) {
            router.replace(redirect)
        } else {
            router.replace(`/auth/accept-terms?redirect=${encodeURIComponent(redirect)}`)
        }
    } catch (err) {
        console.error(err)
        router.replace('/auth/login')
    }
})

definePageMeta({
    layout: 'auth'
})
</script>
