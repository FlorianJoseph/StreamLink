export function useDesignActive(design) {
    const isActive = (section, key, value) => {
        return computed(() => {
            if (!design.value) return false
            return design.value?.[section]?.[key] === value
        })
    }

    return {
        isActive,
    }
}
