<template>
  <div class="relative h-160 lg:min-h-0 flex lg:flex-row flex-col">
    <!-- Hero -->
    <div class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1">
      <!-- Texte -->
      <div class="relative flex-1 z-20 flex items-center justify-center">
        <div class="flex items-center justify-center h-full">
          <div
            class="flex w-full flex-col items-center sm:items-start max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
            <h1 class="text-4xl xl:text-5xl font-bold mb-6 leading-tight!">
              <span class="block">Développe ta chaîne</span>
              <span class="block text-purple-500">avec StreamLink</span>
            </h1>
            <p class="text-base md:text-lg text-gray-300 leading-normal mb-2 max-w-xl lg:max-w-none drop-shadow">
              La plateforme tout-en-un pensée pour les streameurs
            </p>
            <p class="text-sm md:text-base text-gray-400 leading-normal mb-8 max-w-xl lg:max-w-none drop-shadow">
              Centralise tes liens, planifie tes streams et découvre de nouveaux créateurs.
            </p>
            <NuxtLink to="/admin/links">
              <button
                class="flex items-center justify-center gap-2 px-6 py-3 text-base md:text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl">
                <span>{{ user ? "Mon StreamLink" : "Créer mon StreamLink" }}</span>
                <Icon name="lucide:arrow-right" size="20" />
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Image -->
      <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
        <div class="absolute lg:hidden inset-0 z-10" />
        <img :src="backgroundImg"
          class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]" />
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div class="px-6 md:px-12 lg:px-20 py-16 text-center">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col items-center gap-2">
        <div class="font-bold text-3xl leading-tight">
          <span>Tout ce dont tu as besoin, </span>
          <span class="text-purple-500">en un seul endroit</span>
        </div>
        <div class="text-gray-400 leading-tight">
          Conçu pour les streameurs qui veulent grandir sans se prendre la tête.
        </div>
      </div>

      <!-- Grid Features -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(feature, index) in features" :key="index"
          class="relative w-full rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30">

          <!-- Badge si présent -->
          <span v-if="feature.badge" class="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full font-medium"
            :class="feature.badge === 'Nouveau'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'bg-zinc-700 text-gray-400'">
            {{ feature.badge }}
          </span>

          <span
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg mx-auto bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg">
            <Icon :name="feature.icon" size="30" />
          </span>

          <div class="flex flex-col gap-2">
            <h3 class="text-xl font-semibold leading-tight">
              {{ feature.title }}
            </h3>
            <p class="text-gray-400 leading-relaxed text-sm">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Final Section -->
  <div class="px-6 md:px-12 lg:px-20 py-20">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        Prêt à développer ta chaîne ?
      </h2>
      <p class="text-lg text-gray-400 mb-8">
        Crée ton StreamLink gratuitement et commence à grandir dès aujourd'hui
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <NuxtLink to="/admin/links">
          <button
            class="bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all px-8 py-4 rounded-lg flex items-center gap-3">
            <span class="text-base md:text-lg font-semibold">
              {{ user ? "Accéder à mon compte" : "Créer mon StreamLink gratuitement" }}
            </span>
            <Icon name="lucide:arrow-right" size="20" />
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- Social Proof Section -->
  <div class="px-6 md:px-12 lg:px-20 py-20 bg-zinc-900/50 border-t border-zinc-800">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-sm text-gray-500 uppercase tracking-wider mb-8">
        Ils nous font déjà confiance
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="text-4xl font-bold text-purple-500 mb-2">{{ totalStreamers }}+</div>
          <div class="text-gray-400">Streameurs actifs</div>
        </div>
        <div>
          <div class="text-4xl font-bold text-purple-500 mb-2">{{ totalLinks }}+</div>
          <div class="text-gray-400">Liens partagés</div>
        </div>
        <div>
          <div class="text-4xl font-bold text-purple-500 mb-2">{{ totalSlots }}+</div>
          <div class="text-gray-400">Streams planifiés</div>
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
    icon: 'lucide:link',
    title: "StreamLink personnalisé",
    description: "Crée ta page personnalisée pour centraliser tous tes liens importants."
  },
  {
    icon: 'lucide:calendar-days',
    title: "Planning de streams",
    description: "Organise tes streams pour que ta communauté soit toujours au courant.",
    badge: "Nouveau"
  },
  {
    icon: 'lucide:layout-dashboard',
    title: "Tableau de bord intuitif",
    description: "Gère tout depuis un seul tableau de bord."
  },
  {
    icon: 'lucide:users',
    title: "Communauté",
    description: "Connecte-toi avec d'autres créateurs et booste ta visibilité.",
  }
]

const streamerStore = useStreamerStore()
const linkStore = useLinkStore()
const scheduleSlotStore = useScheduleSlotStore()
const totalStreamers = ref(0)
const totalLinks = ref(0)
const totalSlots = ref(0)

onMounted(async () => {
  totalStreamers.value = await streamerStore.fetchTotalStreamers()
  totalLinks.value = await linkStore.fetchTotalLinks()
  totalSlots.value = (await scheduleSlotStore.fetchTotalSlots()).data || 0
})
</script>