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

                if (cloned.classList.contains('export-footer') && !footerInjected) {
                    footerInjected = true

                    const wrapper = document.createElement('div')
                    wrapper.style.position = 'absolute'
                    wrapper.style.bottom = '18px'
                    wrapper.style.right = '22px'
                    wrapper.style.zIndex = '20'
                    wrapper.style.pointerEvents = 'none'
                    wrapper.style.userSelect = 'none'

                    const container = document.createElement('div')
                    container.style.textAlign = 'right'
                    container.style.lineHeight = '1.1'
                    container.style.fontFamily = 'Inter, sans-serif'

                    // Made with
                    const madeWith = document.createElement('div')
                    madeWith.textContent = 'Made with'
                    madeWith.style.fontSize = '10px'
                    madeWith.style.fontWeight = '400'
                    madeWith.style.textTransform = 'uppercase'
                    madeWith.style.letterSpacing = '0.12em'
                    madeWith.style.textShadow = '0 1px 3px #000000'

                    // StreamLink
                    const brand = document.createElement('div')
                    brand.textContent = 'StreamLink'
                    brand.style.fontSize = '12px'
                    brand.style.letterSpacing = '0.04em'
                    brand.style.fontWeight = '600'
                    brand.style.textTransform = 'uppercase'
                    brand.style.textShadow = '0 1px 3px #000000'

                    container.appendChild(madeWith)
                    container.appendChild(brand)
                    wrapper.appendChild(container)
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