import { defineStore } from 'pinia'
import type { Streamer, StreamerUpdate } from '~/modules/streamer/streamer.type'
import { useStreamerRepository } from '~/modules/streamer/streamer.repository'

export const useStreamerStore = defineStore('streamer', () => {
    const { uid, safe, supabase } = useSupabase()
    const user = useSupabaseUser()
    const repo = useStreamerRepository()
    const loading = ref(true)
    const streamer = ref<Streamer | null>(null)
    const publicStreamer = ref<Streamer | null>(null)

    // Récupérer le streamer du user connecté
    const fetchStreamer = async () => {
        if (!uid.value) return { data: null, error: 'Aucun utilisateur connecté.' }

        loading.value = true
        try {
            const result = await safe(() => repo.fetchStreamer(uid.value))

            if (result.data) streamer.value = result.data
            return result
        }
        finally {
            loading.value = false
        }
    }

    // Récupère tous les streamers pour la page découverte
    const fetchAllStreamers = async () => {

        const result = await safe(() => repo.fetchAllStreamers())
        if (result.data) return result.data
    }

    // Récupérer un streamer pour la page publique
    const fetchStreamerByUsername = async (username: string) => {
        if (!username) return { data: null, error: 'Username manquant' }

        const result = await safe(() => repo.fetchStreamerPublic(username))
        if (result.data) publicStreamer.value = result.data
        return result.data
    }

    // Créer un streamer
    const createStreamer = async () => {
        const existingStreamer = await fetchStreamer()

        // S’il existe déjà, on le retourne
        if (existingStreamer?.data) {
            streamer.value = existingStreamer.data
            return existingStreamer
        }

        // Sinon, on le crée
        const result = await safe(() =>
            repo.createStreamer({
                id: uid.value,
                username: user.value!.user_metadata!.nickname,
                bio: '',
                avatar_url: '',
                updated_at: new Date().toISOString(),
            })
        )

        if (result.data) {
            streamer.value = result.data
        }

        return result
    }

    // Mettre à jour le streamer du user connecté
    const updateStreamer = async (payload: StreamerUpdate) => {

        const result = await safe(() => repo.updateStreamer(uid.value, { ...payload, updated_at: new Date().toISOString() }))

        if (result.data) streamer.value = result.data
        return result
    }

    // Supprimer le streameur et ses liens associés avec leurs vignettes + avatar
    const deleteStreamerWithLinks = async (streamerId: string) => {
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
            console.error('Erreur lors de la suppression :', (err as Error).message)
            return false
        }
    }

    return {
        loading,
        streamer,
        publicStreamer,
        fetchStreamer,
        fetchStreamerByUsername,
        fetchAllStreamers,
        createStreamer,
        updateStreamer,
        deleteStreamerWithLinks,
    }
})
