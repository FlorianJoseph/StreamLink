import { defineStore } from 'pinia'
import type { Design, DesignUpdate } from '~/modules/design/design.type'
import { useDesignRepository } from '~/modules/design/design.repository'

export const useDesignStore = defineStore('design', () => {
    const { uid, safe } = useSupabase()
    const repo = useDesignRepository()
    const design = ref<Design | null>(null)
    const publicDesign = ref<Design | null>(null)
    const savedDesign = ref<Design | null>(null)
    const history = ref<Design[]>([])
    const future = ref<Design[]>([])
    const toast = useToast()

    // Récupérer le design du user connecté
    const fetchDesign = async () => {
        const result = await safe(() => repo.findByUserId(uid.value))

        if (result.data) {
            design.value = structuredClone(result.data)
            savedDesign.value = structuredClone(result.data)
        } else {
            await createDesign()
        }

        history.value = []
        future.value = []
    }

    const { wallpaper_style, button_style, username_style, bio_style } = THEME_PRESETS.dark

    // Créer un design par défaut pour un nouveau streamer
    const createDesign = async () => {
        const result = await safe(() => repo.create({
            user_id: uid.value,
            wallpaper_style,
            button_style,
            username_style,
            bio_style,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }))

        if (result.data) {
            design.value = structuredClone(result.data)
            savedDesign.value = structuredClone(result.data)
        }
        return result
    }

    // Récupérer le design d'un utilisateur pour la page publique
    const fetchPublicDesign = async (userId: string) => {
        const result = await safe(() => repo.findByUserId(userId))

        if (result.data) {
            publicDesign.value = result.data
        }
        return result
    }

    // Mettre à jour une section du design avec gestion de l'historique
    const updateSection = <K extends keyof Design>(section: K, payload: Partial<Design[K]>) => {
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
        design.value[section] = newSection
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
    const applyTheme = (theme: DesignUpdate) => {
        if (!design.value || !theme) return

        // Sauvegarder l'état actuel UNE SEULE FOIS
        history.value.push(structuredClone(toRaw(design.value)))
        future.value = []

        const sections: (keyof Design)[] = [
            'wallpaper_style',
            'button_style',
            'username_style',
            'bio_style'
        ]

        // Appliquer toutes les sections dynamiquement
        sections.forEach(section => {
            if (theme[section]) {
                design.value[section] = {
                    ...design.value[section],
                    ...theme[section],
                }
            }
        })
    }

    // Sauvegarder le design actuel dans la base de données
    const saveDesign = async () => {
        if (!design.value) return

        const { id, created_at, ...fields } = design.value

        await repo.update(id, {
            ...fields,
            updated_at: new Date().toISOString(),
        })

        savedDesign.value = structuredClone(toRaw(design.value))
        history.value = []
        future.value = []
        toast.add({
            severity: 'success',
            summary: 'Design sauvegardé',
            detail: 'Vos modifications ont été sauvegardées',
            life: 4000,
        })
    }

    // Réinitialiser le design à la dernière version sauvegardée
    const resetDesign = () => {
        if (!savedDesign.value) return
        design.value = structuredClone(toRaw(savedDesign.value))
        history.value = []
        future.value = []
        toast.add({
            severity: 'info',
            summary: 'Design réinitialisé',
            detail: 'Le design a été restauré à la dernière version sauvegardée',
            life: 4000,
        })
    }

    // Indicateur de modifications non sauvegardées
    const isDirty = computed(() =>
        design.value && savedDesign.value
            ? JSON.stringify(design.value) !== JSON.stringify(savedDesign.value)
            : false
    )

    return {
        design,
        publicDesign,
        fetchDesign,
        fetchPublicDesign,
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
