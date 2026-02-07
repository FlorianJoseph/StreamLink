import { domToPng } from 'modern-screenshot'
const BASE_WIDTH = 1280
const BASE_HEIGHT = 720

export const useScheduleScreenshot = () => {
    const previewDataUrl = ref<string | null>(null)
    const showPreview = ref(false)

    const renderSchedule = async (scale?: number): Promise<string | null> => {
        const node = document.querySelector<HTMLElement>('#scheduleCard')
        if (!node) return null
        let footerInjected = false

        return domToPng(node, {
            scale,
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
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

                // Version avec gradient et icône
                if (cloned.classList.contains('export-footer') && !footerInjected) {
                    footerInjected = true

                    const wrapper = document.createElement('div')
                    wrapper.style.position = 'absolute'
                    wrapper.style.bottom = '12px'
                    wrapper.style.right = '16px'
                    wrapper.style.zIndex = '20'
                    wrapper.style.pointerEvents = 'none'

                    const box = document.createElement('div')
                    box.style.background = '#1F2428'
                    box.style.border = '1px solid #2F3437'
                    box.style.borderRadius = '6px'
                    box.style.padding = '5px 16px'
                    box.style.display = 'flex'
                    box.style.alignItems = 'center'

                    // Texte
                    const text = document.createElement('span')
                    text.textContent = 'StreamLink'
                    text.style.fontSize = '14px'
                    text.style.fontWeight = '700'
                    text.style.color = '#ffffff'
                    text.style.fontFamily = 'Inter, sans-serif'

                    box.appendChild(text)
                    wrapper.appendChild(box)
                    cloned.appendChild(wrapper)
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