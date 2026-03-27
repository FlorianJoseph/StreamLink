// server/api/account/delete.delete.ts
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const supabase = serverSupabaseServiceRole(event)

    // Récupérer les liens + vignettes
    const { data: links } = await supabase
        .from('Link')
        .select('icon_url')
        .eq('user_id', user.sub)

    // Supprimer les vignettes
    const vignettePaths = links
        ?.map(l => l.icon_url?.split('/Vignette/')[1])
        .filter(Boolean) ?? []

    if (vignettePaths.length > 0) {
        await supabase.storage.from('Streamlink').remove(
            vignettePaths.map(p => `Vignette/${p}`)
        )
    }

    // Récupérer l'avatar
    const { data: streamer } = await supabase
        .from('Streamer')
        .select('avatar_url')
        .eq('id', user.sub)
        .single()

    if (streamer?.avatar_url) {
        const avatarPath = streamer.avatar_url.split('/Avatar/')[1]
        if (avatarPath) {
            await supabase.storage.from('Streamlink').remove([`Avatar/${avatarPath}`])
        }
    }

    // Supprimer dans l'ordre
    await supabase.from('Subscriptions').delete().eq('user_id', user.sub)
    await supabase.from('Streamer').delete().eq('id', user.sub)

    return { success: true }
})