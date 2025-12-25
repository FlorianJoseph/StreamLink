export function useDebouncedColor(
    section,
    design,
    designStore,
    {
        delay = 1200,
        defaultColor = 'ffffff',
    } = {}
) {
    const colorLocal = ref(
        design.value?.[section]?.textColor ?? defaultColor
    )

    let timeout = null

    // Sync store → local
    watch(
        () => design.value?.[section]?.textColor,
        (textColor) => {
            colorLocal.value = textColor ?? defaultColor
        },
        { immediate: true }
    )

    // Commit avec debounce
    watch(colorLocal, (value) => {
        clearTimeout(timeout)

        timeout = setTimeout(() => {
            designStore.updateSection(section, {
                textColor: value.replace('#', ''),
            })
        }, delay)
    })

    return {
        colorLocal,
    }
}
