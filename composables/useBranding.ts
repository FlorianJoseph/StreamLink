export const useBranding = () => {
    const { isSub, hasFeature, featuresReady } = useFeatures()
    const designStore = useDesignStore()
    const { design } = storeToRefs(designStore)

    const brandingToggle = computed(() => {
        if (!isSub.value && !hasFeature('no_branding')) return false
        return !(design.value?.show_branding ?? true)
    })

    const noBranding = computed(() =>
        (isSub.value || hasFeature('no_branding')) && design.value?.show_branding === false
    )

    const onToggleBranding = (openModal: () => void) => {
        if (!isSub.value && !hasFeature('no_branding')) {
            openModal()
            return
        }
        designStore.updateShowBranding(!(design.value?.show_branding ?? true))
    }

    // Watch expiration
    watch(
        [() => featuresReady.value, () => design.value?.id],
        async ([ready]) => {
            if (!ready || !design.value) return
            if (!isSub.value && !hasFeature('no_branding') && design.value?.show_branding === false) {
                await designStore.updateShowBranding(true)
            }
        },
        { immediate: true }
    )

    return { brandingToggle, noBranding, onToggleBranding }
}