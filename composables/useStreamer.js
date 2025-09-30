export const useStreamer = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const loading = ref(true)
    const streamer = ref(null)

    // Récupérer le streamer du user connecté
    const fetchStreamer = async () => {
        if (!user.value) {
            loading.value = false
            return
        }

        const { data, error } = await supabase
            .from('Streamer')
            .select('*')
            .eq('id', user.value.sub)
            .single()

        if (!error) streamer.value = data
        loading.value = false
    }

    // Créer le streamer
    const createStreamer = async (payload) => {
        const { data, error } = await supabase
            .from('Streamer')
            .insert({
                id: user.value.sub,
                username: payload.username,
                bio: payload.bio || '',
                avatarUrl: '',
                updatedAt: new Date(),
            })
            .select()
            .single()

        if (!error) streamer.value = data
        return { data, error }
    }

    // Mettre à jour
    const updateStreamer = async (payload) => {
        const { data, error } = await supabase
            .from('Streamer')
            .update({
                ...payload,
                updatedAt: new Date(),
            })
            .eq('id', user.value.sub)
            .select()
            .single()

        if (!error) streamer.value = data
        return { data, error }
    }

    onMounted(fetchStreamer)

    return {
        loading,
        streamer,
        fetchStreamer,
        createStreamer,
        updateStreamer,
    }
}
