export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    // On laisse passer la page callback OAuth sinon boucle infinie
    if (to.path.startsWith('/auth/callback')) return

    // Si la session n’est pas encore chargée, attend qu’elle soit disponible
    if (!user.value) {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
            user.value = data.session.user as any
        }
    }

    // Empêche un utilisateur connecté d'aller sur login
    if (to.path.startsWith('/auth/login') && user.value) {
        return navigateTo('/')
    }

    // Liste des routes protégées
    const protectedRoutes = ['/admin']

    // Si la route est protégée & l'utilisateur pas connecté →
    // redirection automatique vers Twitch avec callback propre
    if (protectedRoutes.some(route => to.path.startsWith(route)) && !user.value) {
        const redirect = encodeURIComponent(to.fullPath)
        return navigateTo(`/auth/login?redirect=${redirect}`)
    }

    // Si on revient depuis Twitch avec un redirect → on envoie au bon endroit
    if (to.query.redirect && user.value) {
        const path = decodeURIComponent(to.query.redirect as string)
        return navigateTo(path)
    }
})
