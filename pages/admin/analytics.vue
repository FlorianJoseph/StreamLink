<template>
    <div class="min-h-screen w-full bg-zinc-950 text-zinc-100 overflow-x-hidden">

        <!-- Header -->
        <header class="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
            <div class="w-full px-8 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-base">
                        ⚡</div>
                    <span class="font-black tracking-tight text-lg">StreamLink</span>
                    <span
                        class="text-[9px] font-mono px-2 py-0.5 rounded-md border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 tracking-widest">ADMIN</span>
                </div>
                <div class="flex items-center gap-4 text-xs font-mono text-zinc-500">
                    <span class="capitalize hidden sm:block">{{ currentDate }}</span>
                    <div class="flex items-center gap-2">
                        <span class="relative flex h-2 w-2">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span class="text-emerald-400 font-semibold">Live</span>
                    </div>
                </div>
            </div>
        </header>

        <main class="w-full px-8 py-8 space-y-6">

            <!-- KPI Grid -->
            <section>
                <div class="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-4">
                    <div v-for="(stat, i) in stats" :key="i"
                        class="group relative rounded-2xl p-2 border-2 border-zinc-700 bg-zinc-900 p-5 hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-default">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl">
                        </div>
                        <p class="text-[9px] font-mono uppercase tracking-widest text-zinc-400">{{ stat.label }}</p>
                        <p class="mt-2 text-2xl font-black tracking-tight">{{ stat.value }}</p>
                        <p v-if="stat.sub" class="mt-1 text-[10px] font-mono text-emerald-400">{{ stat.sub }}</p>
                    </div>
                </div>
            </section>

            <!-- Health Score + Insights -->
            <section class="grid gap-4 lg:grid-cols-[280px_1fr]">

                <!-- Health Score Card -->
                <div
                    class="relative rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 overflow-hidden flex flex-col justify-between">
                    <!-- bg glow -->
                    <div class="absolute inset-0 opacity-20 pointer-events-none" :class="healthGlowBg"></div>

                    <div>
                        <p class="text-[9px] font-mono uppercase tracking-widest text-zinc-400 mb-4">Health Score</p>

                        <!-- Score ring -->
                        <div class="flex items-center gap-5">
                            <div class="relative w-20 h-20 shrink-0">
                                <svg class="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="#27272a" stroke-width="8" />
                                    <circle cx="40" cy="40" r="32" fill="none" :stroke="healthColor" stroke-width="8"
                                        stroke-linecap="round" :stroke-dasharray="`${healthScore * 2.01} 201`"
                                        class="transition-all duration-700" />
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <span class="text-xl font-black tracking-tight">{{ healthScore }}</span>
                                </div>
                            </div>
                            <div>
                                <p class="text-2xl font-black">{{ healthEmoji }} {{ healthLabel }}</p>
                                <p class="text-xs text-zinc-500 mt-1 leading-relaxed">Score sur 100 basé sur rétention,
                                    croissance, adoption & activité</p>
                            </div>
                        </div>
                    </div>

                    <!-- Score breakdown -->
                    <div class="mt-5 space-y-2">
                        <div v-for="dim in healthDimensions" :key="dim.label" class="flex items-center gap-2">
                            <span class="text-[9px] font-mono text-zinc-400 w-24 shrink-0">{{ dim.label }}</span>
                            <div class="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-700" :class="dim.color"
                                    :style="{ width: `${(dim.score / dim.max) * 100}%` }"></div>
                            </div>
                            <span class="text-[9px] font-mono text-zinc-400 w-8 text-right">{{ dim.score }}/{{ dim.max
                            }}</span>
                        </div>
                    </div>
                </div>

                <!-- Insights priorisés -->
                <div class="rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6">
                    <p class="text-[9px] font-mono uppercase tracking-widest text-zinc-400 mb-4">Insights &
                        Recommandations</p>
                    <div class="space-y-3">
                        <div v-for="insight in prioritizedInsights" :key="insight.message"
                            class="flex items-start gap-3 rounded-xl px-4 py-3 border transition-all"
                            :class="insight.bg">
                            <span class="text-base mt-0.5 shrink-0">{{ insight.icon }}</span>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-0.5">
                                    <span class="text-[9px] font-mono uppercase tracking-widest"
                                        :class="insight.labelColor">{{ insight.levelLabel }}</span>
                                </div>
                                <p class="text-sm text-zinc-300 leading-relaxed">{{ insight.message }}</p>
                            </div>
                            <span class="text-[9px] font-mono shrink-0 mt-0.5" :class="insight.labelColor">{{
                                insight.metric }}</span>
                        </div>
                    </div>
                </div>

            </section>

            <!-- Acquisition Chart -->
            <section>
                <div class="rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6">
                    <div class="flex items-start justify-between mb-6 gap-4 flex-wrap">
                        <div>
                            <h2 class="font-bold text-base">Acquisition</h2>
                            <p class="text-xs text-zinc-500 mt-0.5">14 derniers jours</p>
                        </div>
                        <div class="flex items-center gap-4 text-xs font-mono text-zinc-500">
                            <span>Moy. <span class="text-zinc-300">{{ avgUsers }}</span> / jour</span>
                            <span class="text-emerald-400">↑ tendance haussière</span>
                        </div>
                    </div>

                    <div class="relative">
                        <div class="pl-7">
                            <div class="relative h-48 flex items-end gap-1.5">
                                <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0">
                                    <div v-for="n in 5" :key="n" class="border-t border-white/[0.04] w-full"></div>
                                </div>
                                <div v-for="(d, i) in acquisitionData" :key="i"
                                    class="group/bar flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                                    <span
                                        class="text-[9px] font-mono text-emerald-400 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-zinc-950/80 px-1 rounded">{{
                                            d.users }}</span>
                                    <div class="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover/bar:from-emerald-500 group-hover/bar:to-emerald-300 transition-all duration-200 cursor-pointer"
                                        :style="{ height: `${(d.users / maxUsers) * 100}%`, minHeight: '4px' }"></div>
                                </div>
                            </div>
                            <div class="flex gap-1.5 mt-2">
                                <div v-for="(d, i) in acquisitionData" :key="i" class="flex-1 text-center">
                                    <span class="text-[9px] font-mono text-zinc-700">{{ d.date.split(' ')[1] }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Funnel + Retention + Feature Impact -->
            <section class="grid gap-6 lg:grid-cols-2">

                <!-- Funnel -->
                <div class="rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6">
                    <div class="flex items-start justify-between mb-6 flex-wrap gap-2">
                        <div>
                            <h2 class="font-bold text-base">Funnel d'Activation</h2>
                            <p class="text-xs text-zinc-500 mt-0.5">De l'inscription au premier stream</p>
                        </div>
                        <span class="text-xs font-mono px-2 py-1 rounded-lg bg-zinc-800 text-zinc-400">
                            Drop total : {{ 100 - Math.round((funnelData[funnelData.length - 1].value /
                                funnelData[0].value) * 100) }}%
                        </span>
                    </div>
                    <div class="space-y-5">
                        <div v-for="(step, i) in funnelData" :key="i">
                            <div class="flex justify-between items-center mb-1.5">
                                <div class="flex items-center gap-2">
                                    <span class="text-[9px] font-mono text-zinc-700 w-4">{{ String(i + 1).padStart(2,
                                        '0') }}</span>
                                    <span class="text-sm text-zinc-300">{{ step.name }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="text-xs font-mono text-zinc-500">{{ step.value }}</span>
                                    <span class="text-[10px] font-mono w-9 text-right"
                                        :class="i === 0 ? 'text-zinc-600' : dropColor(step.value, funnelData[i - 1].value)">
                                        {{ i === 0 ? '—' : Math.round((step.value / funnelData[i - 1].value) * 100) +
                                            '%'
                                        }}
                                    </span>
                                </div>
                            </div>
                            <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-700" :class="funnelBarColor(i)"
                                    :style="{ width: `${(step.value / funnelData[0].value) * 100}%` }"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right column -->
                <div class="space-y-5">
                    <!-- Retention -->
                    <div class="rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6">
                        <div class="mb-5">
                            <h2 class="font-bold text-base">Rétention</h2>
                            <p class="text-xs text-zinc-500 mt-0.5">Utilisateurs revenant après J+n</p>
                        </div>
                        <div class="space-y-4">
                            <div v-for="r in retention" :key="r.label">
                                <div class="flex justify-between text-sm mb-1.5">
                                    <span class="font-mono text-zinc-500">{{ r.label }}</span>
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono font-semibold">{{ r.value }}%</span>
                                        <span class="text-[9px] font-mono px-1.5 py-0.5 rounded"
                                            :class="r.value >= 50 ? 'bg-emerald-500/10 text-emerald-400' : r.value >= 35 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'">
                                            {{ r.value >= 50 ? 'BON' : r.value >= 35 ? 'MOY' : 'FAIBLE' }}
                                        </span>
                                    </div>
                                </div>
                                <div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-700"
                                        :class="r.value >= 50 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-blue-700 to-blue-500'"
                                        :style="{ width: r.value + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Feature Impact -->
                    <div class="rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6">
                        <div class="mb-5">
                            <h2 class="font-bold text-base">Impact Fonctionnalités</h2>
                            <p class="text-xs text-zinc-500 mt-0.5">Corrélation feature → rétention D7</p>
                        </div>
                        <div class="space-y-2">
                            <div v-for="item in featureImpact" :key="item.label"
                                class="flex justify-between items-center bg-zinc-950 hover:bg-zinc-800/60 px-4 py-3 rounded-xl border border-transparent hover:border-white/5 transition-all">
                                <div class="flex items-center gap-2">
                                    <span :class="item.positive ? 'text-emerald-400' : 'text-red-400'"
                                        class="text-xs">{{ item.positive ? '▲' : '▼' }}</span>
                                    <span class="text-sm text-zinc-400">{{ item.label }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="h-1 w-16 bg-zinc-800 rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="item.positive ? 'bg-emerald-500' : 'bg-red-500'"
                                            :style="{ width: item.d7 + '%' }"></div>
                                    </div>
                                    <span class="font-mono text-sm font-semibold w-10 text-right"
                                        :class="item.positive ? 'text-emerald-400' : 'text-red-400'">{{ item.d7
                                        }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    </div>
</template>

<script setup>

const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})

const adminStatsStore = useAdminStatsStore()
const totalStreamers = ref(0)
const totalStreamersVisible = ref(0)
const totalStreamersVisible7D = ref(0)
const totalNewsletter = ref(0)
const totalNewsletterNotVisible = ref(0)
const totalLinks = ref(0)
const totalSlots = ref(0)

onMounted(async () => {
    const streamersRes = await adminStatsStore.fetchTotalStreamers()
    const streamersVisibleRes = await adminStatsStore.fetchTotalStreamersVisible()
    const streamersVisible7DRes = await adminStatsStore.fetchTotalStreamersVisible7D()
    const newsletterRes = await adminStatsStore.fetchTotalNewsletter()
    const newsletterNotVisibleRes = await adminStatsStore.fetchTotalNewsletterNotVisible()
    const linksRes = await adminStatsStore.fetchTotalLinks()
    const slotsRes = await adminStatsStore.fetchTotalSlots()

    totalStreamers.value = streamersRes.data ?? 0
    totalStreamersVisible.value = streamersVisibleRes.data ?? 0
    totalStreamersVisible7D.value = streamersVisible7DRes.data ?? 0
    totalNewsletter.value = newsletterRes.data ?? 0
    totalNewsletterNotVisible.value = newsletterNotVisibleRes.data ?? 0
    totalLinks.value = linksRes.data ?? 0
    totalSlots.value = slotsRes.data ?? 0
})

const retentionStreamers = computed(() => {
    return totalStreamers.value > 0 ? Math.round((totalStreamersVisible.value / totalStreamers.value) * 100) : 0
})

const retentionNewsletter = computed(() => {
    return totalNewsletter.value > 0 ? Math.round((totalNewsletterNotVisible.value / totalNewsletter.value) * 100) : 0
})

const retentionLinks = computed(() => {
    return totalLinks.value > 0 ? Math.round((totalSlots.value / totalLinks.value) * 100) : 0
})

const retentionSlots = computed(() => {
    return totalLinks.value > 0 ? Math.round((totalSlots.value / totalLinks.value) * 100) : 0
})

const retentionOverall = computed(() => {
    const weights = [0.4, 0.3, 0.2, 0.1]
    const scores = [retentionStreamers.value, retentionNewsletter.value, retentionLinks.value, retentionSlots.value]
    return Math.round(scores.reduce((a, s, i) => a + s * weights[i], 0))
})

const stats = computed(() => [
    { label: 'Utilisateurs', value: totalStreamers.value, sub: '+38 (7j)' },
    { label: 'Profils Actifs', value: totalStreamersVisible.value, sub: retentionStreamers.value + '%' },
    { label: 'Actifs (7j)', value: totalStreamersVisible7D.value, sub: retentionStreamers.value + '%' },
    { label: 'Newsletter', value: totalNewsletter.value, sub: retentionNewsletter.value + '%' },
    { label: 'Newsletter Non Visible', value: totalNewsletterNotVisible.value, sub: retentionNewsletter.value + '%' },
    { label: 'Liens', value: totalLinks.value },
    { label: 'Streams', value: totalSlots.value },
    { label: 'Streams (7j)', value: '58' },
])

const acquisitionData = [
    { date: 'Feb 06', users: 11 }, { date: 'Feb 07', users: 9 },
    { date: 'Feb 08', users: 13 }, { date: 'Feb 09', users: 8 },
    { date: 'Feb 10', users: 14 }, { date: 'Feb 11', users: 10 },
    { date: 'Feb 12', users: 12 }, { date: 'Feb 13', users: 16 },
    { date: 'Feb 14', users: 15 }, { date: 'Feb 15', users: 18 },
    { date: 'Feb 16', users: 19 }, { date: 'Feb 17', users: 21 },
    { date: 'Feb 18', users: 24 }, { date: 'Feb 19', users: 27 },
]

const funnelData = [
    { name: 'Inscrits', value: 247 },
    { name: 'Profil créé', value: 210 },
    { name: '1+ Lien', value: 175 },
    { name: 'Design personnalisé', value: 132 },
    { name: 'Planning créé', value: 104 },
    { name: '1+ Stream planifié', value: 97 },
]

const retention = [
    { label: 'D7', value: 54 },
    { label: 'D14', value: 44 },
    { label: 'D30', value: 34 },
]

const featureImpact = [
    { label: 'Avec Planning', d7: 71, positive: true },
    { label: 'Sans Planning', d7: 24, positive: false },
    { label: 'Avec 3+ Liens', d7: 63, positive: true },
]

// ── Computed helpers ──────────────────────────────────
const maxUsers = computed(() => Math.max(...acquisitionData.map(d => d.users)))
const avgUsers = computed(() =>
    (acquisitionData.reduce((a, d) => a + d.users, 0) / acquisitionData.length).toFixed(1)
)

const globalRetention = 54
const retentionPlanning = 71
const planningCreationRate = Math.round((104 / 247) * 100) // 42%
const userGrowth7d = 38
const streams7d = 58
const previousStreams7d = 45 // hypothetical previous period

// ── Health Score ──────────────────────────────────────
const healthDimensions = [
    {
        label: 'Rétention',
        score: globalRetention >= 60 ? 30 : globalRetention >= 40 ? 20 : 10,
        max: 30,
        color: globalRetention >= 60 ? 'bg-emerald-500' : globalRetention >= 40 ? 'bg-amber-500' : 'bg-red-500'
    },
    {
        label: 'Croissance',
        score: userGrowth7d > 20 ? 25 : userGrowth7d > 10 ? 15 : 5,
        max: 25,
        color: userGrowth7d > 20 ? 'bg-emerald-500' : userGrowth7d > 10 ? 'bg-amber-500' : 'bg-red-500'
    },
    {
        label: 'Adoption',
        score: planningCreationRate >= 60 ? 20 : planningCreationRate >= 40 ? 10 : 5,
        max: 20,
        color: planningCreationRate >= 60 ? 'bg-emerald-500' : planningCreationRate >= 40 ? 'bg-amber-500' : 'bg-red-500'
    },
    {
        label: 'Activité',
        score: streams7d >= 100 ? 25 : streams7d >= 50 ? 15 : 5,
        max: 25,
        color: streams7d >= 100 ? 'bg-emerald-500' : streams7d >= 50 ? 'bg-amber-500' : 'bg-red-500'
    },
]

const healthScore = healthDimensions.reduce((a, d) => a + d.score, 0)

const healthLabel = healthScore >= 80 ? 'Strong' : healthScore >= 60 ? 'Healthy' : healthScore >= 40 ? 'At Risk' : 'Critical'
const healthEmoji = healthScore >= 80 ? '🔥' : healthScore >= 60 ? '⚡' : healthScore >= 40 ? '⚠️' : '🚨'
const healthColor = healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#f59e0b' : healthScore >= 40 ? '#f97316' : '#ef4444'
const healthGlowBg = healthScore >= 80
    ? 'bg-gradient-to-br from-emerald-500 to-transparent'
    : healthScore >= 60
        ? 'bg-gradient-to-br from-amber-500 to-transparent'
        : 'bg-gradient-to-br from-red-500 to-transparent'

// ── Insights priorisés ────────────────────────────────
const insightDefs = [
    {
        condition: retentionPlanning - globalRetention > 20,
        level: 0, // 🔥
        icon: '🔥',
        levelLabel: 'Priorité haute',
        message: `Le planning booste la rétention D7 de +${retentionPlanning - globalRetention}pts. Pousser la création dès l'onboarding.`,
        metric: `${retentionPlanning}% vs ${globalRetention}%`,
        bg: 'bg-emerald-500/5 border-emerald-500/20',
        labelColor: 'text-emerald-400',
    },
    {
        condition: planningCreationRate < 50,
        level: 1, // ⚠
        icon: '⚠️',
        levelLabel: 'Point critique',
        message: `${100 - planningCreationRate}% des inscrits ne créent pas de planning. Optimiser le flow post-signup.`,
        metric: `${planningCreationRate}% d'adoption`,
        bg: 'bg-amber-500/5 border-amber-500/20',
        labelColor: 'text-amber-400',
    },
    {
        condition: streams7d > previousStreams7d,
        level: 3, // ✅
        icon: '✅',
        levelLabel: 'Signal positif',
        message: `Activité streams en hausse vs période précédente (+${streams7d - previousStreams7d} streams/7j). Momentum positif.`,
        metric: `+${streams7d - previousStreams7d} streams`,
        bg: 'bg-blue-500/5 border-blue-500/20',
        labelColor: 'text-blue-400',
    },
    {
        condition: userGrowth7d > 20,
        level: 3,
        icon: '📈',
        levelLabel: 'Signal positif',
        message: `Forte dynamique d'acquisition avec +${userGrowth7d} utilisateurs sur 7 jours.`,
        metric: `+${userGrowth7d} users`,
        bg: 'bg-blue-500/5 border-blue-500/20',
        labelColor: 'text-blue-400',
    },
]

const prioritizedInsights = insightDefs
    .filter(i => i.condition)
    .sort((a, b) => a.level - b.level)

// ── Funnel helpers ────────────────────────────────────
const funnelBarColor = (i) => [
    'bg-gradient-to-r from-emerald-600 to-emerald-400',
    'bg-gradient-to-r from-emerald-700 to-emerald-500',
    'bg-gradient-to-r from-teal-700 to-teal-500',
    'bg-gradient-to-r from-cyan-700 to-cyan-500',
    'bg-gradient-to-r from-blue-700 to-blue-500',
    'bg-gradient-to-r from-blue-800 to-blue-600',
][i] ?? 'bg-zinc-600'

const dropColor = (current, prev) => {
    const r = current / prev
    return r >= 0.9 ? 'text-emerald-400' : r >= 0.75 ? 'text-amber-400' : 'text-red-400'
}
</script>