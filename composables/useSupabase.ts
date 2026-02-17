export type Result<T> = { data: T | null; error: string | null }

export const useSupabase = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    // Computed pour récupérer l'ID de l'utilisateur connecté
    const uid = computed(() => user.value?.sub ?? user.value?.id ?? null)

    // Wrapper générique pour Supabase avec gestion d'erreurs
    async function safe<T>(fn: () => Promise<{ data: T | null; error: any }>): Promise<Result<T>> {
        try {
            const { data, error } = await fn()
            if (error) throw error
            return { data, error: null }
        } catch (err: any) {
            console.error(err)
            return { data: null, error: err.message ?? String(err) }
        }
    }

    return { supabase, safe, uid }
}
