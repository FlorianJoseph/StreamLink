import { defineStore } from 'pinia'

export const useStreamerStore = defineStore('streamer', () => {
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

    // Créer un streamer
    const createStreamer = async (payload) => {
        const { data, error } = await supabase
            .from('Streamer')
            .insert({
                id: user.value.sub,
                username: payload.username,
                bio: '',
                avatar_url: '',
                updated_at: new Date(),
            })
            .select()
            .single()

        if (!error) streamer.value = data
        return { data, error }
    }

    // Mettre à jour le streamer
    const updateStreamer = async (payload) => {
        const { data, error } = await supabase
            .from('Streamer')
            .update({
                ...payload,
                updated_at: new Date(),
            })
            .eq('id', user.value.sub)
            .select()
            .single()

        if (!error) streamer.value = data
        return { data, error }
    }

    // Charger automatiquement à l’ouverture
    onMounted(fetchStreamer)

    return {
        // État
        loading,
        streamer,
        // Actions
        fetchStreamer,
        createStreamer,
        updateStreamer
    }
})
