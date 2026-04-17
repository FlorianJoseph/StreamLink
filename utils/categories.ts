export const CATEGORIES = [
    // Non-gaming (méta-catégories)
    'IRL',          // Just Chatting, IRL, ASMR, Sports, Science, Bien-être, Humour, Podcast
    'Créatif',      // Art, Développement, Cuisine, Musique, DJ/Instruments
    // Gaming genres
    'Aventure', 'Battle Royale', 'FPS', 'Horreur', 'MMO',
    'RPG', 'Simulation', 'Survie',
    'Combat', 'Divertissement', 'Gaming', 'MOBA', 'Party Games', 'Retro', 'Sport & Course', 'Stratégie',
] as const

export type Category = typeof CATEGORIES[number]

/**
 * Règles de fallback :
 * - Contenus non-gaming (pas dans IGDB)
 * - Jeux populaires dont les tags IGDB sont incomplets ou absents
 * IGDB (igdbCategory.ts) est toujours testé en premier.
 */
const RULES: { match: string | RegExp; category: Category }[] = [

    // ── Sport & Course (gaming) — avant la règle IRL sport ─────────────────────
    { match: /\bfifa\b|\bfc \d+\b|ea sports fc/,  category: 'Sport & Course' },
    { match: /rocket league/,                      category: 'Sport & Course' },
    { match: /\bnba 2k/,                           category: 'Sport & Course' },
    { match: /\bf1 \d\d|\bformula 1/,              category: 'Sport & Course' },
    { match: /\bforza\b/,                          category: 'Sport & Course' },
    { match: /gran turismo/,                       category: 'Sport & Course' },
    { match: /need for speed/,                     category: 'Sport & Course' },
    { match: /efootball|pes \d/,                   category: 'Sport & Course' },
    { match: /\bskate\b/,                          category: 'Sport & Course' },

    // ── IRL (Just Chatting, IRL, ASMR, Sports, Science, Bien-être, Humour, Podcast) ──
    { match: 'just chatting',               category: 'IRL' },
    { match: /\birl\b/,                     category: 'IRL' },
    { match: 'travel & outdoors',           category: 'IRL' },
    { match: 'talk shows',                  category: 'IRL' },
    { match: 'podcast',                     category: 'IRL' },
    { match: 'asmr',                        category: 'IRL' },
    { match: 'fitness & health',            category: 'IRL' },
    { match: 'yoga',                        category: 'IRL' },
    { match: 'meditation',                  category: 'IRL' },
    { match: 'science & technology',        category: 'IRL' },
    { match: /\bsport(?! )/,               category: 'IRL' },
    { match: 'chess',                       category: 'IRL' },
    { match: /humour|comedy|humor/,         category: 'IRL' },
    { match: "i'm only sleeping",           category: 'IRL' },

    // ── Créatif (Art, Développement, Cuisine, Musique, DJ/Instruments) ──────
    { match: /music|performing arts/,       category: 'Créatif' },
    { match: /karaok|singing/,             category: 'Créatif' },
    { match: /\bdj\b/,                     category: 'Créatif' },
    { match: 'instruments',                category: 'Créatif' },
    { match: 'guitar',                     category: 'Créatif' },
    { match: 'piano',                      category: 'Créatif' },
    { match: /^art$/,                      category: 'Créatif' },
    { match: 'drawing',                    category: 'Créatif' },
    { match: 'painting',                   category: 'Créatif' },
    { match: /\bcraft\b|créat/,            category: 'Créatif' },
    { match: 'makers & crafting',          category: 'Créatif' },
    { match: 'diy',                        category: 'Créatif' },
    { match: /food|cook|cuisine/,          category: 'Créatif' },
    { match: /programming|coding|\bdev\b/,  category: 'Créatif' },
    { match: 'software',                   category: 'Créatif' },
    { match: /crypto|blockchain/,          category: 'Créatif' },
    { match: /\bia\b|artificial intel/,    category: 'Créatif' },

    // ════════════════════════════════════════════════════════════════════════
    // GAMING — fallback pour les jeux dont les tags IGDB sont incomplets
    // ════════════════════════════════════════════════════════════════════════

    // ── MOBA ─────────────────────────────────────────────────────────────────
    { match: /league of legends/,           category: 'MOBA' },
    { match: /\bdota\b/,                    category: 'MOBA' },
    { match: /\bsmite\b/,                   category: 'MOBA' },
    { match: /heroes of the storm/,         category: 'MOBA' },

    // ── FPS ──────────────────────────────────────────────────────────────────
    { match: /\bvalorant\b/,                category: 'FPS' },
    { match: /counter.strike|cs2|csgo/,     category: 'FPS' },
    { match: /rainbow six/,                 category: 'FPS' },
    { match: /overwatch/,                   category: 'FPS' },
    { match: /call of duty|modern warfare/, category: 'FPS' },
    { match: /\bhalo\b/,                    category: 'FPS' },
    { match: /battlefield/,                 category: 'FPS' },
    { match: /\bdoom\b/,                    category: 'FPS' },
    { match: /\bthe finals\b/,              category: 'FPS' },
    { match: /hunt: showdown/,              category: 'FPS' },
    { match: /\bfragpunk\b/,               category: 'FPS' },
    { match: /\bmarathon\b/,               category: 'FPS' },
    { match: /arc raiders/,                category: 'FPS' },
    { match: /the division/,               category: 'FPS' },
    { match: /\bchorvs\b/,                 category: 'FPS' },
    { match: /metro \d|metro 20/,          category: 'FPS' },

    // ── Battle Royale ─────────────────────────────────────────────────────────
    { match: /fortnite/,                    category: 'Battle Royale' },
    { match: /\bpubg\b|playerunknown/,      category: 'Battle Royale' },
    { match: /\bapex legends\b/,            category: 'Battle Royale' },
    { match: /warzone/,                     category: 'Battle Royale' },
    { match: /naraka/,                      category: 'Battle Royale' },

    // ── Survie ────────────────────────────────────────────────────────────────
    { match: /\brust\b/,                    category: 'Survie' },
    { match: /dayz/,                        category: 'Survie' },
    { match: /sons of the forest|the forest/, category: 'Survie' },
    { match: /subnautica/,                  category: 'Survie' },
    { match: /valheim/,                     category: 'Survie' },
    { match: /7 days to die/,               category: 'Survie' },
    { match: /\bark[: ]/,                   category: 'Survie' },
    { match: /green hell/,                  category: 'Survie' },
    { match: /once human/,                  category: 'Survie' },
    { match: /vintage story/,              category: 'Survie' },
    { match: /starsand/,                   category: 'Survie' },
    { match: /\bscum\b/,                   category: 'Survie' },
    { match: /minecraft/,                  category: 'Survie' },

    // ── Horreur ───────────────────────────────────────────────────────────────
    { match: /resident evil/,               category: 'Horreur' },
    { match: /phasmophobia/,                category: 'Horreur' },
    { match: /dead by daylight/,            category: 'Horreur' },
    { match: /silent hill/,                 category: 'Horreur' },
    { match: /outlast/,                     category: 'Horreur' },
    { match: /amnesia/,                     category: 'Horreur' },
    { match: /fnaf|five nights/,            category: 'Horreur' },
    { match: /little nightmares/,           category: 'Horreur' },
    { match: /alan wake/,                   category: 'Horreur' },
    { match: /tormented souls/,            category: 'Horreur' },
    { match: /alice.*madness/,             category: 'Horreur' },
    { match: /poppy.*playtime|poppy it/,   category: 'Horreur' },

    // ── RPG ───────────────────────────────────────────────────────────────────
    { match: /elden ring/,                  category: 'RPG' },
    { match: /dark souls/,                  category: 'RPG' },
    { match: /the witcher/,                 category: 'RPG' },
    { match: /\bskyrim\b|elder scrolls/,    category: 'RPG' },
    { match: /cyberpunk/,                   category: 'RPG' },
    { match: /\bdiablo\b/,                  category: 'RPG' },
    { match: /path of exile/,               category: 'RPG' },
    { match: /pok[eé]mon/,                 category: 'RPG' },
    { match: /final fantasy/,               category: 'RPG' },
    { match: /monster hunter/,              category: 'RPG' },
    { match: /genshin impact/,              category: 'RPG' },
    { match: /baldur.s gate/,               category: 'RPG' },
    { match: /clair obscur/,                category: 'RPG' },
    { match: /legacy of kain/,             category: 'RPG' },
    { match: /lost ark/,                   category: 'MMO' },

    // ── Stratégie ─────────────────────────────────────────────────────────────
    { match: /civilization|civ \d/,         category: 'Stratégie' },
    { match: /age of empires/,              category: 'Stratégie' },
    { match: /starcraft/,                   category: 'Stratégie' },
    { match: /total war/,                   category: 'Stratégie' },
    { match: /crusader kings/,              category: 'Stratégie' },
    { match: /europa universalis/,          category: 'Stratégie' },
    { match: /hearts of iron/,              category: 'Stratégie' },
    { match: /\bhearthstone\b/,             category: 'Stratégie' },
    { match: /cult of the lamb/,           category: 'Stratégie' },

    // ── Simulation ────────────────────────────────────────────────────────────
    { match: /the sims/,                    category: 'Simulation' },
    { match: /euro truck|american truck/,    category: 'Simulation' },
    { match: /flight simulator|msfs/,       category: 'Simulation' },
    { match: /farming simulator/,           category: 'Simulation' },
    { match: /satisfactory/,               category: 'Simulation' },
    { match: /dreamlight valley/,          category: 'Simulation' },
    { match: /my time at/,                 category: 'Simulation' },
    { match: /schedule i/,                 category: 'Simulation' },
    { match: /\bsimulator\b/,              category: 'Simulation' },  // règle générique (Bookshop, Recycling, Ranger's Path…)

    // ── MMO ───────────────────────────────────────────────────────────────────
    { match: /world of warcraft|\bwow\b/,   category: 'MMO' },
    { match: /final fantasy xiv|ffxiv/,     category: 'MMO' },
    { match: /guild wars/,                  category: 'MMO' },
    { match: /elder scrolls online|\beso\b/, category: 'MMO' },
    { match: /black desert/,               category: 'MMO' },

    // ── Combat ────────────────────────────────────────────────────────────────
    { match: /street fighter/,              category: 'Combat' },
    { match: /tekken/,                      category: 'Combat' },
    { match: /mortal kombat/,               category: 'Combat' },
    { match: /guilty gear/,                 category: 'Combat' },
    { match: /smash bros|smash ultimate/,   category: 'Combat' },
    { match: /dragon ball/,                 category: 'Combat' },

    // ── Sport & Course ───────────────────────────────────────────────────────
    // (règles déjà listées en tête de fichier avant IRL)

    // ── Aventure ─────────────────────────────────────────────────────────────
    { match: /grand theft|gta/,             category: 'Aventure' },
    { match: /red dead/,                    category: 'Aventure' },
    { match: /assassin.s creed/,            category: 'Aventure' },
    { match: /god of war/,                  category: 'Aventure' },
    { match: /the last of us/,              category: 'Aventure' },
    { match: /detroit.*human/,              category: 'Aventure' },
    { match: /\bmario\b/,                   category: 'Aventure' },
    { match: /\bzelda\b/,                   category: 'Aventure' },
    { match: /spider.man/,                 category: 'Aventure' },
    { match: /devil may cry/,             category: 'Aventure' },
    { match: /avatar.*pandora/,             category: 'Aventure' },
    { match: /stellar blade/,              category: 'Aventure' },
    { match: /crimson desert/,             category: 'Aventure' },
    { match: /\btrine\b/,                  category: 'Aventure' },
    { match: /chained together/,           category: 'Aventure' },
    { match: /pragmata/,                   category: 'Aventure' },
    { match: /mio.*orbit|memories in orbit/, category: 'Aventure' },
    { match: /no man.s sky/,              category: 'Aventure' },

    // ── Retro ─────────────────────────────────────────────────────────────────
    { match: /retro game/,                 category: 'Retro' },
    { match: /\bretro\b/,                  category: 'Retro' },

    // ── Gaming (contenu générique sans catégorie précise) ─────────────────────
    { match: /games interactive/,          category: 'Gaming' },
    { match: /nova.life/,                  category: 'Gaming' },
    { match: /hidden object/,              category: 'Divertissement' },

    // ── Party Games ───────────────────────────────────────────────────────────
    { match: /among us/,                    category: 'Party Games' },
    { match: /fall guys/,                   category: 'Party Games' },
    { match: /jackbox/,                     category: 'Party Games' },
    { match: /gartic/,                      category: 'Party Games' },
]

/**
 * Retourne la catégorie d'un jeu donné, ou null si aucune règle ne matche.
 */
export function getGameCategory(gameName: string | null | undefined): Category | null {
    if (!gameName) return null
    const lower = gameName.toLowerCase()
    for (const rule of RULES) {
        if (typeof rule.match === 'string') {
            if (lower.includes(rule.match)) return rule.category
        } else {
            if (rule.match.test(lower)) return rule.category
        }
    }
    return null
}
