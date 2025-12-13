import { defineStore } from 'pinia'

export const useDesignStore = defineStore('design', () => {
    const supabase = useSupabaseClient()

    const design = ref(null)
    const savedDesign = ref(null)

    const history = ref([])
    const future = ref([])

    const fetchDesign = async (streamerId) => {

        const { data, error } = await supabase
            .from('Design')
            .select('*')
            .eq('streamer_id', streamerId)
            .single()

        if (error) throw error

        if (data) {
            // Design existant
            design.value = structuredClone(data)
            savedDesign.value = structuredClone(data)
        } else {
            // Pas de design existant : on crée un design par défaut
            const { data: newData, error: insertError } = await supabase
                .from('Design')
                .insert({
                    streamer_id: streamerId,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single()

            if (insertError) throw insertError

            design.value = structuredClone(newData)
            savedDesign.value = structuredClone(newData)
        }
        history.value = []
        future.value = []
    }

    const updateSection = (section, payload) => {
        if (!design.value) return

        // sauvegarder l'état actuel dans l'historique avant de faire la mise à jour
        history.value.push(structuredClone(design.value))
        future.value = []

        design.value[section] = {
            ...design.value[section],
            ...payload,
        }
    }

    const undo = () => {
        if (!history.value.length) return

        future.value.push(structuredClone(design.value))
        design.value = history.value.pop()
    }

    const redo = () => {
        if (!future.value.length) return

        history.value.push(structuredClone(design.value))
        design.value = future.value.pop()
    }

    const saveDesign = async () => {
        if (!design.value) return

        const { id, created_at, ...fields } = design.value

        const { error } = await supabase
            .from('Design')
            .update({
                ...fields,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) throw error

        savedDesign.value = structuredClone(design.value)
        history.value = []
        future.value = []
    }

    const isDirty = computed(() =>
        JSON.stringify(design.value) !== JSON.stringify(savedDesign.value)
    )

    return {
        design,
        fetchDesign,
        updateSection,
        saveDesign,
        undo,
        redo,
        isDirty,
        history,
        future,
    }
})
