# StreamLink — Contexte du projet

## Vision

StreamLink centralise les liens, le planning de live et la visibilité des streameurs, dans un seul espace pensé pour être partagé.
Objectif : aider les streamers à mieux se présenter, gagner en visibilité et économiser du temps.

## Cible

- Streamers débutants à intermédiaires
- Principalement Twitch
- Peu techniques, recherchant simplicité, visibilité et organisation

## Stack

- Nuxt 3, TypeScript, Prisma, Supabase, Pinia, Tailwind, Resend

## Principes produit

- Simplicité avant tout
- Chaque feature doit apporter visibilité ou confort
- Pas d’over‑engineering
- UI orientée cartes
- Empty states pédagogiques
- Naming clair (anglais dans le code)

## Features actuelles

- Consentement RGPD & newsletter
- Profil streamer public (type Linktree)
- Liens et design personnalisés (couleurs, thèmes, formes de liens)
- Dashboard (activation, guidance, section outils)
- Système de découverte
- Planning hebdomadaire personnalisable

## État du produit

- 20/01/26 100 utilisateurs, 50 profils actifs, newsletter ~30 inscrits
- 07/02/26 150 utilisateurs, 65 profils actifs, 230 liens, 0 streams planifiés, newsletter 65 inscrits
- 14/02/26 170 utilisateurs, 69 profils actifs, 276 liens, 37 streams planifiés, newsletter 70 inscrits
- 17/02/26 190 utilisateurs, 76 profils actifs, 300 liens, 75 streams planifiés, newsletter 80 inscrits
- 18/02/26 200 utilisateurs, 83 profils actifs, 325 liens, 115 streams planifiés, newsletter 93 inscrits + 1ère collab
- 19/02/26 225 utilisateurs, 95 profils actifs, 375 liens, 149 streams planifiés, newsletter 100 inscrits
- 20/02/26 236 utilisateurs, 104 profils actifs, 419 liens, 180 streams planifiés, newsletter 103 inscrits
- 21/02/26 251 utilisateurs, 116 profils actifs, 464 liens, 246 streams planifiés, newsletter 108 inscrits
- 24/02/26 283 utilisateurs, 136 profils actifs, 556 liens, 348 streams planifiés, newsletter 117 inscrits

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

## Roadmap court terme – Consolider l’usage (priorité)
Objectif principal : stabiliser l’usage et maximiser l’activation.

### Page publique

    - Widget planning
    - Stats basiques
    - Objectif KPI : 60 % activation profils visibles 2 semaines après

### Améliorer discover

    - Filtres (jeu, horaire...)

### Notifications in‑app

    - Rappels de complétion de profil ?
    - Rappels pour créer un planning ?
    - Alertes nouvelles features ?

## Roadmap moyen terme – Augmenter la visibilité
Objectif principal : booster l’engagement et l’usage régulier.

### Boost Discover

    - Collabs/Raids
    - Mise en avant rotationnelle des profils ?

## Roadmap long terme – Premium et features avancées
Objectif principal : créer de la valeur pour les utilisateurs Pro et maximiser la rétention.

### Premium V1
#### Pack réseaux sociaux 
    - Twitch live API
    - Branding supprimé Planning et Page de Liens
    - Sync Twitch automatique
    - Export Discord

#### Pack Designer
    - Thèmes exclusifs
    - Background animé
    - Layout custom
    - Branding supprimé

#### Pack Créateur
Les 2 Packs + Stats avancées

#### Tous
    - Badges premium

Objectifs KPI :
    - Conversion planning → 60%
    - Funnel intégrité lien → stream → 70%
    - Engagement newsletter → 60%

    - Faire gagner du temps
    - Donner plus de visibilité
    - Apporter des stats
    - Donner un avantage compétitif
    - Sync Twitch automatique temps réel ?
    - Suppression du branding

### Features (roue aléatoire, tournois)

    - Roue aléatoire (giveaway)
    - Tournois rapides via chat

### Marketplace & événements

    - Vente de templates, outils ou événements pour streamers

### Rebranding (nom, logo, favicon)

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