export function useDebouncedColor(
    section,
    property,
    design,
    designStore,
    {
        delay = 1200,
        defaultValue = 'ffffff', // valeur par défaut
    } = {}
) {
    const localValue = ref(
        design.value?.[section]?.[property] ?? defaultValue
    )

    let timeout = null

    // Sync store → local (undo / redo / reset)
    watch(
        () => design.value?.[section]?.[property],
        (val) => {
            localValue.value = val ?? defaultValue
        },
        { immediate: true }
    )

    // Commit avec debounce
    watch(localValue, (value) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            designStore.updateSection(section, {
                [property]: value.replace('#', ''),
            })
        }, delay)
    })

    return {
        localValue,
    }
}

