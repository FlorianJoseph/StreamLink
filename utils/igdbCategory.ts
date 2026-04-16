import type { Category } from './categories'

// IGDB genre IDs → catégorie
// https://api-docs.igdb.com/#genre
const GENRE_MAP: Record<number, Category> = {
    2:  'Aventure',        // Point-and-click
    4:  'Combat',          // Fighting
    5:  'FPS',             // Shooter
    7:  'Musique',         // Music
    8:  'Aventure',        // Platform
    9:  'Divertissement',  // Puzzle
    10: 'Sport & Course',  // Racing
    11: 'Stratégie',       // Real Time Strategy
    12: 'RPG',
    13: 'Simulation',
    14: 'Sport & Course',  // Sport
    15: 'Stratégie',       // Strategy
    16: 'Stratégie',       // Turn-based strategy
    24: 'Stratégie',       // Tactical
    25: 'Aventure',        // Hack & slash
    26: 'Party Games',     // Quiz/Trivia
    31: 'Aventure',        // Adventure
    33: 'Aventure',        // Arcade
    34: 'Aventure',        // Visual Novel
    35: 'Stratégie',       // Card & Board Game
    36: 'MOBA',
}

// IGDB theme IDs → catégorie (priorité sur les genres)
// https://api-docs.igdb.com/#theme
const THEME_MAP: Record<number, Category> = {
    19: 'Horreur',     // Horror
    21: 'Survie',      // Survival
    34: 'Party Games', // Party
}

// IGDB game mode IDs → catégorie (priorité maximale)
// https://api-docs.igdb.com/#game-mode
const MODE_MAP: Record<number, Category> = {
    5: 'MMO',           // Massively Multiplayer Online
    6: 'Battle Royale', // Battle Royale
}

/**
 * Résout la catégorie à partir des données IGDB d'un jeu.
 * Ordre de priorité : game_modes > themes > genres
 * Retourne null si aucun mapping trouvé (le regex client-side prend le relais).
 */
export function categoryFromIgdb(
    genres: number[] = [],
    themes: number[] = [],
    gameModes: number[] = [],
): Category | null {
    for (const m of gameModes) {
        if (MODE_MAP[m]) return MODE_MAP[m]
    }
    for (const t of themes) {
        if (THEME_MAP[t]) return THEME_MAP[t]
    }
    for (const g of genres) {
        if (GENRE_MAP[g]) return GENRE_MAP[g]
    }
    return null
}
