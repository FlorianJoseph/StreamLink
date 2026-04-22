# CLAUDE.md — Charmi (StreamLink)

## Projet

Charmi est une plateforme pour streamers Twitch débutants à intermédiaires. Elle centralise liens, planning de live et visibilité dans un espace simple et partageable.

- **Stack** : Nuxt 3, TypeScript, Tailwind CSS, Supabase, PrimeVue, Resend, React Email, Stripe
- **Repo** : StreamLink (rebranding en cours vers Charmi)

## Design & UI

Lire `.impeccable.md` avant tout travail UI. C'est la source de vérité design Charmi.

## Skills disponibles

Invoquer la skill adaptée avant de commencer :

| Situation | Skill |
|---|---|
| Démarrer une nouvelle feature | `.claude/skills/shape/` |
| Construire une UI | `.claude/skills/impeccable/` |
| Vérifier la rigueur UX | `.claude/skills/ui-ux-pro-max/` |
| Exécution créative Tailwind | `.claude/skills/frontend-design/` |
| Planifier une implémentation | `.claude/skills/writing-plans/` |
| Passe finale avant ship | `.claude/skills/polish/` |
| Review UX d'une page | `.claude/skills/critique/` |
| Diagnostiquer un bug | `.claude/skills/systematic-debugging/` |

## Architecture

- `pages/` → routes Nuxt (dont `pages/admin/` pour le dashboard admin)
- `components/` → composants Vue réutilisables
- `composables/` → logique métier réutilisable
- `utils/` → utilitaires côté client
- `server/api/` → endpoints API Nuxt
- `server/utils/` → utilitaires côté serveur
- `assets/` → styles globaux, fonts

## Supabase

- Auth via `useSupabaseClient()` et `useSupabaseUser()`
- UTM tracking : attendre la résolution de l'auth avant d'envoyer des events analytics
- RLS activé sur toutes les tables sensibles
- Materialized view pour le dashboard admin analytics (ne pas remplacer par des requêtes directes)

## Conventions

- TypeScript strict — pas de `any`
- Composables pour toute logique réutilisable
- Nommage : `camelCase` pour les variables, `PascalCase` pour les composants
- Commits en français ou anglais, messages clairs et courts
- Toujours vérifier les cas edge : empty state, loading, erreur

## Règles produit

Avant d'ajouter ou modifier une feature :
1. Apporte-t-elle visibilité ou confort à l'utilisateur ?
2. Est-elle utilisable en moins de 2 minutes ?
3. Est-elle compréhensible sans documentation ?

Si une réponse est non → ne pas implémenter, en discuter d'abord.

## Contexte métier clé

- **Page publique** : profil partageable type Linktree — liens stylisés, statut live, planning, stats basiques
- **Planning** : gestion des créneaux de stream — ajout/modification, export, personnalisation visuelle
- **Découverte** : mise en relation des streamers, layout Netflix par genres, vue live, section "Parfaits pour raid", Top Raiders, Raid Assistant
- **Dashboard** : guide de quêtes essentielles/optionnelles, accès rapide aux outils, progression streamer
- **Newsletter** : segments automatiques, templates React Email, email de bienvenue auto
- **Streamers similaires** : scoring jeux/horaires/langue/live, widget affiché sur la page publique
- **Charm** : monnaie virtuelle de la plateforme (anciennement Coins)
- **Raids** : lancer un raid depuis la Découverte, récompense en Charm selon viewers, restrictions anti-farm (1/jour, 4/semaine, pas le même streamer 2x), annulation possible
- **Premium** : abonnement 7,99€/mois via Stripe, features à durée limitée (7j/30j), cron quotidien 6 Charm/jour pour abonnés actifs
- **Badge vérifié** : affiché sur la card Découverte et le profil public pour les abonnés actifs
- **Admin** : dashboard analytique, segments newsletter, historique envois

## Roadmap active

- Stats avancées
- Background gradient/image/animé
- Mise en avant sur la Découverte
- Sync Twitch automatique
- Export Discord (bot)
- Catégories de liens (premium)