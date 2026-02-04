import { normalizeHexColor, isValidHexColor } from '~/utils/colors'

type StyleKey = 'bgColor' | 'textColor'

export function useScheduleColor(scheduleStore: any, key: StyleKey,) {
    const storeValue = computed(
        () => scheduleStore.schedule?.style?.[key] || ''
    )

    const localValue = ref('')
    const lastValidValue = ref('')
    let timeout: number | null = null

    const isValid = computed(() =>
        isValidHexColor(normalizeHexColor(localValue.value))
    )

    // Sync store → local
    watch(
        storeValue,
        (newColor) => {
            const clean = normalizeHexColor(newColor)
            if (isValidHexColor(clean)) {
                lastValidValue.value = clean
                localValue.value = clean
            }
        },
        { immediate: true }
    )

    // Sync local → store (debounced)
    watch(localValue, (value) => {
        if (timeout) clearTimeout(timeout)

        const clean = normalizeHexColor(value)
        if (!isValidHexColor(clean)) return

        timeout = window.setTimeout(async () => {
            const { error } = await scheduleStore.updateSchedule({
                style: { [key]: clean }
            })

            if (error) {
                console.error(`Erreur update ${key} :`, error)
                // rollback visuel
                localValue.value = lastValidValue.value
            } else {
                // confirmation BDD
                lastValidValue.value = clean
            }
        }, 500)
    })

    // --- Handler blur générique ---
    const handleBlur = () => {
        if (!isValid.value) {
            localValue.value = lastValidValue.value
        }
    }

    // --- Force majuscules automatiquement ---
    watch(localValue, (val) => {
        if (val && val !== val.toUpperCase()) {
            localValue.value = val.toUpperCase()
        }
    })

    return {
        value: localValue,
        isValid,
        lastValidValue,
        handleBlur
    }
}
