
export const useNewsletter = () => {
    const supabase = useSupabaseClient()

    const subscribe = async (uid: string) => {
        const userId = uid

        const { error } = await supabase
            .from('NewsletterSubscriptions')
            .upsert({
                user_id: userId,
                subscribed: true,
                subscribed_at: new Date().toISOString(),
                unsubscribed_at: null
            }, {
                onConflict: 'user_id'
            })

        if (error) throw error
    }

    const unsubscribe = async (uid: string) => {
        const userId = uid

        const { error } = await supabase
            .from('NewsletterSubscriptions')
            .update({
                subscribed: false,
                unsubscribed_at: new Date().toISOString()
            })
            .eq('user_id', userId)

        if (error) throw error
    }

    const isSubscribed = async (uid: string): Promise<boolean> => {
        const userId = uid

        const { data, error } = await supabase
            .from('NewsletterSubscriptions')
            .select('subscribed')
            .eq('user_id', userId)
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
