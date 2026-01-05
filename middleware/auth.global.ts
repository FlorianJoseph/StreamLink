import { CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION } from '~/constants/legal'

export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    // Routes toujours autorisées
    const allowedPaths = [
        '/auth/login',
        '/auth/callback',
        '/auth/accept-terms',
        '/privacy'
    ]
    if (allowedPaths.some(path => to.path.startsWith(path))) return

    // Si la session n’est pas encore chargée, attend qu’elle soit disponible
    if (!user.value) {
        const { data } = await supabase.auth.getSession()
        if (data.session) user.value = data.session.user as any
    }

    // Empêche un utilisateur connecté d'aller sur login
    if (to.path.startsWith('/auth/login') && user.value) {
        return navigateTo('/')
    }

    // Route protégée mais pas connecté → login
    const protectedRoutes = ['/admin']
    if (protectedRoutes.some(route => to.path.startsWith(route)) && !user.value) {
        return navigateTo(
            `/auth/login?redirect=${encodeURIComponent(to.fullPath)}`
        )
    }

    // Vérifie la version des CGU en métadonnées
    const userTermsVersion = user.value?.user_metadata?.terms_version
    const userPrivacyVersion = user.value?.user_metadata?.privacy_version

    // Si utilisateur connecté mais CGU non acceptées → page d'acceptation
    if (user.value &&
        (userTermsVersion !== CURRENT_TERMS_VERSION ||
            userPrivacyVersion !== CURRENT_PRIVACY_VERSION)) {
        return navigateTo(
            `/auth/accept-terms?redirect=${encodeURIComponent(to.fullPath)}`
        )
    }

    // // Nettoie le code OAuth si présent
    // if (to.query.code) {
    //     const { code, ...query } = to.query
    //     return navigateTo({ path: to.path, query }, { replace: true })
    // }
})