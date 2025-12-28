const normalizeHexColor = (val) =>
    val?.replace('#', '').slice(0, 6)

const isValidHexColor = (val) =>
    /^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(val)

export function useDebouncedColor(
    section,
    property,
    design,
    designStore,
    {
        delay = 1200,
        defaultValue = 'ffffff',
        validate = isValidHexColor
    } = {}
) {
    const localValue = ref(
        (design.value?.[section]?.[property] ?? defaultValue).toUpperCase()
    )

    let timeout = null

    // Sync depuis le store
    watch(
        () => design.value?.[section]?.[property],
        (val) => {
            localValue.value = (val ?? defaultValue).toUpperCase()
        },
        { immediate: true }
    )

    // Sync vers le store de la nouvelle valeur (debounced)
    watch(localValue, (value) => {
        clearTimeout(timeout)

        timeout = setTimeout(() => {
            const clean = normalizeHexColor(value)?.toUpperCase()
            if (!validate(clean)) return

            designStore.updateSection(section, {
                [property]: clean,
            })
        }, delay)
    })

    // Validation de la valeur locale
    const validateValue = () => {
        const clean = normalizeHexColor(localValue.value)?.toUpperCase()
        localValue.value = validate(clean)
            ? clean
            : defaultValue
    }

    return {
        localValue,
        validateValue,
        isValid: computed(() =>
            validate(normalizeHexColor(localValue.value))
        ),
    }
}

