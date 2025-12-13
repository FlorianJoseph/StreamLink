import { defineStore } from 'pinia'

export const useDesignStore = defineStore('design', () => {
    const supabase = useSupabaseClient()

    const design = ref(null)

    const fetchDesign = async (streamerId) => {

        const { data, error } = await supabase
            .from('Design')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        design.value = data
    }

    const updateSection = (section, payload) => {
        if (!design.value) return

        design.value[section] = {
            ...design.value[section],
            ...payload,
        }
    }

    const saveDesign = async () => {
        if (!design.value) return

        const { id, ...fields } = design.value

        const { error } = await supabase
            .from('Design')
            .update({
                ...fields,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) throw error
    }

    return {
        design,
        fetchDesign,
        updateSection,
        saveDesign,
    }
})
