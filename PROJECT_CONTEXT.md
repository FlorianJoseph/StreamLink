# StreamLink — Contexte du projet

## Vision

StreamLink centralise les liens, le planning de live et la visibilité des streameurs, dans un seul espace pensé pour être partagé.
Objectif : aider les streamers à mieux se présenter, gagner en visibilité et économiser du temps.

## Cible

- Streamers débutants à intermédiaires
- Principalement Twitch
- Peu techniques, recherchant simplicité, visibilité et organisation

## Stack

- Nuxt 3, TypeScript, Prisma, Supabase, Pinia, Tailwind, Resend, React Email

## Principes produit

- Simplicité avant tout
- Chaque feature doit apporter visibilité ou confort
- Pas d’over‑engineering
- UI orientée cartes
- Empty states pédagogiques
- Naming clair (anglais dans le code)

## Features actuelles

- Consentement RGPD & newsletter
    - Email auto de bienvenue
    - Email auto segmenté Profil invisible/Sans planning
    - Templates React Email

- Page publique StreamLink (type Linktree)
    - Profil streamer : avatar, pseudo, bio, couleurs et style personnalisables
    - Statut live & prochain stream en temps réel, planning semaine affiché
    - Liens personnalisables : icônes/images, boutons stylisés, feedback hover/copie
    - Switcher Liens / Planning pour voir tous les contenus facilement
    - Stats basiques
        - vues de la page
        - clics sur les liens
        - stats journalières
        - totaux et 7 derniers jours
    - CTA vers création de page et footer infos (contact/confidentialité)

- Dashboard Progression & Outils
    - Guide les utilisateurs pour compléter leur profil et planning
    - Montre la progression des quêtes essentielles et optionnelles
    - Permet un accès rapide aux outils et au partage de la page publique
    - Informe des fonctionnalités à venir et pousse à l’inscription à la newsletter

- Page Découverte
    - Recherche & filtres : barre de recherche par pseudo + filtres rapides (Tous, Live, Aujourd’hui, À venir)
    - Affichage des streamers :
        Cartes avec avatar, pseudo, prochain stream, statut live
        Indication visuelle du stream en direct (pulse rouge) ou du prochain stream prévu
        Planning simplifié : aujourd’hui / demain / autre jour
    - Pagination responsive :
        Grid adaptée selon taille d’écran
        Chevron et navigation clavier pour desktop
        Pagination mobile/tablette simplifiée
    - État vide : messages contextuels si aucun streamer ne correspond aux filtres/recherche
    - Expérience utilisateur fluide : loader pendant le fetch, animation fade-in, rafraîchissement automatique des progressions live

- Gestion de planning de streams
    - Chargement & UX fluide : loader pendant le fetch, animation fade-in.
    - Configuration des créneaux :
        Ajouter, modifier ou supprimer des créneaux pour chaque jour de la semaine
        Vue en accordéon par jour pour l’édition rapide
        Affichage visuel clair avec couleurs et jeux associés
        Choix de la taille du créneau fixe (demie-journée) ou automatique
    - Design & personnalisation :
        Choix de l’arrière-plan (couleur ou image)
        Couleur et style du texte, opacité du background
        Toggle pour afficher ou masquer titres, heures de fin, jours sans stream
    - Outils & export :
        Aperçu du planning en temps réel
        Téléchargement/export de l’image du planning
        Navigation et interaction intuitives avec hover actions et zones ajout “avant/après”
    - Structure responsive : adaptable desktop/mobile, barre d’outils fixe, grille de créneaux flexible
    - Footer branding : mention “Made with StreamLink” intégrée sur l’export

- Admin
    - Dashboard d'analyse
    - Segments Newsletter et historique d'envoi
    
## État du produit

- 20/01/26 100 utilisateurs, 50 profils actifs, newsletter 30 inscrits
- 07/02/26 150 utilisateurs, 65 profils actifs, 230 liens, newsletter 65 inscrits + sortie planning
- 14/02/26 170 utilisateurs, 69 profils actifs, 276 liens, 37 streams planifiés, newsletter 70 inscrits
- 18/02/26 200 utilisateurs, 83 profils actifs, 325 liens, 115 streams planifiés, newsletter 93 inscrits + 1ère collab
- 24/02/26 283 utilisateurs, 136 profils actifs, 556 liens, 348 streams planifiés, newsletter 117 inscrits
- 02/03/26 345 utilisateurs, 188 profils actifs, 779 liens, 535 streams planifiés, newsletter 150 inscrits
- 10/03/26 428 utilisateurs, 252 profils actifs, 1036 liens, 728 streams planifiés, 778 vues de pages, newsletter 180 inscrits
- 12/03/26 428 utilisateurs, 264 profils actifs, 1104 liens, 782 streams planifiés, 1147 vues de pages, newsletter 195 inscrits

## Roadmap déjà réalisée

- En production 19/10/25
- Confidentialité 28/10/25
- Découverte 05/11/25
- Design 31/12/25
- Newsletter 10/01/26
- Dashboard 14/01/26
- Planning 08/02/26
- Découverte v1 (prochain stream + filtres simples) 12/02/26
- Nouvelles quêtes dashboard (activation planning) 16/02/26
- Découverte V2 avec filtres (live, auj, à venir) 23/02/26
- Page de lien V2 (design + statut live + planning) 28/02/26
- Segmentation newsletter (tous, profil non visible et pas de planning) + templates + email auto de bienvenue 05/03/26
- Stats publiques (vues + clics + historique journalier) 07/03/26

## Roadmap court terme – Augmenter la fréquence d'usage (priorité)
Objectif : que les utilisateurs reviennent régulièrement et activent leur planning.

### Notifications et rappels intelligents
    - Alertes nouvelles fonctionnalités ou tips rapides (ex : Ton lien Twitch a reçu 12 clics aujourd’hui !)

### Page publique
    - Choisir sa nationalité
    - Créer des catégories ?
    - CTA découvrir d'autres streamers

### Monnaie virtuelle 
    - Gains automatiques avec les quêtes du dashboard + solde visible + 3-4 cosmétiques simples (thème ou badge), pas de boutique d'achat

### Optimisation pédagogique
    - Propostion de couleur texte dans le designen fonction du thème


## Roadmap moyen terme – Découverte & visibilité

### Améliorer discover
    - Filtres (nationalité, jeu, horaire...)
    - Collabs/Raids

### Planning
    - Export format mobile

### Réseaux
    - Export story insta/X

### Page Inventaire / Boutique complète
    - Inventaire cosmétiques + accès premium temporaires en coins
    Objectif avant d'ouvrir l'achat de coins :
    ✦ 800+ utilisateurs
    ✦ 60%+ profils actifs
    ✦ 40%+ users avec des coins dépensés (valide que le système est utilisé)
    ✦ Des retours qualitatifs de users qui veulent "aller plus vite"

## Roadmap long terme – Premium & fonctionnalités avancées
Objectif : créer de la valeur payante et améliorer la rétention des pros.

### Premium et monétisation
#### Achat de coins via Stripe
    - Starter ✦500 2,99€ Débloquer un accès 7j direct
    - Popular ✦1500 6,99€ Un mois de premium complet
    - Pro ✦3500 14,99€ Plusieurs mois + cosmétiques
Logique de conversion : après avoir consommé un accès temporaire, afficher un CTA "Profiter de ça en illimité → Pack Pro" avec le prix. C'est le funnel le plus naturel qui soit.

#### Pack Pro – Gain de temps
    - Twitch live
    - Branding supprimé Planning et Page de Liens
    - Sync Twitch automatique
    - Export Discord
Positionnement : Tu te concentres sur ton stream, on s’occupe du reste.

#### Pack Boost – Plus de visibilité
    - Mise en avant Discover
    - Badge créateur vérifié
    - Priorité affichage live
    - Stats avancées
Positionnement : Plus visible. Plus professionnel.

#### Pack Studio – Identité premium
    - Thèmes exclusifs
    - Layout custom
    - Background animé
    - Personnalisation avancée
Positionnement : Une page qui te ressemble vraiment.

Objectifs KPI :
    - Conversion planning → 60% (atteint en 4j)
    - Funnel intégrité lien → stream → 70% (45 26/02 -> 53% 01/03) (57% 08/03)
    - Engagement newsletter → 40% (41%)

### Fonctionnalités additionnelles

    - Roue aléatoire (giveaway)
    - Tournois rapides via chat
    - Marketplace de templates ou événements pour streamers

## Rebranding (Devis signé 03/03/26)

### DIRECTION ARTISTIQUE & BRANDING WEB 150€
    • Recherche et définition de l’univers visuel
    • Palette couleurs 
    • Typographies 
    • Ton de marque 
    • Références iconographiques / flat design

### LOGO & DÉCLINAISONS 200 €
    • Logo principal 
    • Versions secondaires 
    • Icône / favicon
    • Exports optimisés web

### NAMING 100€
    • Recherche de noms (3 à 5 propositions) 
    • Justification sémantique
    
## Règles de décision

Avant d’ajouter une fonctionnalité :

1. Apporte‑t‑elle visibilité ou confort ?
2. Est‑elle utilisable en < 2 minutes ?
3. Est‑elle compréhensible sans doc ?
   Si une réponse est non → reporter la feature.

## Data et analytics

### KPIs suivis

- Utilisateurs totaux
- Profils visibles (activation)
- Liens créés
- Streams planifiés
- Conversion lien (% utilisateurs avec au moins un lien)
- Conversion slot (% utilisateurs avec au moins un stream)
- Newsletter (total + profils visibles)
(ajouter pages vues / profils actifs)

### Indicateurs stratégiques

- Activation rate = profils visibles / utilisateurs
- Engagement lien = utilisateurs avec lien / profils visibles
- Engagement planning = utilisateurs avec stream / utilisateurs avec lien
- Funnel integrity (lien → stream)
- Growth week-over-week profils visibles

### Infrastructure

- Materialized view Supabase pour agrégats
- Refresh planifié (cron)
- Dashboard admin temps réel

### Objectif

Mesurer les leviers qui augmentent :

- visibilité
- rétention
- engagement planning

### North Star 

    - Streamers actifs avec planning public → c’est le signal principal pour la rétention et l’engagement.

### Levier premium

    - Sync Twitch automatique → gros gain de temps et valeur ajoutée pour les utilisateurs Pro.
    - Stats avancées et design premium → améliore la visibilité et donne un avantage compétitif.
    - Export Discord → pousse à l’engagement régulier.

### Lien avec ma chaine Twitch
Pour fidéliser tes viewers twitch quand tu auras fait ton système de monnaie virtuelle tu peux aussi proposer d’échanger des points de chaine twitch contre de la monnaie virtuelle

1 coût = 0
2 apport de nouveau viewers sur la chaîne et farm gratuit 
3 augmentation globale de ta visibilité twitch