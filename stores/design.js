import { defineStore } from 'pinia'

export const useDesignStore = defineStore('design', () => {
    const supabase = useSupabaseClient()

    const design = ref(null)
    const savedDesign = ref(null)

    const history = ref([])
    const future = ref([])

    // Récupérer le design pour un streamer donné
    const fetchDesign = async (streamerId) => {
        const { data, error } = await supabase
            .from('Design')
            .select('*')
            .eq('streamer_id', streamerId)
            .maybeSingle()

        if (error) throw error

        if (data) {
            // Design existant
            design.value = structuredClone(data)
            savedDesign.value = structuredClone(data)
        } else {
            // Pas de design existant : on crée un design par défaut
            const defaultDesign = {
                streamer_id: streamerId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            // Insérer le design par défaut dans la base de données
            const { data: newData, error: insertError } = await supabase
                .from('Design')
                .insert(defaultDesign)
                .select()
                .single()

            if (insertError) throw insertError

            // Mettre à jour le store avec le nouveau design
            design.value = structuredClone(newData)
            savedDesign.value = structuredClone(newData)
        }

        // Reset undo/redo
        history.value = []
        future.value = []
    }

    // Mettre à jour une section du design avec gestion de l'historique
    const updateSection = (section, payload) => {
        if (!design.value) return

        const newSection = { ...design.value[section], ...payload }
        // Si c'est identique à l'existant, on ne fait rien
        if (JSON.stringify(design.value[section]) === JSON.stringify(newSection)) return

        // sauvegarder l'état actuel dans l'historique avant de faire la mise à jour
        history.value.push(
            structuredClone(toRaw(design.value))
        )
        future.value = []

        // Mettre à jour la section
        design.value[section] = {
            ...design.value[section],
            ...payload,
        }
    }

    // Undo / Redo
    const undo = () => {
        if (!history.value.length) return

        future.value.push(
            structuredClone(toRaw(design.value))
        )
        design.value = history.value.pop()
    }

    const redo = () => {
        if (!future.value.length) return

        history.value.push(
            structuredClone(toRaw(design.value))
        )
        design.value = future.value.pop()
    }

    // Appliquer un thème prédéfini
    const applyTheme = (theme) => {
        if (!design.value || !theme) return

        // Sauvegarder l'état actuel UNE SEULE FOIS
        history.value.push(structuredClone(toRaw(design.value)))
        future.value = []

        // Appliquer le thème
        if (theme.wallpaper_style) {
            design.value.wallpaper_style = {
                ...design.value.wallpaper_style,
                ...theme.wallpaper_style,
            }
        }

        if (theme.button_style) {
            design.value.button_style = {
                ...design.value.button_style,
                ...theme.button_style,
            }
        }

        if (theme.username_style) {
            design.value.username_style = {
                ...design.value.username_style,
                ...theme.username_style,
            }
        }
        if (theme.bio_style) {
            design.value.bio_style = {
                ...design.value.bio_style,
                ...theme.bio_style,
            }
        }
    }

    // Sauvegarder le design actuel dans la base de données
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

        savedDesign.value = structuredClone(toRaw(design.value))
        history.value = []
        future.value = []
    }

    // Réinitialiser le design à la dernière version sauvegardée
    const resetDesign = () => {
        if (!savedDesign.value) return
        design.value = structuredClone(toRaw(savedDesign.value))
        history.value = []
        future.value = []
    }

    // Indicateur de modifications non sauvegardées
    const isDirty = computed(() =>
        JSON.stringify(design.value) !== JSON.stringify(savedDesign.value)
    )

    return {
        design,
        fetchDesign,
        updateSection,
        applyTheme,
        saveDesign,
        resetDesign,
        undo,
        redo,
        isDirty,
        history,
        future,
    }
})
