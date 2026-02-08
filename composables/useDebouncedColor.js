import { normalizeHexColor, isValidHexColor } from "@/utils/colors"

export const useDebouncedColor = (
    section,
    property,
    design,
    designStore,
    {
        delay = 1200,
        defaultValue = 'FFFFFF'
    } = {}
) => {
    const lastValidValue = ref(
        (design.value?.[section]?.[property] ?? defaultValue).toUpperCase()
    )

    const localValue = ref(lastValidValue.value)
    const isValid = computed(() => isValidHexColor(normalizeHexColor(localValue.value)))
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

        localValue.value = value.toUpperCase()
        timeout = setTimeout(() => {
            const clean = normalizeHexColor(value)?.toUpperCase()
            if (!isValidHexColor(clean)) return

            designStore.updateSection(section, {
                [property]: clean,
            })
        }, delay)
    })

    // Validation de la valeur locale
    const validateValue = () => {
        const clean = normalizeHexColor(localValue.value)?.toUpperCase()
        localValue.value = isValidHexColor(clean)
            ? clean
            : (design.value?.[section]?.[property] ?? defaultValue).toUpperCase()
    }

    return {
        localValue,
        validateValue,
        isValid
    }
}

