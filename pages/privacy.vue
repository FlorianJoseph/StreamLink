<template>
    <div class="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-6">

        <!-- Header -->
        <div class="flex flex-col gap-1">
            <h1 class="font-heading text-2xl font-bold text-white">
                Avis de confidentialité et Mentions légales - {{ CURRENT_PRIVACY_VERSION }}
            </h1>
            <p class="text-sm text-muted">Dernière mise à jour : {{ updatedAt }}</p>
        </div>

        <!-- Introduction -->
        <section
            class="rounded-xl border border-white/8 bg-surface-dark p-5 flex flex-col gap-4 text-sm text-muted leading-relaxed">
            <p>Chez Charmi, nous accordons une grande importance à la transparence dans la manière dont vos données
                personnelles sont collectées, utilisées et protégées.</p>
            <p>
                L'utilisation de cette plateforme implique la lecture et l'acceptation de notre
                <a href="#rgpd" class="text-primary hover:underline">Politique de Confidentialité (RGPD)</a>
                et de nos
                <a href="#cgu" class="text-primary hover:underline">Conditions Générales d'Utilisation (CGU)</a>.
            </p>
            <ul class="flex flex-col gap-1.5 pl-4 border-l border-white/8">
                <li><a href="#mentions-legales" class="text-primary hover:underline">Mentions légales</a></li>
                <li><a href="#rgpd" class="text-primary hover:underline">Politique de confidentialité (RGPD)</a></li>
                <li><a href="#cgu" class="text-primary hover:underline">Conditions Générales d'Utilisation (CGU)</a>
                </li>
                <li><a href="#modifications" class="text-primary hover:underline">Modifications</a></li>
                <li><a href="#contact" class="text-primary hover:underline">Contact</a></li>
            </ul>
        </section>

        <!-- Mentions légales -->
        <section id="mentions-legales"
            class="rounded-xl border border-white/8 bg-surface-dark p-5 flex flex-col gap-4 text-sm text-muted leading-relaxed">
            <h2 class="font-heading text-xl font-bold text-white">Mentions
                légales</h2>
            <div class="flex flex-col gap-3">
                <div>
                    <h3 class="font-semibold text-white mb-1">Éditeur et développeur</h3>
                    <p><strong class="text-white">NordiK</strong> (particulier, pseudonyme). <br>Cette application est
                        publiée et maintenue par la personne exploitant le pseudonyme <strong
                            class="text-white">NordiK</strong>.</p>
                </div>
                <div>
                    <h3 class="font-semibold text-white mb-1">Hébergeurs</h3>
                    <p><strong class="text-white">Frontend</strong> : <a href="https://vercel.com/"
                            class="text-primary hover:underline">vercel.com</a><br>
                        <strong class="text-white">Données / stockage</strong> : <a href="https://www.supabase.com/"
                            class="text-primary hover:underline">supabase.com</a>
                    </p>
                    <p class="mt-2">Les données sont hébergées exclusivement dans l'Union Européenne et protégées
                        conformément au RGPD.</p>
                </div>
                <p class="text-muted/70 italic">Si l'activité devient professionnelle, ces mentions seront mises à jour
                    avec les informations légales requises.</p>
            </div>
        </section>

        <!-- Politique de confidentialité (RGPD) -->
        <section id="rgpd"
            class="rounded-xl border border-white/8 bg-surface-dark p-5 flex flex-col gap-4 text-sm text-muted leading-relaxed">
            <h2 class="font-heading text-xl font-bold text-white">Politique
                de confidentialité (RGPD)</h2>
            <ol class="flex flex-col gap-4 list-decimal pl-5">
                <li><span class="font-semibold text-white">Responsable du traitement</span><br>
                    La personne exploitant le pseudonyme <strong class="text-white">NordiK</strong>. Voir rubrique <a
                        href="#contact" class="text-primary hover:underline">Contact</a>.</li>
                <li>
                    <span class="font-semibold text-white">Données collectées</span>
                    <ul class="list-disc pl-4 mt-2 flex flex-col gap-1">
                        <li><strong class="text-white">Compte utilisateur</strong> : pseudo, email et avatar Twitch.
                            L'authentification s'effectue via Twitch et nous ne stockons pas les mots de passe.</li>
                        <li><strong class="text-white">Page publique Charmi</strong> : avatar, pseudo, liens et
                            vignettes partagés.</li>
                        <li>Cookies et outils d'analyse si activés (consentement préalable requis).</li>
                        <li>Informations du formulaire de contact (nom, email, message).</li>
                    </ul>
                </li>
                <li>
                    <span class="font-semibold text-white">Finalités et base légale</span>
                    <ul class="list-disc pl-4 mt-2 flex flex-col gap-1">
                        <li>Gestion des comptes : <strong class="text-white">Exécution du contrat</strong> (art. 6.1.b)
                        </li>
                        <li>Formulaire de contact : <strong class="text-white">Intérêt légitime</strong> (art. 6.1.f)
                        </li>
                        <li>Amélioration du service : <strong class="text-white">Intérêt légitime</strong> (art. 6.1.f)
                        </li>
                        <li>Cookies non essentiels : <strong class="text-white">Consentement</strong> (art. 6.1.a)</li>
                    </ul>
                </li>
                <li>
                    <span class="font-semibold text-white">Tableau synthétique</span>
                    <div class="overflow-x-auto mt-2 rounded-lg border border-white/8">
                        <table class="min-w-full text-xs">
                            <thead>
                                <tr class="border-b border-white/8 bg-white/3">
                                    <th class="p-2 text-left text-white font-semibold">Catégorie</th>
                                    <th class="p-2 text-left text-white font-semibold">Exemples</th>
                                    <th class="p-2 text-left text-white font-semibold">Base légale</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                <tr>
                                    <td class="p-2">Données de compte</td>
                                    <td class="p-2">Pseudo, email, avatar</td>
                                    <td class="p-2">Exécution du contrat (6.1.b)</td>
                                </tr>
                                <tr>
                                    <td class="p-2">Logs de connexion</td>
                                    <td class="p-2">IP, user-agent, timestamps</td>
                                    <td class="p-2">Intérêt légitime (6.1.f)</td>
                                </tr>
                                <tr>
                                    <td class="p-2">Formulaire contact</td>
                                    <td class="p-2">Email, message, nom</td>
                                    <td class="p-2">Intérêt légitime / contrat</td>
                                </tr>
                                <tr>
                                    <td class="p-2">Cookies analytics</td>
                                    <td class="p-2">Données anonymisées</td>
                                    <td class="p-2">Consentement (6.1.a)</td>
                                </tr>
                                <tr>
                                    <td class="p-2">Vignettes / avatars</td>
                                    <td class="p-2">Images uploadées</td>
                                    <td class="p-2">Contrat / droit à l'effacement</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
                <li><span class="font-semibold text-white">Conservation</span><br>Comptes conservés tant qu'actifs.
                    Suppression sur demande sauf conservation limitée pour preuve. Formulaire de contact : 3 ans après
                    le dernier échange.</li>
                <li><span class="font-semibold text-white">Sécurité</span><br>Données protégées par chiffrement, accès
                    restreints et sauvegardes sécurisées.</li>
                <li>
                    <span class="font-semibold text-white">Droits des personnes</span>
                    <ul class="list-disc pl-4 mt-2 flex flex-col gap-1">
                        <li><strong class="text-white">Accès</strong> : obtenir une copie des données</li>
                        <li><strong class="text-white">Rectification</strong> : corriger des données inexactes</li>
                        <li><strong class="text-white">Effacement</strong> : demander la suppression</li>
                        <li><strong class="text-white">Portabilité</strong> : recevoir les données dans un format
                            structuré</li>
                        <li><strong class="text-white">Opposition</strong> : s'opposer aux traitements fondés sur
                            l'intérêt légitime</li>
                    </ul>
                </li>
                <li><span class="font-semibold text-white">Cookies</span><br>Cookies nécessaires activés par défaut.
                    Tout cookie non essentiel requiert le consentement explicite.</li>
                <li><span class="font-semibold text-white">Mineurs</span><br>Service non destiné aux moins de 16 ans.
                    Consentement parental requis sinon.</li>
            </ol>
        </section>

        <!-- CGU -->
        <section id="cgu"
            class="rounded-xl border border-white/8 bg-surface-dark p-5 flex flex-col gap-4 text-sm text-muted leading-relaxed">
            <h2 class="font-heading text-xl font-bold text-white">Conditions
                Générales d'Utilisation (CGU)</h2>
            <ol class="flex flex-col gap-4 list-decimal pl-5">
                <li><span class="font-semibold text-white">Objet</span><br>Les présentes CGU définissent les conditions
                    d'accès et d'utilisation de la plateforme éditée par <strong class="text-white">NordiK</strong>.
                </li>
                <li><span class="font-semibold text-white">Accès et inscription</span><br>L'accès à certaines
                    fonctionnalités nécessite un compte Twitch.</li>
                <li>
                    <span class="font-semibold text-white">Comportement attendu</span>
                    <ul class="list-disc pl-4 mt-2 flex flex-col gap-1">
                        <li>Respect des autres utilisateurs : pas d'insultes, harcèlement ou propos illégaux</li>
                        <li>Pas d'usurpation d'identité</li>
                        <li>Pas de contenu portant atteinte aux droits d'un tiers</li>
                    </ul>
                </li>
                <li><span class="font-semibold text-white">Usage abusif</span><br>Toute tentative d'accès non autorisé,
                    scraping ou attaque peut entraîner suspension et poursuites.</li>
                <li><span class="font-semibold text-white">Modération</span><br>L'éditeur peut supprimer tout contenu
                    violant les CGU et sanctionner les utilisateurs en infraction.</li>
                <li><span class="font-semibold text-white">Propriété intellectuelle</span><br>Les contenus publiés
                    restent la propriété de leurs auteurs. Une licence non exclusive est accordée à la plateforme pour
                    afficher le contenu.</li>
                <li><span class="font-semibold text-white">Suppression de compte</span><br>Demande possible à tout
                    moment via <a href="#contact" class="text-primary hover:underline">Contact</a>.</li>
                <li><span class="font-semibold text-white">Responsabilité</span><br>L'éditeur n'est pas responsable des
                    contenus publiés par les utilisateurs ni des dommages indirects.</li>
                <li><span class="font-semibold text-white">Litiges</span><br>Loi française applicable. Tribunaux du lieu
                    du domicile du défendeur.</li>
            </ol>
        </section>

        <!-- Modifications -->
        <section id="modifications"
            class="rounded-xl border border-white/8 bg-surface-dark p-5 flex flex-col gap-3 text-sm text-muted leading-relaxed">
            <h2 class="font-heading text-xl font-bold text-white">
                Modifications</h2>
            <p>Nous pouvons mettre à jour cet avis de temps à autre. Les changements importants seront signalés aux
                utilisateurs. La date de dernière mise à jour est indiquée en haut de page.</p>
        </section>

        <!-- Contact -->
        <section id="contact"
            class="rounded-xl border border-white/8 bg-surface-dark p-5 flex flex-col gap-3 text-sm text-muted leading-relaxed">
            <h2 class="font-heading text-xl font-bold text-white">Contact
            </h2>
            <ul class="flex flex-col gap-2 pl-4 border-l border-white/8">
                <li>Via le <NuxtLink to="/contact" class="text-primary hover:underline">formulaire de contact</NuxtLink>
                </li>
                <li>Par email : <a href="mailto:nordik.contact@gmail.com"
                        class="text-primary hover:underline">nordik.contact@gmail.com</a></li>
                <li>Via la page Charmi : <a href="https://www.charmi.app/NordiK_Saga" target="_blank"
                        class="text-primary hover:underline">charmi.gg/NordiK_Saga</a></li>
                <li>Via Discord : <a href="https://discord.gg/fVFguWc76b" target="_blank"
                        class="text-primary hover:underline">discord.gg/charmi</a></li>
            </ul>
        </section>
    </div>
</template>

<script setup>
const updatedAt = "03 Mai 2026"

import { CURRENT_PRIVACY_VERSION } from '~/constants/legal'

definePageMeta({
    layout: 'auth'
})
</script>