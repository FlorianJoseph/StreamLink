export const languageOptions = [
    { value: 'FR', label: 'Français', flag: 'fr' },
    { value: 'EN', label: 'English', flag: 'us' },
    { value: 'ES', label: 'Español', flag: 'es' },
    { value: 'DE', label: 'Deutsch', flag: 'de' },
    { value: 'IT', label: 'Italiano', flag: 'it' },
    { value: 'PT', label: 'Português', flag: 'br' },
    { value: 'JA', label: '日本語', flag: 'jp' },
    { value: 'KO', label: '한국어', flag: 'kr' },
    { value: 'OTHER', label: 'Autre' },
]

export const getFlag = (code: string) =>
    languageOptions.find(l => l.value === code)?.flag ?? null

export const getLabel = (code: string) =>
    languageOptions.find(l => l.value === code)?.label ?? null