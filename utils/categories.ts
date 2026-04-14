export const CATEGORIES = [
    // Non-gaming
    'ASMR', 'Art', 'Créatif', 'Cuisine', 'Divertissement',
    'Éducatif', 'Fitness', 'High-Tech', 'Humour', 'IRL',
    'Instruments', 'Just Chatting', 'Lifestyle', 'Musique', 'Podcast',
    'Science', 'Sports',
    // Gaming genres
    'FPS', 'Battle Royale', 'Survie', 'Horreur', 'RPG',
    'MOBA', 'Stratégie', 'Simulation', 'MMO', 'Sandbox',
    'Combat', 'Aventure', 'Party Games', 'Sport & Course', 'Gaming',
] as const

export type Category = typeof CATEGORIES[number]

/**
 * Mapping jeu (lowercase, sous-chaîne) → catégorie.
 * La première règle qui matche gagne.
 */
const RULES: { match: string | RegExp; category: Category }[] = [

    // ── IRL / Talk ──────────────────────────────────────────────────────────
    { match: 'just chatting',               category: 'Just Chatting' },
    { match: /\birl\b/,                     category: 'IRL' },
    { match: 'travel & outdoors',           category: 'IRL' },
    { match: 'talk shows',                  category: 'Podcast' },
    { match: 'podcast',                     category: 'Podcast' },

    // ── Bien-être / ASMR ────────────────────────────────────────────────────
    { match: 'asmr',                        category: 'ASMR' },
    { match: 'fitness & health',            category: 'Fitness' },
    { match: 'yoga',                        category: 'Fitness' },
    { match: 'meditation',                  category: 'Lifestyle' },

    // ── Musique ─────────────────────────────────────────────────────────────
    { match: /music|performing arts/,       category: 'Musique' },
    { match: /karaok|singing/,              category: 'Musique' },
    { match: 'instruments',                 category: 'Instruments' },
    { match: 'guitar',                      category: 'Instruments' },
    { match: 'piano',                       category: 'Instruments' },

    // ── Art / Créatif ────────────────────────────────────────────────────────
    { match: /^art$/,                       category: 'Art' },
    { match: 'drawing',                     category: 'Art' },
    { match: 'painting',                    category: 'Art' },
    { match: /craft|créat/,                 category: 'Créatif' },
    { match: 'makers & crafting',           category: 'Créatif' },
    { match: 'diy',                         category: 'Créatif' },

    // ── Cuisine ─────────────────────────────────────────────────────────────
    { match: /food|cook|cuisine/,           category: 'Cuisine' },

    // ── Science / Tech ───────────────────────────────────────────────────────
    { match: 'science & technology',        category: 'Science' },
    { match: /programming|coding|dev/,      category: 'High-Tech' },
    { match: 'software',                    category: 'High-Tech' },
    { match: /crypto|blockchain/,           category: 'High-Tech' },
    { match: /\bia\b|artificial intel/,     category: 'High-Tech' },

    // ── Sport (non-jeu vidéo) ────────────────────────────────────────────────
    { match: /\bsport(?! )/,                category: 'Sports' },
    { match: 'chess',                       category: 'Sports' },
    { match: /humour|comedy|humor/,         category: 'Humour' },

    // ════════════════════════════════════════════════════════════════════════
    // GAMING GENRES
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
    { match: /titanfall/,                   category: 'FPS' },
    { match: /\bdoom\b/,                    category: 'FPS' },
    { match: /quake/,                       category: 'FPS' },
    { match: /\bthe finals\b/,              category: 'FPS' },
    { match: /\bhuntdown|hunt: showdown/,   category: 'FPS' },

    // ── Battle Royale ─────────────────────────────────────────────────────────
    { match: /fortnite/,                    category: 'Battle Royale' },
    { match: /\bpubg\b|playerunknown/,      category: 'Battle Royale' },
    { match: /\bapex legends\b/,            category: 'Battle Royale' },
    { match: /warzone/,                     category: 'Battle Royale' },
    { match: /naraka/,                      category: 'Battle Royale' },
    { match: /super people/,               category: 'Battle Royale' },

    // ── Survie ────────────────────────────────────────────────────────────────
    { match: /\brust\b/,                    category: 'Survie' },
    { match: /dayz/,                        category: 'Survie' },
    { match: /sons of the forest|the forest/, category: 'Survie' },
    { match: /subnautica/,                  category: 'Survie' },
    { match: /valheim/,                     category: 'Survie' },
    { match: /7 days to die/,               category: 'Survie' },
    { match: /\bark[: ]/,                   category: 'Survie' },
    { match: /don.t starve/,                category: 'Survie' },
    { match: /green hell/,                  category: 'Survie' },
    { match: /the long dark/,               category: 'Survie' },
    { match: /\bscum\b/,                    category: 'Survie' },

    // ── Horreur ───────────────────────────────────────────────────────────────
    { match: /resident evil/,               category: 'Horreur' },
    { match: /phasmophobia/,                category: 'Horreur' },
    { match: /dead by daylight/,            category: 'Horreur' },
    { match: /silent hill/,                 category: 'Horreur' },
    { match: /outlast/,                     category: 'Horreur' },
    { match: /amnesia/,                     category: 'Horreur' },
    { match: /fnaf|five nights/,            category: 'Horreur' },
    { match: /little nightmares/,           category: 'Horreur' },
    { match: /\bvisage\b/,                  category: 'Horreur' },
    { match: /alan wake/,                   category: 'Horreur' },
    { match: /\bcall of cthulhu/,           category: 'Horreur' },

    // ── RPG ───────────────────────────────────────────────────────────────────
    { match: /elden ring/,                  category: 'RPG' },
    { match: /dark souls/,                  category: 'RPG' },
    { match: /sekiro/,                      category: 'RPG' },
    { match: /\bbloodborne\b/,              category: 'RPG' },
    { match: /the witcher/,                 category: 'RPG' },
    { match: /\bskyrim\b|elder scrolls/,    category: 'RPG' },
    { match: /\bfallout\b/,                 category: 'RPG' },
    { match: /\bbaldur.s gate\b/,           category: 'RPG' },
    { match: /cyberpunk/,                   category: 'RPG' },
    { match: /\bdiablo\b/,                  category: 'RPG' },
    { match: /path of exile/,               category: 'RPG' },
    { match: /dragon age/,                  category: 'RPG' },
    { match: /mass effect/,                 category: 'RPG' },
    { match: /pokemon/,                     category: 'RPG' },
    { match: /final fantasy/,               category: 'RPG' },
    { match: /monster hunter/,              category: 'RPG' },
    { match: /\bhogwarts\b/,               category: 'RPG' },
    { match: /\bstarfield\b/,              category: 'RPG' },
    { match: /zelda/,                       category: 'RPG' },
    { match: /\bpillars of eternity\b/,    category: 'RPG' },
    { match: /divinity.*sin/,               category: 'RPG' },

    // ── Stratégie ─────────────────────────────────────────────────────────────
    { match: /civilization|civ \d/,         category: 'Stratégie' },
    { match: /age of empires/,              category: 'Stratégie' },
    { match: /starcraft/,                   category: 'Stratégie' },
    { match: /clash royale|clash of clans/, category: 'Stratégie' },
    { match: /total war/,                   category: 'Stratégie' },
    { match: /\bxcom\b/,                    category: 'Stratégie' },
    { match: /crusader kings/,              category: 'Stratégie' },
    { match: /europa universalis/,          category: 'Stratégie' },
    { match: /hearts of iron/,              category: 'Stratégie' },
    { match: /\bhearthstone\b/,             category: 'Stratégie' },
    { match: /\bmagic.*gathering|mtg\b/,    category: 'Stratégie' },
    { match: /\bwarhammer/,                 category: 'Stratégie' },

    // ── Simulation ────────────────────────────────────────────────────────────
    { match: /the sims/,                    category: 'Simulation' },
    { match: /cities.*skylines/,            category: 'Simulation' },
    { match: /euro truck|american truck/,   category: 'Simulation' },
    { match: /flight simulator|msfs/,       category: 'Simulation' },
    { match: /farming simulator/,           category: 'Simulation' },
    { match: /planet coaster|planet zoo/,   category: 'Simulation' },
    { match: /powerwash|power wash/,        category: 'Simulation' },
    { match: /viscera cleanup/,             category: 'Simulation' },

    // ── MMO ───────────────────────────────────────────────────────────────────
    { match: /world of warcraft|\bwow\b/,   category: 'MMO' },
    { match: /lost ark/,                    category: 'MMO' },
    { match: /final fantasy xiv|ffxiv/,     category: 'MMO' },
    { match: /new world/,                   category: 'MMO' },
    { match: /guild wars/,                  category: 'MMO' },
    { match: /elder scrolls online|\beso\b/, category: 'MMO' },
    { match: /black desert/,                category: 'MMO' },
    { match: /\blineage\b/,                 category: 'MMO' },

    // ── Sandbox ───────────────────────────────────────────────────────────────
    { match: /minecraft/,                   category: 'Sandbox' },
    { match: /terraria/,                    category: 'Sandbox' },
    { match: /stardew/,                     category: 'Sandbox' },
    { match: /\broblox\b/,                  category: 'Sandbox' },
    { match: /\bcore\b game/,               category: 'Sandbox' },
    { match: /\bgarrys mod|gmod\b/,         category: 'Sandbox' },

    // ── Combat (Fighting Games) ───────────────────────────────────────────────
    { match: /street fighter/,              category: 'Combat' },
    { match: /tekken/,                      category: 'Combat' },
    { match: /mortal kombat/,               category: 'Combat' },
    { match: /guilty gear/,                 category: 'Combat' },
    { match: /dragon ball.*fighter/,        category: 'Combat' },
    { match: /king of fighters/,            category: 'Combat' },
    { match: /smash bros|smash ultimate/,   category: 'Combat' },
    { match: /\bmkx\b|\bmk\d+\b/,          category: 'Combat' },

    // ── Sport & Course ───────────────────────────────────────────────────────
    { match: /rocket league/,               category: 'Sport & Course' },
    { match: /\bfifa\b|\bfc \d+\b|ea sports fc/, category: 'Sport & Course' },
    { match: /\bnba 2k/,                    category: 'Sport & Course' },
    { match: /\bf1 \d\d|\bformula 1/,       category: 'Sport & Course' },
    { match: /\bnhl\b/,                     category: 'Sport & Course' },
    { match: /madden/,                      category: 'Sport & Course' },
    { match: /\bforza\b/,                   category: 'Sport & Course' },
    { match: /gran turismo/,                category: 'Sport & Course' },
    { match: /need for speed/,              category: 'Sport & Course' },
    { match: /\bdirt\b|\bwrc\b/,            category: 'Sport & Course' },

    // ── Aventure / Action ─────────────────────────────────────────────────────
    { match: /grand theft|gta/,             category: 'Aventure' },
    { match: /red dead/,                    category: 'Aventure' },
    { match: /assassin.s creed/,            category: 'Aventure' },
    { match: /god of war/,                  category: 'Aventure' },
    { match: /spider.man/,                  category: 'Aventure' },
    { match: /horizon/,                     category: 'Aventure' },
    { match: /the last of us/,              category: 'Aventure' },
    { match: /uncharted/,                   category: 'Aventure' },
    { match: /\bmario\b/,                   category: 'Aventure' },
    { match: /\bkirby\b/,                   category: 'Aventure' },
    { match: /\bsonic\b/,                   category: 'Aventure' },
    { match: /\bmetroid\b/,                 category: 'Aventure' },
    { match: /ghostrunner/,                 category: 'Aventure' },

    // ── Party Games ───────────────────────────────────────────────────────────
    { match: /among us/,                    category: 'Party Games' },
    { match: /fall guys/,                   category: 'Party Games' },
    { match: /jackbox/,                     category: 'Party Games' },
    { match: /gartic/,                      category: 'Party Games' },
    { match: /\bpropnight\b/,               category: 'Party Games' },
    { match: /\bgoose goose duck\b/,        category: 'Party Games' },
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
