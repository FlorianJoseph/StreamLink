export const useClipboard = () => {
    const copy = async (text) => {
        if (!text) return
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch (err) {
            return false
        }
    }

    return { copy }
}
