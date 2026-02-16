import { defineStore } from 'pinia'

export const useLinkStore = defineStore('link', () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const links = ref([])

    /** Récupérer tous les liens du streamer connecté */
    const fetchLinks = async () => {
        if (!user.value) return
        const { data, error } = await supabase
            .from('Link')
            .select('*')
            .eq('streamer_id', user.value.sub)
            .order('order', { ascending: true })

        if (!error) links.value = data
    }

    /** Récupérer tous les liens d'un streamer */
    const fetchLinksByStreamerId = async (streamerId) => {
        if (!streamerId) return

        const { data, error } = await supabase
            .from('Link')
            .select('*')
            .eq('streamer_id', streamerId)
            .order('order', { ascending: true })

        if (!error) links.value = data
        else links.value = []
    }

    // Permet de récupérer le nombre total de liens (pour stats)
    const fetchTotalLinks = async () => {
        const { count, error } = await supabase
            .from('Link')
            .select('*', { count: 'exact', head: true }) // head: true = pas besoin des données, juste le count

        if (!error) {
            return count
        } else {
            console.error(error)
            return 0
        }
    }

    /** Ajouter un lien */
    const addLink = async (payload) => {
        if (!user.value) return

        const { data, error } = await supabase
            .from('Link')
            .insert({
                id: crypto.randomUUID(),
                ...payload,
                streamer_id: user.value.sub,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .select()
            .single()

        if (!error) links.value.push(data)
        return { data, error }
    }

    /** Modifier un lien */
    const updateLink = async (id, payload) => {
        const { data, error } = await supabase
            .from('Link')
            .update({ ...payload, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single()

        if (!error) {
            const index = links.value.findIndex((l) => l.id === id)
            if (index !== -1) Object.assign(links.value[index], data)
        }

        return { data, error }
    }

    /** Supprimer un lien */
    const deleteLink = async (id) => {
        const { error } = await supabase.from('Link').delete().eq('id', id)
        if (!error) links.value = links.value.filter((l) => l.id !== id)
        return { error }
    }

    const toggleVisibility = async (linkId, visible) => {
        const { error } = await supabase
            .from('Link')
            .update({ visible })
            .eq('id', linkId)

        if (error) console.error('Erreur update visible:', error)

        // Met à jour le front localement
        const index = links.value.findIndex(l => l.id === linkId)
        if (index !== -1) links.value[index].visible = visible
    }

    /**  Mettre à jour l’ordre (drag & drop) */
    const updateOrder = async (newLinks) => {
        newLinks.forEach((link, index) => (link.order = index + 1))

        try {
            for (const link of newLinks) {
                const { error } = await supabase
                    .from('Link')
                    .update({ order: link.order })
                    .eq('id', link.id)

                if (error) console.error('Erreur lors de la mise à jour de', link.id, error)
            }

            links.value = [...newLinks]
        } catch (err) {
            console.error('Erreur lors de la mise à jour des ordres :', err)
        }
    }

    return {
        links,
        fetchLinks,
        fetchTotalLinks,
        addLink,
        updateLink,
        deleteLink,
        updateOrder,
        toggleVisibility,
        fetchLinksByStreamerId
    }
})
