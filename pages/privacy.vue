<template>
    <!-- En-tête -->
    <div class="py-4">
        <div class="flex flex-col items-center sm:h-12 justify-end">
            <!-- Titre -->
            <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center">
                Avis de confidentialité et Mentions légales
            </h1>
            <!-- Sous-titre -->
            <p class="text-sm sm:text-base text-center max-w-xl">
                Dernière mise à jour : {{ updatedAt }}
            </p>
        </div>
    </div>
    <!-- Contenu principal -->
    <div class="max-w-4xl mx-auto sm:px-6 pb-12 space-y-4">
        <Card>
            <template #content>
                <p>Chez StreamLink, nous accordons une grande importance à la transparence dans la manière dont vos
                    données personnelles sont collectées, utilisées et protégées. Cet avis de confidentialité vous
                    explique
                    clairement nos pratiques ainsi que vos droits concernant vos informations.</p>
                <br />
                <p>L'utilisation de cette plateforme implique la lecture et l'acceptation de notre
                    <a href="#rgpd" class="text-blue-500 hover:underline">Politique de Confidentialité (RGPD)</a>
                    et de nos
                    <a href="#cgu" class="text-blue-500 hover:underline">Conditions Générales d'Utilisation (CGU)</a>.
                    En accédant à StreamLink, vous consentez donc à ces conditions.
                </p>
                <br />
                <p>Nous vous recommandons de lire cet Avis de Confidentialité dans son intégralité pour être
                    pleinement
                    informé. Cependant, si vous souhaitez accéder directement à une section spécifique, vous pouvez
                    naviguer
                    via
                    le sommaire ou les sections prévues à cet effet. Cliquez sur le lien correspondant ci-dessous pour y
                    accéder.
                </p>
                <!-- Sommaire -->
                <ul class="list-disc list-inside space-y-2 mt-4">
                    <li><a href="#mentions-legales" class="text-blue-500 hover:underline">Mentions légales</a></li>
                    <li><a href="#rgpd" class="text-blue-500 hover:underline">Politique de confidentialité (RGPD)</a>
                    </li>
                    <li><a href="#cgu" class="text-blue-500 hover:underline">Conditions Générales d'Utilisation
                            (CGU)</a>
                    </li>
                    <li><a href="#modifications" class="text-blue-500 hover:underline">Modifications apportées au
                            présent
                            Avis de confidentialité</a></li>
                    <li><a href="#contact" class="text-blue-500 hover:underline">Contact</a></li>
                </ul>
            </template>
        </Card>
        <!-- Mentions légales -->
        <Card id="mentions-legales">
            <template #content>
                <h2 class="text-xl sm:text-2xl md:text-2xl font-bold text-center sm:text-left mb-4">Mentions légales
                </h2>
                <h3 class="text-lg font-semibold mb-1">Éditeur et développeur :</h3>
                <p class="mb-4"><strong>NordiK</strong> (particulier, pseudonyme).<br>
                    Cette application est publiée et maintenue par la personne exploitant le pseudonyme
                    <strong>NordiK</strong>.
                </p>
                <h3 class="text-lg font-semibold mb-1">Hébergeurs :</h3>
                <p> <strong>Frontend</strong> : <a href="https://vercel.com/"
                        class="text-blue-500 hover:underline">vercel.com</a><br>
                    <strong>Données utilisateurs / stockage</strong> : <a href="https://www.supabase.com/"
                        class="text-blue-500 hover:underline">supabase.com</a>
                </p>
                <p class="mb-4">
                    Les données sont hébergées exclusivement dans l'Union Européenne et protégées conformément au RGPD.
                </p>

                <p><em>Remarque :</em> Si l'activité devient professionnelle (auto-entrepreneur / société), ces mentions
                    seront mises à jour afin d'intégrer les informations légales requises (RCS / SIREN / adresse
                    physique).
                </p>
            </template>
        </Card>

        <!-- Politique de confidentialité (RGPD) -->
        <Card id="rgpd">
            <template #content>
                <h2 class="text-xl sm:text-2xl md:text-2xl font-bold text-center sm:text-left mb-4">Politique de
                    confidentialité (RGPD)</h2>
                <ol class="list-decimal pl-6 space-y-2">
                    <li class="font-semibold text-lg">Responsable du traitement</li>
                    <p>Le responsable du traitement est la personne exploitant le pseudonyme <strong>NordiK</strong>
                        (particulier). Pour toute question relative aux données personnelles, voir la rubrique <a
                            href="#contact" class="text-blue-500 hover:underline">Contact</a>.</p>


                    <li class="font-semibold text-lg">Données collectées</li>
                    <ul class="list-disc list-inside">
                        <li>
                            <strong>Compte utilisateur</strong> : pseudo, email et avatar de Twitch.
                            <br><em>Remarque :</em> L'authentification s'effectue via Twitch, nous ne collectons ni
                            stockons
                            les mots de passe.
                        </li>
                        <li><strong>Page publique StreamLink</strong> : Avatar, pseudo, liens et vignettes associées
                            partagées par l'utilisateur.</li>
                        <li>Cookies et outils d'analyse si activés (consentement préalable requis).</li>
                        <li>Informations renseignées volontairement via le formulaire de contact (nom, email, message).
                        </li>
                    </ul>

                    <li class="font-semibold text-lg">Finalités et base légale</li>
                    <ul class="list-disc list-inside">
                        <li>Gestion des comptes et authentification : <strong>Exécution du contrat</strong> (article
                            6.1.b
                            RGPD).</li>
                        <li>Réponse aux messages via le formulaire : <strong>Intérêt légitime</strong> (article 6.1.f
                            RGPD).
                        </li>
                        <li>Amélioration du service et détection d'abus : <strong>Intérêt légitime</strong> (article
                            6.1.f
                            RGPD).</li>
                        <li>Cookies non essentiels (analytics, publicité) : <strong>Consentement</strong> (article 6.1.a
                            RGPD).</li>
                    </ul>

                    <!-- Tableau synthétique des bases légales -->
                    <div class="mt-4">
                        <h4 class="font-semibold">Synthèse & bases légales par catégorie de données</h4>
                        <div class="overflow-x-auto mt-2">
                            <table class="min-w-full text-sm border border-gray-200">
                                <thead>
                                    <tr class="text-left bg-gray-600">
                                        <th class="p-1 border align-middle text-center">Catégorie de données</th>
                                        <th class="p-1 border align-middle text-center">Exemples</th>
                                        <th class="p-1 border align-middle text-center">Base légale</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="p-1 border align-top">Données de compte</td>
                                        <td class="p-1 border align-top">Pseudo, email, avatar (via Twitch)</td>
                                        <td class="p-1 border align-top">Exécution du contrat (article 6.1.b)</td>
                                    </tr>
                                    <tr>
                                        <td class="p-1 border align-top">Données de connexion / logs</td>
                                        <td class="p-1 border align-top">IP, user-agent, timestamps</td>
                                        <td class="p-1 border align-top">Intérêt légitime - sécurité et prévention des
                                            abus
                                            (article 6.1.f)</td>
                                    </tr>
                                    <tr>
                                        <td class="p-1 border align-top">Formulaire de contact</td>
                                        <td class="p-1 border align-top">Email, message, nom </td>
                                        <td class="p-1 border align-top">Intérêt légitime ou exécution du contrat</td>
                                    </tr>
                                    <tr>
                                        <td class="p-1 border align-top">Cookies analytics</td>
                                        <td class="p-1 border align-top">Données d'usage anonymisées</td>
                                        <td class="p-1 border align-top">Consentement (article 6.1.a)</td>
                                    </tr>
                                    <tr>
                                        <td class="p-1 border align-top">Vignettes et avatars</td>
                                        <td class="p-1 border align-top">Images téléchargées par l'utilisateur</td>
                                        <td class="p-1 border align-top">Exécution du contrat pour affichage,
                                            suppression
                                            sur
                                            demande (droit à l'effacement)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <li class="font-semibold text-lg">Conservation des données</li>
                    <p>Les durées ci‑dessous sont indicatives et peuvent être adaptées selon obligations légales :</p>
                    <ul class="list-disc list-inside">
                        <li><strong>Comptes utilisateurs</strong> : conservés tant que le compte existe. En cas de
                            suppression, les données
                            personnelles (email, page publique StreamLink, avatar et vignettes) sont supprimées sauf
                            conservation limitée pour
                            preuve en cas de litige.</li>
                        <li><strong>Avatars et Vignettes de liens publiques</strong> : conservés tant que l'utilisateur
                            ne
                            demande pas leur
                            suppression. Si un avatar ou une vignette contient des données personnelles, ils seront
                            supprimés sur demande.
                            <br><em>Remarque : </em>Par défaut, l'application supprime l'ancienne image au
                            remplacement pour
                            limiter
                            la conservation
                        </li>

                        <li><strong>Données de contact (formulaire)</strong> : 3 ans après le dernier échange, sauf
                            demande
                            de
                            suppression.</li>
                    </ul>

                    <li class="font-semibold text-lg">Sécurité</li>
                    <p>Vos données sont protégées par chiffrement, accès restreints et sauvegardes sécurisées. Seule
                        l’administrateur du service (NordiK) peut y accéder si nécessaire</p>

                    <li class="font-semibold text-lg">Droits des personnes</li>
                    <p>Conformément au RGPD, toute personne dispose des droits suivants :</p>
                    <ul class="list-disc list-inside">
                        <li><strong>Droit d'accès</strong> : obtenir une copie des données la concernant.</li>
                        <li><strong>Droit de rectification</strong> : corriger des données inexactes.</li>
                        <li><strong>Droit à l'effacement</strong> : demander la suppression des données.</li>
                        <li><strong>Droit à la portabilité</strong> : recevoir les données fournies dans un format
                            structuré.</li>
                        <li><strong>Droit d'opposition</strong> : s'opposer à des traitements fondés sur l'intérêt
                            légitime.
                        </li>
                    </ul>

                    <li class="font-semibold text-lg">Cookies et traceurs</li>
                    <p>Les cookies strictement nécessaires au fonctionnement du service sont activés par défaut. Tout
                        cookie
                        non
                        essentiel (analytics, publicité) requiert le consentement explicite. Un bandeau de cookies et
                        des
                        paramètres seront présentés lors de la première visite si ces outils sont activés.</p>

                    <li class="font-semibold text-lg">Mineurs</li>
                    <p>Le service n'est pas destiné aux mineurs de moins de 16 ans. Si un mineur souhaite utiliser le
                        service,
                        le consentement parental requis devra être obtenu ; sinon, les comptes seront supprimés sur
                        demande.
                    </p>

                    <li class="font-semibold text-lg">Modifications</li>
                    <p>La présente politique peut être mise à jour. La date de dernière mise à jour sera indiquée en
                        haut de
                        la
                        page. Les changements substantiels seront signalés aux utilisateurs.</p>
                </ol>
            </template>
        </Card>
        <!-- </section> -->

        <!-- CGU -->
        <Card id="cgu">
            <template #content>
                <h2 class="text-xl sm:text-2xl md:text-2xl font-bold text-center sm:text-left mb-4">Conditions Générales
                    d'Utilisation (CGU)</h2>
                <ol class="list-decimal pl-6 space-y-2">
                    <li class="font-semibold text-lg">Objet</li>
                    <p>Les présentes CGU définissent les conditions d'accès et d'utilisation de la plateforme
                        communautaire
                        éditée par le pseudonyme <strong>NordiK</strong>.</p>

                    <li class="font-semibold text-lg">Lien avec le RGPD et contact</li>
                    <p>L'utilisation du service implique la lecture et l'acceptation de la <a href="#contact"
                            class="text-blue-500 hover:underline">Politique de Confidentialité
                            (RGPD).</a>
                        Pour toute question concernant vos données personnelles, vos droits, ou pour exercer vos droits,
                        merci d'utiliser la rubrique <a href="#contact" class="text-blue-500 hover:underline">
                            Contact</a>.
                    </p>

                    <li class="font-semibold text-lg">Accès et inscription</li>
                    <p>L'accès à certaines fonctionnalités nécessite un compte Twitch. L'utilisateur s'engage à mettre à
                        jour
                        ses données.</p>

                    <li class="font-semibold text-lg">Comportement attendu</li>
                    <ul>
                        <li>Respect des autres utilisateurs : pas d'insultes, harcèlement, propos racistes,
                            pornographiques
                            ou
                            illégaux.</li>
                        <li>Pas d'usurpation d'identité.</li>
                        <li>Pas de contenu portant atteinte aux droits d'un tiers (copyright, marque).</li>
                    </ul>

                    <li class="font-semibold text-lg">Sécurité et usage abusif</li>
                    <p>Toute tentative d’accès non autorisé, scraping, automatisation ou attaque visant la plateforme
                        peut
                        entraîner
                        la suspension immédiate du compte et éventuellement des poursuites légales.</p>

                    <li class="font-semibold text-lg">Modération</li>
                    <p>L'éditeur se réserve le droit de supprimer tout contenu violant les présentes CGU ou la loi, et
                        de
                        sanctionner (suspension / suppression de compte) les utilisateurs en infraction.</p>

                    <li class="font-semibold text-lg">Propriété intellectuelle</li>
                    <p>Les contenus fournis par les utilisateurs restent la propriété de leurs auteurs ; en publiant,
                        l'utilisateur accorde à la plateforme une licence non exclusive pour afficher et indexer le
                        contenu.
                    </p>

                    <li class="font-semibold text-lg">Résiliation et suppression de compte</li>
                    <p>L'utilisateur peut demander à tout moment la suppression de son compte et de ses données
                        personnelles
                        via la rubrique <a href="#contact" class="text-blue-500 hover:underline">Contact</a>.
                        L’éditeur se réserve également le droit de résilier un compte en cas de violation des CGU ou de
                        la
                        loi.</p>


                    <li class="font-semibold text-lg">Responsabilité</li>
                    <p>L'éditeur n'est pas responsable des contenus publiés par les utilisateurs ni des dommages
                        indirects
                        liés
                        à l'utilisation du service. En cas d'abus avéré, l'éditeur peut coopérer avec les autorités
                        compétentes.
                    </p>

                    <li class="font-semibold text-lg">Modification des CGU</li>
                    <p>Les CGU peuvent être modifiées. Les utilisateurs seront informés en cas de changements
                        importants.
                    </p>

                    <li class="font-semibold text-lg">Litiges</li>
                    <p>En cas de litige, et sauf disposition contraire impérative, la loi française s'applique. Les
                        tribunaux
                        compétents seront ceux du lieu du domicile du défendeur.</p>
                </ol>
            </template>
        </Card>

        <Card id="modifications">
            <template #content>
                <h2 class="text-xl sm:text-2xl md:text-2xl font-bold text-center sm:text-left mb-4">Modifications
                    apportées au présent Avis de confidentialité</h2>
                <p class="mb-2">
                    Nous sommes susceptibles de mettre à jour notre Avis de confidentialité de temps à autre en fonction
                    de l'évolution des aspects juridiques, techniques ou commerciaux. Lors de cette mise à jour, nous
                    prendrons les mesures appropriées pour vous informer, en fonction de l'importance des modifications
                    apportées. Nous obtiendrons votre consentement pour toute modification importante de notre Avis de
                    confidentialité si la législation applicable en matière de protection des données l'exige.
                </p>
                <p>Vous pouvez voir quand cet avis de confidentialité a été mis à jour pour la dernière fois en
                    vérifiant la date de « dernière mise à jour » affichée en haut de cet avis de confidentialité.</p>
            </template>
        </Card>

        <!-- Contact -->
        <Card id="contact">
            <template #content>
                <h2 class="text-xl sm:text-2xl md:text-2xl font-bold text-center sm:text-left mb-4">Contact</h2>
                <p class="mb-2">Pour toute question relative aux présentes mentions légales, à la politique de
                    confidentialité ou aux
                    conditions générales d'utilisation, veuillez nous contacter : </p>
                <ul class="list-disc list-inside">
                    <li>Via le formulaire de contact disponible sur cette page :
                        <NuxtLink to="/contact">
                            <a class="text-blue-500 hover:underline">Formulaire de contact</a>
                        </NuxtLink>
                    </li>
                    <li>Par email : nordik.contact@gmail.com
                    </li>
                    <li>Via les réseaux sociaux associés au pseudonyme <strong>NordiK</strong> : <a
                            href="https://www.stream-link.fr/NordiK_Saga" target="_blank"
                            class="text-blue-500 hover:underline">stream-link.fr/NordiK_Saga</a>
                    </li>
                </ul>
            </template>
        </Card>
    </div>
</template>

<script setup>
const updatedAt = "28 Octobre 2025"

definePageMeta({
    layout: 'auth'
})
</script>