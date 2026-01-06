export const useNewsletter = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const subscribe = async (streamerId: string) => {
        if (!user.value?.email) {
            throw new Error('Email utilisateur introuvable')
        }

        const { error } = await supabase
            .from('NewsletterSubscriptions')
            .upsert({
                user_id: streamerId,
                email: user.value.email,
                subscribed: true,
                subscribed_at: new Date().toISOString(),
                unsubscribed_at: null
            }, {
                onConflict: 'user_id'
            })

        if (error) throw error
    }

    const unsubscribe = async (streamerId: string) => {
        const { error } = await supabase
            .from('NewsletterSubscriptions')
            .update({
                subscribed: false,
                unsubscribed_at: new Date().toISOString()
            })
            .eq('user_id', streamerId)

        if (error) throw error
    }

    const isSubscribed = async (streamerId: string) => {
        const { data, error } = await supabase
            .from('NewsletterSubscriptions')
            .select('subscribed')
            .eq('user_id', streamerId)
            .maybeSingle()

        if (error) throw error
        return data?.subscribed ?? false
    }

    return {
        subscribe,
        unsubscribe,
        isSubscribed
    }
}
