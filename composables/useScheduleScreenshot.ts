import { domToPng } from 'modern-screenshot'

export const useScheduleScreenshot = () => {
    const previewDataUrl = ref<string | null>(null)
    const showPreview = ref(false)

    const renderSchedule = async (scale?: number): Promise<string | null> => {
        const node = document.querySelector<HTMLElement>('#scheduleCard')
        if (!node) return null
        let footerInjected = false

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

                // Gérer les jours off
                if (cloned.classList.contains('day-slot-empty')) {
                    // remplace le contenu par exemple par "Jour off"
                    cloned.innerHTML = `
      <div style="
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        height:100%;
        color:#a1a1aa;
        font-size:1.5rem;
        gap:4px;
        font-weight:800;
      ">
        <span>OFF</span>
      </div>
    `}

                // Injecter le footer même s'il n'existe plus
                if (
                    cloned.classList.contains('export-footer') &&
                    !footerInjected
                ) {
                    footerInjected = true

                    const footer = document.createElement('div')
                    footer.textContent = 'Fait avec StreamLink'
                    footer.style.position = 'absolute'
                    footer.style.bottom = '14px'
                    footer.style.right = '12px'
                    footer.style.fontSize = '1.12rem'
                    footer.style.opacity = '0.6'
                    footer.style.pointerEvents = 'none'
                    footer.style.userSelect = 'none'

                    const bold = document.createElement('span')
                    bold.textContent = 'StreamLink'
                    bold.style.fontWeight = '600'

                    footer.innerHTML = 'Fait avec '
                    footer.appendChild(bold)

                    cloned.appendChild(footer)
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