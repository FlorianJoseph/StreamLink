export function useDebouncedColor(
    section,
    property,
    design,
    designStore,
    {
        delay = 1200,
        defaultValue = 'ffffff',
    } = {}
) {
    const localValue = ref(
        design.value?.[section]?.[property] ?? defaultValue
    )

    let timeout = null

    watch(
        () => design.value?.[section]?.[property],
        (val) => {
            localValue.value = val ?? defaultValue
        },
        { immediate: true }
    )

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

