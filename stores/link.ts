import { defineStore } from 'pinia'
import type { Link, LinkInsert, LinkUpdate } from '~/modules/link/link.type'
import { useLinkRepository } from '~/modules/link/link.repository'

export const useLinkStore = defineStore('link', () => {
    const { uid, safe } = useSupabase()
    const repo = useLinkRepository()
    const links = ref<Link[]>([])
    const publicLinks = ref<Link[]>([])

    // Récupérer tous les liens du streamer connecté
    const fetchLinks = async () => {
        if (!uid.value) return

        const result = await safe(() => repo.fetchByUserId(uid.value))
        if (result.data) links.value = result.data
        return result
    }

    // Récupérer les liens d'un streamer pour la page publique
    const fetchLinksByStreamerId = async (streamerId: string) => {
        if (!streamerId) return

        const result = await safe(() => repo.fetchLinkPublic(streamerId))
        if (result.data) publicLinks.value = result.data
        return result
    }

    // Ajouter un lien
    const addLink = async (payload: LinkInsert) => {
        if (!uid.value) return

        const result = await safe(() => repo.create({
            id: crypto.randomUUID(),
            ...payload,
            streamer_id: uid.value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }))

        if (result.data) links.value.push(result.data)
        return result
    }

    // Modifier un lien
    const updateLink = async (linkId: string, payload: LinkUpdate) => {
        const result = await safe(() => repo.update(linkId, { ...payload, updated_at: new Date().toISOString() }))

        if (result.data) {
            const index = links.value.findIndex((l) => l.id === linkId)
            if (index !== -1) links.value[index] = { ...links.value[index], ...result.data }
        }
        return result
    }

    // Supprimer un lien
    const deleteLink = async (id: string) => {
        const result = await safe(() => repo.remove(id))

        if (!result.error) links.value = links.value.filter((l) => l.id !== id)
        return result
    }

    // Mettre à jour la visibilité d’un lien
    const toggleVisibility = async (linkId: string, visible: boolean) => {
        const result = await safe(() => repo.updateVisibility(linkId, visible))

        if (!result.error) {
            const index = links.value.findIndex(l => l.id === linkId)
            if (index !== -1) links.value[index]!.visible = visible
        }
    }

    // Mettre à jour l’ordre (drag & drop)
    const updateOrder = async (newLinks: Link[]) => {
        const ordered = newLinks.map((link, index) => ({ ...link, order: index + 1 }))
        const result = await safe(() => repo.updateOrder(ordered))

        if (!result.error) {
            links.value = links.value.map(l => {
                const updated = ordered.find(o => o.id === l.id)
                return updated ? { ...l, order: updated.order } : l
            })
        }
        return result
    }

    return {
        links,
        publicLinks,
        fetchLinks,
        addLink,
        updateLink,
        deleteLink,
        updateOrder,
        toggleVisibility,
        fetchLinksByStreamerId,
    }
})
