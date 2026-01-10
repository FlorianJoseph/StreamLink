import { CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION } from '~/constants/legal'
import type { UserConsent } from '~/types/userConsent'

export const useConsent = () => {
    const supabase = useSupabaseClient()

    // Vérifie que l'utilisateur à accepté les bonnes versions 
    const hasAccepted = async (policy: 'terms' | 'privacy', uid?: string) => {
        const userId = uid
        if (!userId) throw new Error('User ID non défini')

        const version =
            policy === 'terms' ? CURRENT_TERMS_VERSION : CURRENT_PRIVACY_VERSION

        const { data } = await supabase
            .from('UserConsents')
            .select('id')
            .eq('user_id', userId)
            .eq('policy', policy)
            .eq('version', version)
            .maybeSingle()

        return !!data
    }

    // L'utilisateur accepte la version actuelle
    const accept = async (policy: 'terms' | 'privacy', uid?: string) => {
        const userId = uid
        if (!userId) throw new Error('User ID non défini')

        const version =
            policy === 'terms' ? CURRENT_TERMS_VERSION : CURRENT_PRIVACY_VERSION

        const { error } = await supabase
            .from<UserConsent>('UserConsents')
            .upsert({
                user_id: userId,
                policy,
                version,
                accepted_at: new Date().toISOString()
            }, {
                onConflict: ['user_id', 'policy'],
                update: { version, accepted_at: new Date().toISOString() }
            })

        if (error) throw new Error(error.message)
    }

    return { hasAccepted, accept }
}