import { domToPng } from 'modern-screenshot'

export const useScheduleScreenshot = () => {
    const previewDataUrl = ref<string | null>(null)
    const showPreview = ref(false)

    const renderSchedule = async (scale?: number): Promise<string | null> => {
        const node = document.querySelector<HTMLElement>('#scheduleCard')
        if (!node) return null

        return domToPng(node, {
            scale,
            onCloneEachNode: (cloned) => {
                if (!(cloned instanceof HTMLElement)) return

                if (cloned.classList.contains('ignore-export')) {
                    cloned.style.display = 'none'
                }

                // le contenu prend toute la place
                if (cloned.classList.contains('export-day-column-content')) {
                    cloned.style.gridRow = '1 / -1'
                    cloned.style.height = '100%'
                }
            },
        })
    }

    const previewSchedule = async () => {
        previewDataUrl.value = await renderSchedule(3)
        showPreview.value = true
    }

    const exportSchedule = async () => {
        const dataUrl = await renderSchedule(3)
        if (!dataUrl) return

        const link = document.createElement('a')
        link.download = 'planning.png'
        link.href = dataUrl
        link.click()
    }

    return {
        previewDataUrl,
        showPreview,
        renderSchedule,
        previewSchedule,
        exportSchedule,
    }
}