export function useDebouncedColor(
    section,
    design,
    designStore,
    delay = 1200
) {
    const colorLocal = ref(`${design.value?.[section]?.color ?? 'ffffff'}`)
    let timeout = null

    // Sync store → local
    watch(
        () => design.value?.[section]?.color,
        (color) => {
            if (color) {
                colorLocal.value = `${color}`
            }
        },
        { immediate: true }
    )

    // Commit avec debounce
    watch(colorLocal, (value) => {
        clearTimeout(timeout)

        timeout = setTimeout(() => {
            designStore.updateSection(section, {
                color: value.replace('#', ''),
            })
        }, delay)
    })

    return {
        colorLocal,
    }
}
