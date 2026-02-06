import { normalizeHexColor, isValidHexColor } from '~/utils/colors'
import type { Tables } from '~/types/database.types'

type Schedule = Tables<'Schedule'>
type StyleKey = keyof Tables<'Schedule'>['style']

export const useScheduleColor = (scheduleStore: Schedule, key: StyleKey,) => {
    const storeValue = computed(
        () => scheduleStore.schedule?.style?.[key] || ''
    )
    const lastValidValue = ref(storeValue.value.toUpperCase())

    const localValue = ref(lastValidValue.value)
    const isValid = computed(() =>
        isValidHexColor(normalizeHexColor(localValue.value))
    )
    let timeout: any = null


    // Sync depuis le store
    watch(
        () => storeValue.value,
        (newColor) => {
            localValue.value = (newColor ?? '').toUpperCase()
        },
        { immediate: true }
    )

    // Sync vers le store de la nouvelle valeur (debounced)
    watch(localValue, (value) => {
        if (timeout) clearTimeout(timeout)
        if (!isValid.value) return

        localValue.value = value.toUpperCase()
        timeout = setTimeout(() => {
            const clean = normalizeHexColor(value)?.toUpperCase()
            if (!isValidHexColor(clean)) return

            scheduleStore.updateSchedule({
                style: { [key]: clean }
            })
        }, 1200)
    })

    // Validation de la valeur locale
    const validateValue = () => {
        const clean = normalizeHexColor(localValue.value)?.toUpperCase()
        localValue.value = isValidHexColor(clean)
            ? clean
            : (storeValue.value ?? '').toUpperCase()
    }

    return {
        localValue,
        isValid,
        validateValue
    }
}
