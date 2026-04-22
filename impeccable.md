# Design Context — Charmi

## Projet

Charmi est une plateforme pensée pour les streamers Twitch débutants à intermédiaires. Elle centralise liens, planning de live et visibilité dans un espace simple et partageable. L'identité visuelle Charmi est la direction à suivre pour tout nouveau travail UI.

## Audience

- Streamers Twitch, peu techniques
- Cherchent simplicité, visibilité, organisation
- Communauté francophone principalement mais à but accessible aussi en anglais
- Contexte d'usage : dashboard perso, page publique partagée, découverte d'autres streamers

## Ton de marque

3 piliers : **accompagnement, communauté, croissance**

- Chaleureux et direct, jamais condescendant
- Encouraging sans être creux
- Communautaire, esprit Twitch/Discord
- Gamifié subtilement (Charm monnaie virtuelle, quêtes, raids, badges)
- Français en priorité, accessible aussi en anglais

## Couleurs

```css
--color-primary:    #6A5AE0;  /* Violet — action principale, CTA, accents forts */
--color-accent:     #FFC82C;  /* Jaune — highlight, rewards, éléments gamifiés */
--color-dark:       #1E1F22;  /* Background dark — surface principale en dark mode */
--color-surface:    #F2F3F7;  /* Surface claire — cards, backgrounds en light mode */
--color-white:      #FFFFFF;
--color-black:      #000000;

/* Texte */
--color-text-dark:  #F2F3F7;  /* Texte principal en dark mode — contraste 4.5:1+ sur #1E1F22 */
--color-text-light: #1E1F22;  /* Texte principal en light mode */
--color-text-muted: #9A9BA0;  /* Texte secondaire, labels, metadata */

/* Surfaces dark mode */
--color-surface-dark:   #2A2B2F;  /* Cards, panels en dark mode */
--color-surface-darker: #18191C;  /* Fond plus profond, modals */
```

### Combinaisons validées (issues de la charte graphiste)

- Violet + Noir : premium, tech
- Jaune + Noir : énergie, reward
- Violet + Jaune : accent fort, gamification
- Blanc sur violet ou jaune : lisibilité maximale

### Modes

- **Dark mode** : `#1E1F22` comme background, surfaces en `#2A2B2F`
- **Light mode** : `#F2F3F7` comme background, cards blanches
- Les deux modes sont supportés — dark mode prioritaire

## Typographie

> ⚠️ Ces choix sont imposés par le graphiste et priment sur toute liste noire de skills.

### Pilcrow Rounded — Titres (H1, H2)

- Poids : **ExtraBold**
- Usage : grands titres de page, hero sections, headings principaux
- Caractère : arrondi, expressif, communautaire

### Plus Jakarta Sans — Textes courants (H3, H4, p)

- Poids : **SemiBold**
- Usage : sous-titres, body text, labels, UI copy
- Caractère : lisible, moderne, neutre

### Règles typographiques

- Ne jamais mélanger les rôles : Pilcrow Rounded = titres seulement
- Hiérarchie stricte : H1/H2 → Pilcrow Rounded ExtraBold, H3/H4/p → Plus Jakarta Sans SemiBold
- Taille minimum body : 14px, idéalement 16px
- Line-height body : 1.5

## Espacements & Radius

```css
/* Border radius */
--radius-sm:   6px;    /* Badges, tags, petits éléments */
--radius-md:   12px;   /* Boutons, inputs */
--radius-lg:   16px;   /* Cards, panels */
--radius-xl:   24px;   /* Modals, drawers */
--radius-full: 9999px; /* Pills, avatars */
```

- Référence Tailwind : `rounded-lg` (cards), `rounded-xl` (modals), `rounded-md` (boutons)
- Pas de sharp corners — l'univers Charmi est organique et arrondi
- Cohérence stricte par type de composant

## Univers visuel (direction Charmi)

- Mascotte nuage/étoile stylisée — esprit Discord/Twitch/Streamlabs
- Formes arrondies, organique, pas de sharp corners excessifs
- Énergie gaming sans être trop dark/edgy
- Gamification visible : badges, Charm (monnaie virtuelle), quêtes
- Flat design avec quelques accents illustratifs

## Stack technique

- Nuxt 3, TypeScript, Tailwind CSS, Supabase
- Composants PrimeVue
- Tailwind pur pour tous les styles

## Principes UI

- Cards comme unité visuelle principale
- Empty states pédagogiques avec guidance claire
- Responsive mobile-first
- Dark mode prioritaire, light mode supporté
- Pas de purple gradient générique — utiliser `#6A5AE0` avec intention
- Interactions subtiles : hover states, transitions douces (150–250ms)
- Iconographie cohérente (Lucide Icons + Simple Icons pour les marques)

## Anti-patterns à éviter

- Layouts tout-centré génériques
- Gradients violet sur blanc (trop "AI slop")
- Inter ou Roboto (remplacés par la charte graphiste)
- Rounded corners uniformes sans intention
- Trop de texte dans les cards — privilégier la hiérarchie visuelle