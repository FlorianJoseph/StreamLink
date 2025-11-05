<template>
  <NotificationBanner />
  <div class="relative h-160 lg:min-h-0 flex lg:flex-row flex-col">
    <div class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1">
      <div class="relative flex-1 z-20 flex items-center justify-center">
        <div class="flex items-center justify-center h-full">
          <div
            class="flex w-full flex-col items-center sm:items-start max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
            <h1 class="text-4xl xl:text-5xl font-bold mb-6 leading-tight!">
              <span class="block">Développe ta chaîne</span>
              <span class="block text-purple-500">avec StreamLink</span>
            </h1>
            <p class="text-lg md:text-xl leading-normal mb-8 max-w-xl lg:max-w-none">
              StreamLink est un outil pensé pour les streameurs.
            </p>
            <NuxtLink to="/admin">
              <button
                class="flex items-center justify-center gap-2 px-5 py-3 text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <span>{{ user ? "Modifier mon StreamLink" : "Créer mon StreamLink"
                }}</span>
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
        <div class="absolute lg:hidden inset-0 z-10" />
        <img :src="backgroundImg"
          class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]" />
      </div>
    </div>
  </div>
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
            <Icon :name=feature.icon size="30" />
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
definePageMeta({
  layout: 'landing'
})

const user = useSupabaseUser()
const backgroundImg = "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/sign/images/arriere-plan-lignes-violettes-dynamiques-gradient_23-2148995757.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NDMzZjlmNi01NGMzLTQxNzQtYmY0ZC01YzVjZDliNmI2MjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvYXJyaWVyZS1wbGFuLWxpZ25lcy12aW9sZXR0ZXMtZHluYW1pcXVlcy1ncmFkaWVudF8yMy0yMTQ4OTk1NzU3LmpwZyIsImlhdCI6MTc2MDg3NDE5NSwiZXhwIjoxNzkyNDEwMTk1fQ.AgXqRJ--nS8npOmJ5mzmaeHEQL1U7FgBs3ZtFpOuC-s"


const features = [
  {
    icon: 'lucide:sprout',
    title: "Développement simplifié",
    description: "Des outils clairs et efficaces pour t’aider à grandir sans te disperser."
  },
  {
    icon: 'lucide:link',
    title: "Streamlink personnalisé",
    description: "Crée ta page personnalisée pour centraliser tous tes liens importants."
  },
  {
    icon: 'lucide:users',
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