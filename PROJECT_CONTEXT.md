# StreamLink — Contexte du projet

## Vision
StreamLink centralise les liens, le planning de live et la visibilité des streamers, dans un seul espace pensé pour être partagé.

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
<!-- - Mesurabilité (KPI simple) pour chaque feature -->

## Features actuelles
- Consentement RGPD & newsletter
- Profil streamer public (type Linktree)
- Liens et design personnalisés
- Dashboard (activation, guidance)
- Système de découverte
- Planning hebdomadaire personnalisable

## État du produit
- ~100 utilisateurs, ~50 profils actifs, newsletter active (~30 inscrits) 20 janvier 2026
- ~150 utilisateurs, ~65 profils actifs, newsletter active (~65 inscrits) 07 février 2026

## Roadmap déjà sorti
- En production depuis le 19 octobre 2025
- Confidentialité 28 octobre 2025
- Découverte 05 novembre 2025
- Design 31 décembre 2025
- Newletter 10 janvier 2026
- Dashboard 14 janvier 2026

## Roadmap court terme – Consolider l’usage (priorité)
1. Planning V1 (création + affichage public)
    - Affichage public sur le profil
    - Diffusion
    - Widget planning dans le dashboard

3. Notifications in‑app
    - Rappels de complétion de profil
    - Rappels pour créer un planning
    - Alertes nouvelles features 

4. Amélioration de l’onboarding / activation des profils
    - Guidage via dashboard
    - Messages pédagogiques / micro CTA

## Roadmap moyen terme – Augmenter la visibilité
1. Boost Discover (filtres, collabs, raids)
    - Filtres (jeu, langue, horaire)
    - Collabs / raids aléatoires
    - Mise en avant rotationnelle des profils

2. Statistiques basiques (vues profil, clics)
    - Vues profil, clics sur liens

3. Synchronisation planning Twitch / Discord
    - Première version simple → notifications sur Discord

## Roadmap long terme – Premium et features avancées
1. Premium V1 (design avancé, stats, options pro)
    - Thèmes avancés / design pro
    - Stats avancées
    - Badges / options pro
    - Accès anticipé features

2. Features virales (roue aléatoire, tournois)
    - Roue aléatoire pour chat Twitch
    - Tournois rapides

4. Marketplace & événements
    -   Vente de templates, outils ou événements pour streamers
    
5. Rebranding (nom, logo, favicon)

## Règles de décision
Avant d’ajouter une fonctionnalité :
1. Apporte‑t‑elle visibilité ou confort ?
2. Est‑elle utilisable en < 2 minutes ?
3. Est‑elle compréhensible sans doc ?
4. Peut‑on la mesurer avec un KPI simple ?
Si une réponse est non → reporter la feature.

