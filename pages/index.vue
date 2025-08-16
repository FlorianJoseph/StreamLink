<template>

  <!-- 1st section -->
  <div class="relative h-100 lg:min-h-0 bg-surface-0 dark:bg-surface-900 flex lg:flex-row flex-col">
    <div class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1">
      <div class="relative flex-1 z-20 flex items-center justify-center">
        <div class="flex items-center justify-center h-full">
          <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
            <h1
              class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-6 leading-tight!">
              <span class="block">Développe ta chaîne</span>
              <span class="block text-primary">avec StreamHub</span>
            </h1>
            <p
              class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none">
              StreamHub est un outil tout-en-un pensé pour les petits créateurs et streameurs.
              Gère ta communauté, suis tes performances et trouve des moyens simples de grandir sur Twitch.
            </p>

            <div class="flex items-center gap-4 justify-center lg:justify-start">
              <Button label="Commencer" severity="help" />
              <Button label="Découvrir" severity="help" outlined />
            </div>
          </div>
        </div>
      </div>
      <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
        <div class="absolute lg:hidden inset-0 bg-surface-900/60 dark:bg-surface-900/80 z-10" />
        <img
          src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/sign/images/blog_og-image.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NDMzZjlmNi01NGMzLTQxNzQtYmY0ZC01YzVjZDliNmI2MjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvYmxvZ19vZy1pbWFnZS5hdmlmIiwiaWF0IjoxNzU1MzU1NDExLCJleHAiOjMzMzIxNTU0MTF9.YhBw8BaUN1jQlBJIlZMryn2-2ef5yd4uOLC_4KqPjHc"
          alt="hero-1" class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]" />
      </div>
    </div>
  </div>

  <!-- Features section -->
  <div class="bg-surface-0 dark:bg-surface-950 px-6 md:px-12 lg:px-20 py-20 text-center">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col items-center gap-4">
        <div class="font-bold text-3xl leading-tight">
          <span class="text-surface-900 dark:text-surface-0">Un seul outil, </span>
          <span class="text-primary-500 dark:text-primary-400">tous tes besoins</span>
        </div>
        <div class="text-surface-500 dark:text-surface-400 leading-tight">
          Conçu pour les petits streamers qui veulent grandir sans se prendre la tête.
        </div>
      </div>
      <!-- Boucle -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(feature, index) in features" :key="index" class="w-full rounded-md p-4">
          <span
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto bg-purple-600">
            <span v-html="svgIcons[feature.icon]" />
          </span>
          <div class="flex flex-col gap-1">
            <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">
              {{ feature.title }}
            </div>
            <p class="text-surface-500 dark:text-surface-400 leading-normal">
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
  ChartColumn: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column-icon lucide-chart-column"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
  Users: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>',
  Blocks: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-blocks-icon lucide-blocks"><path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2"/><rect x="14" y="2" width="8" height="8" rx="1"/></svg>',
  LockKeyhole: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-keyhole-icon lucide-lock-keyhole"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>',
  Earth: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-earth-icon lucide-earth"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/><path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/><circle cx="12" cy="12" r="10"/></svg>',
  Wallet: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet-icon lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>'
};

const features = [
  {
    icon: 'ChartColumn',
    title: "Statistiques simplifiées",
    description: "Suis ta progression, tes viewers, subs et moments forts en un coup d’œil."
  },
  {
    icon: "Users",
    title: "Gestion de communauté",
    description: "Centralise tes échanges et garde un lien fort avec tes viewers les plus fidèles."
  },
  {
    icon: "Blocks",
    title: "Intégrations utiles",
    description: "Connecte ton Discord, Twitch et plus encore pour automatiser ton organisation."
  },
  {
    icon: "Earth",
    title: "Fidélisation des viewers",
    description: "Récompense tes spectateurs les plus actifs et motive-les à revenir."
  },
  {
    icon: "Wallet",
    title: "Monétisation simplifiée",
    description: "Mets en avant tes objectifs et rends les dons et subs plus clairs pour ta commu."
  },
  {
    icon: "LockKeyhole",
    title: "Tout en sécurité",
    description: "Connexion sécurisée, données protégées : on s’occupe de la technique, toi du fun."
  }
]
</script>