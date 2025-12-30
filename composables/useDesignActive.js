const shallowEqual = (a = {}, b = {}) => {
    const aKeys = Object.keys(a ?? {})
    const bKeys = Object.keys(b ?? {})

    if (aKeys.length !== bKeys.length) return false

    return aKeys.every(key => a[key] === b[key])
}

export function useDesignActive(design) {
    const isActive = (section, key, value) =>
        computed(() => design.value?.[section]?.[key] === value)


    const isThemeActive = (themePreset) =>
        computed(() => {
            if (!design.value) return false

            return (
                shallowEqual(
                    design.value.wallpaper_style,
                    themePreset.wallpaper_style
                ) &&
                shallowEqual(
                    design.value.button_style,
                    themePreset.button_style
                ) &&
                shallowEqual(
                    design.value.username_style,
                    themePreset.username_style
                ) &&
                shallowEqual(
                    design.value.bio_style,
                    themePreset.bio_style
                )
            )
        })

    return {
        isActive,
        isThemeActive,
    }
}