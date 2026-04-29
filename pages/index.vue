<template>
  <!-- HERO -->
  <section class="relative overflow-hidden bg-dark min-h-[480px] md:min-h-[580px] flex items-center">

    <div
      class="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 grid lg:grid-cols-[1fr_380px] gap-12 items-center">
      <!-- Texte -->
      <div class="flex flex-col items-start gap-6">

        <h1 class="text-[clamp(2.5rem,5vw,4rem)] text-white leading-[1.1] max-w-xl">
          Ton compagnon pour<br>
          <span class="text-accent">grandir</span> sur Twitch.
        </h1>

        <p class="text-muted text-lg leading-relaxed max-w-md">
          Crée ta page de liens et ton planning à partager.<br>
          Raid et fais-toi découvrir, même hors live.
        </p>

        <div class="flex flex-wrap gap-3 pt-1">
          <NuxtLink to="/admin/links"
            class="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors duration-150 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark">
            {{ user ? 'Voir ma page' : 'Créer ma page gratuitement' }}
          </NuxtLink>
          <NuxtLink to="/discover"
            class="px-5 py-2.5 border border-white/15 text-white font-medium rounded-xl hover:bg-white/5 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-dark">
            Découvrir
          </NuxtLink>
        </div>
      </div>

      <!-- Mascotte -->
      <div class="hidden lg:flex items-center justify-center relative">
        <div class="absolute w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <img src="/images/mascotte/charmi-happy-violet.svg" alt="Charmi" class="relative w-56 h-56 drop-shadow-2xl" />
      </div>
    </div>
  </section>

  <!-- SOCIAL PROOF -->
  <section class="bg-surface-darker border-y border-white/5 py-5">
    <div class="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
      <span>
        <strong class="text-accent tabular-nums">
          <template v-if="!stats[0].loaded || stats[0].error">—</template>
          <template v-else>{{ animatedStats[0] }}+</template>
        </strong> streamers actifs
      </span>
      <span class="text-white/10">|</span>
      <span>
        <strong class="text-accent tabular-nums">
          <template v-if="!stats[1].loaded || stats[1].error">—</template>
          <template v-else>{{ animatedStats[1] }}+</template>
        </strong> liens partagés
      </span>
      <span class="text-white/10">|</span>
      <span>
        <strong class="text-accent tabular-nums">
          <template v-if="!stats[2].loaded || stats[2].error">—</template>
          <template v-else>{{ animatedStats[2] }}+</template>
        </strong> streams planifiés
      </span>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="bg-dark px-6 md:px-12 lg:px-16 py-20">
    <div class="max-w-7xl mx-auto flex flex-col gap-12">
      <h2 class="text-white text-[clamp(1.75rem,3vw,2.5rem)] leading-tight max-w-lg">
        Ce que Charmi t'apporte
      </h2>

      <div class="grid lg:grid-cols-2 gap-4">
        <!-- Feature principale -->
        <div class="bg-surface-dark rounded-2xl p-8 flex flex-col gap-5 lg:row-span-2">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Icon name="lucide:link" size="18" class="text-primary" />
            </div>
            <span class="text-xs font-medium text-muted uppercase tracking-wider">Page de liens</span>
          </div>
          <h3 class="text-white text-2xl font-bold leading-tight">Ta page perso,<br>prête en 2 minutes</h3>
          <p class="text-muted leading-relaxed">
            Centralise tes liens, affiche ton planning, personnalise l'apparence, une seule URL à partager partout. Ton
            statut live s'affiche automatiquement.
          </p>
        </div>

        <!-- Features secondaires -->
        <div v-for="feature in secondaryFeatures" :key="feature.title"
          class="bg-surface-dark rounded-2xl p-6 flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Icon :name="feature.icon" size="18" class="text-primary" />
            </div>
            <h3 class="text-white font-bold">{{ feature.title }}</h3>
          </div>
          <p class="text-muted text-sm leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA FINAL -->
  <section class="relative overflow-hidden bg-primary px-6 md:px-12 lg:px-16 py-24">
    <img src="/images/assets/charmi-pattern-blanc.svg"
      class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none" aria-hidden="true"
      loading="lazy" />
    <div
      class="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      <div class="flex flex-col gap-3">
        <h2 class="text-white text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">
          Lance-toi.<br>
          <span class="text-white/50 text-xl italic font-normal">Keep on streaming.</span>
        </h2>
      </div>
      <NuxtLink to="/admin/links"
        class="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-primary hover:bg-white/90 font-semibold rounded-xl transition-colors duration-150 whitespace-nowrap
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
        {{ user ? "Voir ma page" : "Commencer gratuitement" }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
definePageMeta({
  layout: 'landing'
})

const user = useSupabaseUser()

interface StatItem {
  label: string
  value: number
  loaded: boolean
  error: boolean
}

const secondaryFeatures = [
  {
    icon: 'lucide:calendar-days',
    title: 'Planning de streams',
    description: "Partage tes créneaux avec ta communauté. Personnalisable, exportable, toujours à jour."
  },
  {
    icon: 'lucide:layout-dashboard',
    title: 'Dashboard intuitif',
    description: "Tes outils en un coup d'œil. Gagne des Charm chaque jour et complète des quêtes pour débloquer des fonctionnalités"
  },
  {
    icon: 'lucide:users',
    title: 'Découverte de streamers',
    description: "Filtres, live, suggestions intelligentes et gagne des Charm à chaque raid."
  }
]

const statsStore = useStatsStore()
const stats = ref<StatItem[]>([
  { label: 'Streamers actifs', value: 0, loaded: false, error: false },
  { label: 'Liens partagés', value: 0, loaded: false, error: false },
  { label: 'Streams planifiés', value: 0, loaded: false, error: false },
])


const reducedMotion = usePreferredReducedMotion()
const animatedStats = ref([0, 0, 0])

function animateCountUp(targets: number[]) {
  if (reducedMotion.value === 'reduce') {
    animatedStats.value = [...targets]
    return
  }
  const duration = 1200
  const start = performance.now()
  const startValues = [...animatedStats.value]

  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedStats.value = targets.map((target, i) =>
      Math.round(startValues[i]! + (target - startValues[i]!) * eased)
    )
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(async () => {
  const results = await Promise.allSettled([
    statsStore.fetchTotalStreamers(),
    statsStore.fetchTotalLinks(),
    statsStore.fetchTotalSlots(),
  ])

  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value.data != null) {
      stats.value[i]!.value = result.value.data
    } else {
      stats.value[i]!.error = true
    }
    stats.value[i]!.loaded = true
  })

  // Déclenche count-up sur les valeurs non-error
  animateCountUp(stats.value.map(s => s.error ? 0 : s.value))
})
</script>
