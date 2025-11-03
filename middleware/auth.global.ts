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

    // Si utilisateur connecté mais CGU non acceptées → page d'acceptation
    if (
        user.value &&
        user.value.user_metadata?.terms_accepted !== true &&
        !['/auth/accept-terms', '/privacy'].includes(to.path)
    ) {
        const redirect = encodeURIComponent(to.fullPath)
        return navigateTo(`/auth/accept-terms?redirect=${redirect}`)
    }

    // Redirection après login OAuth (mais seulement si pas déjà sur accept-terms)
    if (to.query.redirect && user.value && to.path !== '/auth/accept-terms') {
        const path = decodeURIComponent(to.query.redirect as string)
        return navigateTo(path)
    }
})
