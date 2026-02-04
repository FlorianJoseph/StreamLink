
// Fonctions pour normaliser les et valider les couleurs hexadécimales
export const normalizeHexColor = (val: string): string => {
    if (!val) return ''

    let hex = val.replace('#', '').toUpperCase().slice(0, 6)

    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((c) => c + c)
            .join('')
    }

    return hex
}

// Vérifie si une chaîne est une couleur hexadécimale valide
export const isValidHexColor = (val: string): boolean =>
    /^([0-9A-F]{6}|[0-9A-F]{3})$/.test(val)

// Normalise et valide une couleur hexadécimale, avec une valeur de repli
export const normalizeAndValidateHex = (
    val: string
): string => {
    const clean = normalizeHexColor(val)
    return isValidHexColor(clean) ? clean : ''
}
