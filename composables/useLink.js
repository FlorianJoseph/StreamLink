export const useLink = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const links = ref([])

    const fetchLinks = async () => {
        if (!user.value) return
        const { data, error } = await supabase
            .from('Link')
            .select('*')
            .eq('streamer_id', user.value.sub)
            .order('created_at', { ascending: true })
        if (!error) links.value = data
    }

    const addLink = async (payload) => {
        if (!user.value) return

        const { data, error } = await supabase
            .from('Link')
            .insert({
                id: crypto.randomUUID(),
                ...payload,
                streamer_id: user.value.sub,
                created_at: new Date(),
                updated_at: new Date()
            })
            .select()
            .single()
        if (!error) links.value.push(data)

        return { data, error }
    }

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

    const deleteLink = async (id) => {
        const { error } = await supabase.from('Link').delete().eq('id', id)
        if (!error) links.value = links.value.filter((l) => l.id !== id)
        return { error }
    }

    onMounted(fetchLinks)

    return { links, fetchLinks, addLink, updateLink, deleteLink }
}
