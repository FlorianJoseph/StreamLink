# StreamLink — Contexte du projet

## Vision

StreamLink centralise les liens, le planning de live et la visibilité des streamers, dans un seul espace pensé pour être partagé.
Objectif : aider les streamers à mieux se présenter, gagner en visibilité et économiser du temps.

## Cible

- Streamers débutants à intermédiaires
- Principalement Twitch
- Peu techniques, recherchant simplicité, visibilité et organisation

## Stack

- Nuxt 3, TypeScript, Supabase, Tailwind, Resend, React Email, Stripe

## Principes produit

- Simplicité et confort avant tout
- UI cartes, empty states pédagogiques
- Features orientées visibilité et engagement
- Naming clair et compréhensible

## Features principales

- Consentement RGPD & newsletter : email de bienvenue, segments, templates React Email
- Page publique type Linktree : profil customisable, statut live, planning, liens stylisés, stats basiques
- Dashboard progression & outils : guide complet des quêtes essentielles et optionnelles, accès rapide aux outils
- Page découverte : recherche, filtres, cartes streamer, pagination responsive, feedback live
- Gestion planning : ajout/modification créneaux, export, personnalisation visuelle, responsive, footer branding
- Admin : dashboard analytique, segments newsletter, historique envoi
- Raids Twitch : lancer un raid depuis la découverte, récompense en Coins selon le nombre de viewers, restrictions anti-farm (1/jour, 4/semaine, pas le même streamer 2x), annulation possible

## État du produit

- 20/01/26 100 utilisateurs, 50 profils actifs, newsletter 30 inscrits
- 07/02/26 150 utilisateurs, 65 profils actifs, 230 liens, newsletter 65 inscrits + sortie planning
- 14/02/26 170 utilisateurs, 69 profils actifs, 276 liens, 37 streams planifiés, newsletter 70 inscrits
- 18/02/26 200 utilisateurs, 83 profils actifs, 325 liens, 115 streams planifiés, newsletter 93 inscrits + 1ère collab
- 24/02/26 283 utilisateurs, 136 profils actifs, 556 liens, 348 streams planifiés, newsletter 117 inscrits
- 02/03/26 345 utilisateurs, 188 profils actifs, 779 liens, 535 streams planifiés, newsletter 150 inscrits
- 10/03/26 428 utilisateurs, 252 profils actifs, 1036 liens, 728 streams planifiés, 778 vues de pages, newsletter 180 inscrits
- 16/03/26 473 utilisateurs, 283 profils actifs, 1186 liens, 827 streams planifiés, 1838 vues de pages, newsletter 208 inscrits
- 27/03/26 555 utilisateurs, 345 profils actifs, 1440 liens, 1062 streams planifiés, 4015 vues de pages, newsletter 248 inscrits + premium
- 03/04/26 587 utilisateurs, 362 profils actifs, 1518 liens, 1136 streams planifiés, 5197 vues de pages, newsletter 263 inscrits
- 13/04/26 627 utilisateurs, 390 profils actifs, 1630 liens, 1176 streams planifiés, 6907 vues de pages, newsletter 277 inscrits

## Historique Roadmap

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
- Taille de créneaux planning 05/03/26
- Stats publiques (vues + clics + historique journalier) 07/03/26
- UX Navigation (Navbar + Discord ajouté + scroll sous navbar) 09/03/26
- Date auto planning 10/03/26
- Choix de la langue + filtres découverte 13/03/26
- Choix de Charmi 13/03/26
- Premium et monétisation 24/03/26
    - Monnaie virtuelle : Coins (temporaire, deviendra autre chose au rebranding Charmi) + quêtes BDD + récompenses automatiques 22/03/26
    - Système de features temporaires 7j/30j en place
    - 3 features déployées : no_branding + premium_theme + mobile_export
- Historique transaction des Coins
- Boutique + Stripe (packs Coins + abonnement 7,99€/mois) + connexion quotidienne 27/03/26
- Intégration API Twitch pour la page découverte et page publique 30/03/26
- Streamers similaires (scoring jeux/horaires/langue/live + widget page publique) 08/04/26
- Raids Twitch avec Coins (API channel:manage:raids, token BDD, refresh auto, restrictions 1/jour 4/semaine) 12/04/26
- Découverte V3 (layout Netflix par genres, vue live avec tri viewers, section "Parfaits pour raid", Top Raiders, Raid Assistant, recherche par nom et jeu, progression raids dans le header) 17/04/26

## Roadmap court terme – Augmenter la visibilité et promouvoir le réseau interne

## Roadmap moyen terme – Améliorer le premium
    - Stats avancées

### Abonnement — enrichissement progressif
    - Background gradient/image/animé
    - Personnalisation avancée
    - Sync Twitch automatique
    - Export Discord (bot Discord)
    - Mise en avant sur la Découverte
    - Créer des catégories de lien (premium)

## Roadmap long terme – Premium & fonctionnalités additionnelles

### Optimisation pédagogique
    - Proposition de couleur texte dans le design en fonction du thème

### Fonctionnalités additionnelles (le plus éloigné)
    - Evènements (caritatifs...)
    - Roue aléatoire (giveaway)
    - Tournois rapides via chat
    - Marketplace de templates ou événements pour streamers

## Rebranding (Devis signé 03/03/26)
    - Nouveau nom envisagé : **Charmi**
    - Prononciation : "charmi" (FR/EN identique)
    - Sémantique : Share me (partage de moi) + Charm (charme, attractivité)
    - Logo : compagnon stylisé, esprit Discord/Twitch/Streamlabs (1ère piste : petite mascote un peu nuage/étoile/navy)
    - Monnaie virtuelle : **Shards** (éclats)
    - Univers : partage, communauté, attractivité, gamification

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
    
## Règles de décision

Avant d’ajouter une fonctionnalité :

1. Apporte‑t‑elle visibilité ou confort ?
2. Est‑elle utilisable en < 2 minutes ?
3. Est‑elle compréhensible sans doc ?
   Si une réponse est non → reporter la feature.

## Data et analytics

### KPIs suivis
    - Suivi utilisateurs, profils visibles, liens, streams, pages vues, newsletter
    - Activation rate, engagement liens et planning, funnel integrity, growth semaine/semaine
    - Infrastructure : materialized view Supabase + dashboard admin temps réel

### North Star 
    - Streamers actifs avec planning public → c’est le signal principal pour la rétention et l’engagement.

### Lien avec ma chaine Twitch
    Pour fidéliser tes viewers twitch quand tu auras fait ton système de monnaie virtuelle tu peux aussi proposer d’échanger des points de chaine twitch contre de la monnaie virtuelle

    1 coût = 0
    2 apport de nouveau viewers sur la chaîne et farm gratuit 
    3 augmentation globale de ta visibilité twitch