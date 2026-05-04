import { domToPng } from 'modern-screenshot'
const BASE_WIDTH = 1280
const BASE_HEIGHT = 720
const isExporting = ref(false)
const isPreviewing = ref(false)

const loadFontForExport = async (fontFamily: string): Promise<string> => {
    return await $fetch<string>(`/api/fonts/${fontFamily.replace(/ /g, '+')}`)
}

export const useScheduleScreenshot = () => {
    const previewDataUrl = ref<string | null>(null)
    const showPreview = ref(false)

    const renderSchedule = async (scale?: number, fontFamily?: string, showBranding?: boolean): Promise<string | null> => {
        const node = document.querySelector<HTMLElement>('#scheduleCard')
        if (!node) return null
        let footerInjected = false
        const fontCssText = fontFamily ? await loadFontForExport(fontFamily) : undefined

        return domToPng(node, {
            scale,
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            font: fontCssText ? { cssText: fontCssText } : undefined,
            onCloneEachNode: (cloned) => {
                if (!(cloned instanceof HTMLElement)) return

                if (cloned.classList.contains('ignore-export')) {
                    cloned.style.display = 'none'
                }

                // le contenu prend toute la place
                if (cloned.classList.contains('export-day-column-content')) {
                    cloned.style.gridRow = '1 / -1'
                    cloned.style.height = '100%'
                    const slots = Array.from(cloned.querySelectorAll('.day-slot')) as HTMLElement[]
                    if (slots.length) {
                        const wrapper = document.createElement('div')
                        wrapper.style.display = 'flex'
                        wrapper.style.flexDirection = 'column'
                        wrapper.style.height = '100%'
                        wrapper.style.gap = '0.25rem'

                        slots.forEach(slot => {
                            // Slot fixed unique de l'après-midi
                            const hour = parseInt(slot.dataset.startHour!)
                            const isAfternoon = hour >= 12
                            const samePeriod = slots.filter(s => parseInt(s.dataset.startHour!) >= 12)

                            if (slot.dataset.size === 'fixed' && isAfternoon && samePeriod.length === 1) {
                                slot.style.marginTop = 'auto'
                            }

                            wrapper.appendChild(slot)
                        })

                        cloned.appendChild(wrapper)
                    }
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
                    if (showBranding === false) return

                    const wrapper = document.createElement('div')
                    wrapper.style.position = 'absolute'
                    wrapper.style.bottom = '18px'
                    wrapper.style.right = '22px'
                    wrapper.style.zIndex = '20'
                    wrapper.style.pointerEvents = 'none'
                    wrapper.style.userSelect = 'none'

                    const container = document.createElement('div')

                    // Charmi logo
                    const brand = document.createElement('img')
                    brand.src = '/images/logo/charmi-full-blanc.svg'
                    brand.style.height = '32px'
                    brand.style.width = 'auto'
                    brand.style.display = 'block'
                    brand.style.marginLeft = 'auto'
                    brand.style.filter = 'drop-shadow(0 1px 3px #000000)'

                    container.appendChild(brand)
                    wrapper.appendChild(container)
                    cloned.appendChild(wrapper)
                }
            },
        })
    }

    const previewSchedule = async (fontFamily?: string, showBranding?: boolean) => {
        isPreviewing.value = true
        previewDataUrl.value = await renderSchedule(1, fontFamily, showBranding)
        showPreview.value = true
        isPreviewing.value = false
    }

    const exportSchedule = async (fontFamily?: string, showBranding?: boolean) => {
        isExporting.value = true
        const dataUrl = await renderSchedule(2, fontFamily, showBranding)
        if (!dataUrl) return

        const link = document.createElement('a')
        link.download = 'planning.png'
        link.href = dataUrl
        link.click()
        isExporting.value = false
    }

    const renderScheduleMobile = async (scale?: number, fontFamily?: string, showBranding?: boolean): Promise<string | null> => {
        const node = document.querySelector<HTMLElement>('#scheduleCardMobile')
        if (!node) return null
        let mobileFooterInjected = false
        const fontCssText = fontFamily ? await loadFontForExport(fontFamily) : undefined

        return domToPng(node, {
            scale,
            width: 1080,
            height: 1920,
            font: fontCssText ? { cssText: fontCssText } : undefined,
            onCloneEachNode: (cloned) => {
                if (!(cloned instanceof HTMLElement)) return
                if (cloned.classList.contains('ignore-export')) {
                    cloned.style.display = 'none'
                }


                if (cloned.classList.contains('export-footer') && !mobileFooterInjected) {
                    mobileFooterInjected = true
                    if (showBranding === false) return

                    const wrapper = document.createElement('div')
                    wrapper.style.position = 'absolute'
                    wrapper.style.bottom = '60px'
                    wrapper.style.right = '60px'
                    wrapper.style.zIndex = '20'
                    wrapper.style.pointerEvents = 'none'
                    wrapper.style.userSelect = 'none'

                    const container = document.createElement('div')
                    const brand = document.createElement('img')
                    brand.src = '/images/logo/charmi-full-blanc.svg'
                    brand.style.height = '80px'
                    brand.style.width = 'auto'
                    brand.style.display = 'block'
                    brand.style.opacity = '0.75'
                    brand.style.filter = 'drop-shadow(0 1px 3px #000000)'

                    container.appendChild(brand)
                    wrapper.appendChild(container)
                    cloned.appendChild(wrapper)
                }
            }
        })
    }

    const previewScheduleMobile = async (fontFamily?: string, showBranding?: boolean) => {
        isPreviewing.value = true
        previewDataUrl.value = await renderScheduleMobile(1, fontFamily, showBranding)
        showPreview.value = true
        isPreviewing.value = false
    }

    const exportScheduleMobile = async (fontFamily?: string, showBranding?: boolean) => {
        isExporting.value = true
        const dataUrl = await renderScheduleMobile(2, fontFamily, showBranding)
        if (!dataUrl) return
        const link = document.createElement('a')
        link.download = 'planning-mobile.png'
        link.href = dataUrl
        link.click()
        isExporting.value = false
    }


    return {
        previewDataUrl,
        showPreview,
        renderSchedule,
        previewSchedule,
        exportSchedule,
        previewScheduleMobile,
        exportScheduleMobile,
        isExporting,
        isPreviewing,
    }
}