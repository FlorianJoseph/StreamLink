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
            .maybeSingle()

        loading.value = false
        if (data) streamer.value = data
        return { data, error }
    }

    //Récupère tous les streamers
    const fetchAllStreamers = async () => {
        const { data, error } = await supabase
            .from('streamer_visible')
            .select(`
            *,
            Schedule (
                id,
                ScheduleSlot (
                    id,
                    game,
                    day,
                    start_at
                )
            )
        `)
            .order('created_at', { ascending: true })
        if (error) {
            console.error('Erreur lors de la récupération des streamers :', error)
            return []
        }
        return data
    }

    // Récupère un streamer à partir de son username (page publique)
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

    // Récupère le nombre total de streamers (pour stats)
    const fetchTotalStreamers = async () => {
        const { count, error } = await supabase
            .from('streamer_visible')
            .select('*', { count: 'exact', head: true }) // head: true = pas de données, juste le count

        if (error) {
            console.error('Erreur lors du comptage des streamers :', error)
            return 0
        }

        return count
    }

    // Créer un streamer
    const createStreamer = async () => {

        // Vérifie si le streamer existe déjà
        const { data, error } = await fetchStreamer()

        if (error) throw error

        if (data) return data

        // Création si pas trouvé
        const { data: newStreamer, error: insertError } = await supabase
            .from('Streamer')
            .insert({
                id: user.value.sub,
                username: user.value?.user_metadata.nickname,
                bio: '',
                avatar_url: '',
                updated_at: new Date(),
            })
            .select()
            .single()

        if (!insertError) streamer.value = newStreamer
        return { newStreamer, insertError }
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

    // Supprimer le streameur et ses liens associés avec leurs vignettes + avatar
    const deleteStreamerWithLinks = async (streamerId) => {
        try {

            // Sélectionner les liens + leurs vignettes
            const { data: links, error: linksFetchError } = await supabase
                .from('Link')
                .select('id, icon_url')
                .eq('streamer_id', streamerId)

            if (linksFetchError) throw linksFetchError

            // Supprimer les vignettes associées
            const vignettePaths = links
                .map(link => link.icon_url?.split('/Vignette/')[1])
                .filter(Boolean)

            if (vignettePaths.length > 0) {
                await supabase.storage.from('Streamlink').remove(
                    vignettePaths.map(path => `Vignette/${path}`)
                )
            }

            // Supprimer les liens associés
            const { error: linksError } = await supabase
                .from('Link')
                .delete()
                .eq('streamer_id', streamerId)

            if (linksError) throw linksError

            // Récupérer le streamer avant suppression
            const { data: streamer, error: streamerFetchError } = await supabase
                .from('Streamer')
                .select('avatar_url')
                .eq('id', streamerId)
                .single()

            if (streamerFetchError) throw streamerFetchError

            // Supprimer l’avatar s’il existe
            if (streamer?.avatar_url) {
                const oldAvatarPath = streamer.avatar_url.split('/Avatar/')[1]
                if (oldAvatarPath) {
                    await supabase.storage.from('Streamlink').remove([`Avatar/${oldAvatarPath}`])
                }
            }

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

    return {
        // État
        loading,
        streamer,
        // Actions
        fetchStreamer,
        fetchStreamerByUsername,
        fetchAllStreamers,
        fetchTotalStreamers,
        createStreamer,
        updateStreamer,
        deleteStreamerWithLinks,
    }
})
