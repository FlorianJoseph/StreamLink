import { checkAdmin } from '~/server/utils/checkAdmin'

export default defineEventHandler(async (event) => {
    const client = await checkAdmin(event)

    // Récupération des statistiques depuis la table admin_stats
    try {
        const { data, error } = await client
            .from('admin_stats')
            .select('*')
            .order('generated_at', { ascending: false })
            .limit(1)
            .single()

        if (error) throw error

        return data
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: 'Erreur lors de la récupération des statistiques'
        })
    }
})