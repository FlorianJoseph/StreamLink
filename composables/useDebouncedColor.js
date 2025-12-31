const normalizeHexColor = (val) => {
    if (!val) return ''
    let hex = val.replace('#', '').toUpperCase().slice(0, 6)
    // Si c'est un code sur 3 caractères, on le convertit en 6
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    return hex
}

const isValidHexColor = (val) =>
    /^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(val)

export function useDebouncedColor(
    section,
    property,
    design,
    designStore,
    {
        delay = 1200,
        defaultValue = 'FFFFFF',
        validate = isValidHexColor
    } = {}
) {
    const lastValidValue = ref(
        (design.value?.[section]?.[property] ?? defaultValue).toUpperCase()
    )

    const localValue = ref(lastValidValue.value)
    const isValid = computed(() => validate(normalizeHexColor(localValue.value)))
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
        if (!isValid.value) return

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
            : (design.value?.[section]?.[property] ?? defaultValue).toUpperCase()
    }

    return {
        localValue,
        validateValue,
        isValid
    }
}

