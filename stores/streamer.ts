import { defineStore } from 'pinia'
import type { Streamer, StreamerUpdate } from '~/modules/streamer/streamer.type'
import { useStreamerRepository } from '~/modules/streamer/streamer.repository'

export const useStreamerStore = defineStore('streamer', () => {
    const { uid, safe, supabase } = useSupabase()
    const user = useSupabaseUser()
    const repo = useStreamerRepository()
    const loading = ref(true)
    const streamer = ref<Streamer | null>(null)

    // Récupérer le streamer du user connecté
    const fetchStreamer = async () => {
        if (!uid.value) return { data: null, error: 'Aucun utilisateur connecté.' }

        loading.value = true
        try {
            const result = await safe(() => repo.findByUserId(uid.value))

            if (result.data) streamer.value = result.data
            return result
        }
        finally {
            loading.value = false
        }
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
            repo.create({
                id: uid.value,
                username: user.value!.user_metadata!.nickname,
                bio: '',
                avatar_url: '',
                updated_at: new Date().toISOString(),
            })
        )

        if (result.data) {
            streamer.value = result.data

            // Envoyer un email de bienvenue
            if (!existingStreamer?.data) {
                $fetch('/api/admin/mail/welcome', {
                    method: 'POST',
                    body: {
                        email: user.value!.email,
                        username: user.value!.user_metadata!.nickname,
                    },
                }).catch(() => { })
            }
        }

        return result
    }

    // Mettre à jour le streamer du user connecté
    const updateStreamer = async (payload: StreamerUpdate) => {
        const result = await safe(() => repo.update(uid.value, { ...payload, updated_at: new Date().toISOString() }))

        if (result.data) streamer.value = result.data
        return result
    }

    return {
        loading,
        streamer,
        fetchStreamer,
        createStreamer,
        updateStreamer,
    }
})
