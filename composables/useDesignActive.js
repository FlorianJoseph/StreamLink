const shallowEqual = (a = {}, b = {}) => {
    if (!a || !b) return false
    // Vérifier uniquement les clés du preset (b) dans le design (a)
    return Object.keys(b).every(key => a[key] === b[key])
}

export const useDesignActive = (design) => {
    const isActive = (section, key, value) =>
        computed(() => design.value?.[section]?.[key] === value)

    const isThemeActive = (themePreset) =>
        computed(() => {
            if (!design.value) return false

            return (
                shallowEqual(design.value.wallpaper_style, themePreset.wallpaper_style) &&
                shallowEqual(design.value.button_style, themePreset.button_style) &&
                shallowEqual(design.value.username_style, themePreset.username_style) &&
                shallowEqual(design.value.bio_style, themePreset.bio_style) &&
                design.value.font_family === themePreset.font_family
            )
        })

    return {
        isActive,
        isThemeActive,
    }
}