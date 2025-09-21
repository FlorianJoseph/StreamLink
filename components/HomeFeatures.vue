<template>
    <div class="px-6 md:px-12 lg:px-20 py-20 text-center">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center gap-2">
                <div class="font-bold text-3xl leading-tight">
                    <span>Un seul outil, </span>
                    <span class="text-purple-500">tous tes besoins</span>
                </div>
                <div class="leading-tight">
                    Conçu pour les petits streamers qui veulent grandir sans se prendre la tête.
                </div>
            </div>
            <!-- Boucle -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="(feature, index) in features" :key="index" class="w-full rounded-md p-4">
                    <span
                        class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg mx-auto bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                        <span v-html="svgIcons[feature.icon]" />
                    </span>

                    <div class="flex flex-col gap-1">
                        <div class="text-xl font-medium leading-tight">
                            {{ feature.title }}
                        </div>
                        <p class="leading-relaxed">
                            {{ feature.description }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const svgIcons = {
    Sprout: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout-icon lucide-sprout"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg>',
    Link: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    Users: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>',
};

const features = [
    {
        icon: 'Sprout',
        title: "Développement simplifié",
        description: "Des outils clairs et efficaces pour t’aider à grandir sans te disperser."
    },
    {
        icon: 'Link',
        title: "Streamlink personnalisé",
        description: "Crée ta page personnalisée pour centraliser tous tes liens importants."
    },
    {
        icon: 'Users',
        title: "Communauté et Collaboration",
        description: "Connecte-toi facilement avec d’autres créateurs et booste ta visibilité."
    }
    // {
    //     icon: "Users",
    //     title: "Gestion de communauté",
    //     description: "Centralise tes échanges et garde un lien fort avec tes viewers les plus fidèles."
    // },
    // {
    //     icon: "Blocks",
    //     title: "Intégrations utiles",
    //     description: "Connecte ton Discord, Twitch et plus encore pour automatiser ton organisation."
    // },
    // {
    //     icon: "Earth",
    //     title: "Fidélisation des viewers",
    //     description: "Récompense tes spectateurs les plus actifs et motive-les à revenir."
    // },
    // {
    //     icon: "Wallet",
    //     title: "Monétisation simplifiée",
    //     description: "Mets en avant tes objectifs et rends les dons et subs plus clairs pour ta commu."
    // },
    // {
    //     icon: "LockKeyhole",
    //     title: "Tout en sécurité",
    //     description: "Connexion sécurisée, données protégées : on s’occupe de la technique, toi du fun."
    // }
]
</script>