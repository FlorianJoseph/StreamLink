/**
 * Transforme une URL Supabase Storage en URL optimisée via l'API render/image.
 * Les images sont redimensionnées et recompressées à la volée par Supabase.
 *
 * Tailles recommandées :
 *  - 32  → petite icône (liste, info bar)
 *  - 64  → carte, avatar médium
 *  - 128 → profil, modal
 */
export function avatarUrl(url: string | null | undefined, size: 32 | 64 | 128 = 64): string {
    const fallback = 'https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/Avatar/default.png'
    if (!url) return fallback
    // Uniquement les URLs Supabase Storage — les autres (Twitch, etc.) sont laissées intactes
    if (!url.includes('/storage/v1/object/public/')) return url
    return url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
        + `?width=${size}&height=${size}&quality=75&resize=cover`
}
