export type Result<T> = { data: T; error: null } | { data: null; error: string }

export const useSupabase = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    // Computed pour récupérer l'ID de l'utilisateur connecté
    const uid = computed(() => user.value?.sub ?? user.value?.id ?? null)

    // Wrapper générique pour Supabase avec gestion d'erreurs
    async function safe<T>(fn: () => Promise<T>): Promise<Result<T>> {
        try {
            return { data: await fn(), error: null }
        } catch (err: unknown) {
            console.error(err)
            return { data: null, error: err instanceof Error ? err.message : String(err) }
        }
    }

    return { supabase, safe, uid }
}
