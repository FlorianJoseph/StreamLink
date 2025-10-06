export const useClipboard = () => {
    const toast = useToast()
    const copy = async (text) => {
        if (!text) return
        try {
            await navigator.clipboard.writeText(text)
            toast.add({ severity: 'secondary', summary: 'Copié !', detail: 'Le lien a été copié dans le presse-papiers', life: 3000 })
            return true
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de copier le texte', life: 3000 })
            return false
        }
    }

    return { copy }
}
