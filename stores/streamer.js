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

    const fetchAllStreamers = async () => {
        const { data, error } = await supabase
            .from('Streamer')
            .select('*')
            .order('created_at', { ascending: true })
        if (error) {
            console.error('Erreur lors de la récupération des streamers :', error)
            return []
        }
        return data
    }

    //Récupère un streamer à partir de son username (page publique)
    const fetchStreamerByUsername = async (username) => {
        if (!username) {
            streamer.value = null
            return null
        }

        const { data, error } = await supabase
            .from('Streamer')
            .select('*')
            .eq('username', username)
            .single()

        if (error) {
            console.error('Erreur lors de la récupération du streamer :', error)
            streamer.value = null
            return null
        }

        streamer.value = data
        return data
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

    const deleteStreamerWithLinks = async (streamerId) => {
        try {
            // Supprimer les liens associés
            const { error: linksError } = await supabase
                .from('Link')
                .delete()
                .eq('streamer_id', streamerId)

            if (linksError) throw linksError

            // Supprimer le streamer
            const { error: streamerError } = await supabase
                .from('Streamer')
                .delete()
                .eq('id', streamerId)

            if (streamerError) throw streamerError
            return true
        } catch (err) {
            console.error('Erreur lors de la suppression :', err.message)
            return false
        }
    }

    // Charger automatiquement à l’ouverture
    onMounted(fetchStreamer)

    return {
        // État
        loading,
        streamer,
        // Actions
        fetchStreamer,
        fetchStreamerByUsername,
        fetchAllStreamers,
        createStreamer,
        updateStreamer,
        deleteStreamerWithLinks,
    }
})
