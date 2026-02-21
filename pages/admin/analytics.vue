<template>
    <div class="w-full border-2 border-zinc-600 p-6 space-y-8 rounded-2xl">

        <!-- HEADER / OVERVIEW -->
        <div>
            <h2 class="text-xl font-semibold text-zinc-800 mb-4">
                Vue d'ensemble - {{ currentDate }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Health Score" :value="healthScore + '/100'"
                    :trend="healthScore > 50 ? 'up' : 'down'" />
                <StatCard label="Activation" :value="activationRate + '%'"
                    :trend="activationRate > 40 ? 'up' : 'down'" />
                <StatCard label="Nouveaux profils actifs (7j)" :value="`${fmt(growthAbsolute)}`"
                    :sub="`${fmt(growthWeekOverWeek)}% vs semaine préc.`" :trend="growthAbsolute > 0 ? 'up' : 'down'" />
            </div>
        </div>

        <!-- ACQUISITION -->
        <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
                Acquisition
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Utilisateurs" :value="totalStreamers"
                    :sub="`${fmt(totalStreamers7D)} (7j) • ${fmt(totalStreamers30D)} (30j)`"
                    :trend="totalStreamers7D > 0 ? 'up' : totalStreamers7D < 0 ? 'down' : 'neutral'" />
                <StatCard label="Visibles" :value="totalStreamersVisible"
                    :sub="`${fmt(totalStreamersVisible7D)} (7j) • ${fmt(totalStreamersVisible30D)} (30j)`"
                    :trend="totalStreamersVisible7D > 0 ? 'up' : totalStreamersVisible7D < 0 ? 'down' : 'neutral'" />
                <StatCard label="Newsletter" :value="totalNewsletter"
                    :sub="`${fmt(totalNewsletter7D)} (7j) • ${fmt(totalNewsletter30D)} (30j) • ${fmt(totalNewsletterNotVisible)} non visibles`"
                    :trend="totalNewsletter7D > 0 ? 'up' : totalNewsletter7D < 0 ? 'down' : 'neutral'" />
            </div>
        </div>

        <!-- FUNNEL -->
        <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
                Funnel d'activation
            </h2>
            <Funnel :steps="funnelSteps" :funnel-integrity="funnelIntegrity"
                :newsletter-conversion="newsletterConversion" />
        </div>

        <!-- ENGAGEMENT -->
        <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
                Engagement
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Liens" :value="totalLinks"
                    :sub="`${fmt(totalLinks7D)} (7j) • ${fmt(totalLinks30D)} (30j)`"
                    :trend="totalLinks7D > 0 ? 'up' : totalLinks7D < 0 ? 'down' : 'neutral'" />
                <StatCard label="Total Streams" :value="totalSlots"
                    :sub="`${fmt(totalSlots7D)} (7j) • ${fmt(totalSlots30D)} (30j)`"
                    :trend="totalSlots7D > 0 ? 'up' : totalSlots7D < 0 ? 'down' : 'neutral'" />
            </div>
        </div>

    </div>
</template>

<script setup>
const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})

const adminStatsStore = useAdminStatsStore()
const totalStreamers = ref(0)
const totalStreamers7D = ref(0)
const totalStreamers30D = ref(0)
const totalStreamersVisible = ref(0)
const totalStreamersVisible7D = ref(0)
const totalStreamersVisible30D = ref(0)
const totalStreamersVisiblePrev7D = ref(0)
const conversionLink = ref(0)
const conversionSlot = ref(0)
const totalNewsletter = ref(0)
const totalNewsletter7D = ref(0)
const totalNewsletter30D = ref(0)
const totalNewsletterNotVisible = ref(0)
const totalLinks = ref(0)
const totalStreamersWithLink = ref(0)
const totalStreamersWithSlot = ref(0)
const totalLinks7D = ref(0)
const totalLinks30D = ref(0)
const totalSlots = ref(0)
const totalSlots7D = ref(0)
const totalSlots30D = ref(0)

onMounted(async () => {
    const [
        streamersRes,
        streamers7DRes,
        streamers30DRes,
        streamersVisibleRes,
        streamersVisible7DRes,
        streamersVisible30DRes,
        fetchTotalStreamersVisiblePrev7DRes,
        newsletterRes,
        newsletter7DRes,
        newsletter30DRes,
        newsletterNotVisibleRes,
        linksRes,
        streamersWithLinkRes,
        conversionLinkRes,
        links7DRes,
        links30DRes,
        slotsRes,
        streamersWithSlotRes,
        conversionSlotRes,
        slots7DRes,
        slots30DRes,
    ] = await Promise.all([
        adminStatsStore.fetchTotalStreamers(),
        adminStatsStore.fetchTotalStreamers7D(),
        adminStatsStore.fetchTotalStreamers30D(),
        adminStatsStore.fetchTotalStreamersVisible(),
        adminStatsStore.fetchTotalStreamersVisible7D(),
        adminStatsStore.fetchTotalStreamersVisible30D(),
        adminStatsStore.fetchTotalStreamersVisiblePrev7D(),
        adminStatsStore.fetchTotalNewsletter(),
        adminStatsStore.fetchTotalNewsletter7D(),
        adminStatsStore.fetchTotalNewsletter30D(),
        adminStatsStore.fetchTotalNewsletterNotVisible(),
        adminStatsStore.fetchTotalLinks(),
        adminStatsStore.fetchTotalStreamersWithLink(),
        adminStatsStore.fetchConversionLink(),
        adminStatsStore.fetchTotalLinks7D(),
        adminStatsStore.fetchTotalLinks30D(),
        adminStatsStore.fetchTotalSlots(),
        adminStatsStore.fetchTotalStreamersWithSlot(),
        adminStatsStore.fetchConversionSlots(),
        adminStatsStore.fetchTotalSlots7D(),
        adminStatsStore.fetchTotalSlots30D(),
    ])

    totalStreamers.value = streamersRes.data ?? 0
    totalStreamers7D.value = streamers7DRes.data ?? 0
    totalStreamers30D.value = streamers30DRes.data ?? 0
    totalStreamersVisible.value = streamersVisibleRes.data ?? 0
    totalStreamersVisible7D.value = streamersVisible7DRes.data ?? 0
    totalStreamersVisible30D.value = streamersVisible30DRes.data ?? 0
    totalStreamersVisiblePrev7D.value = fetchTotalStreamersVisiblePrev7DRes.data ?? 0
    totalNewsletter.value = newsletterRes.data ?? 0
    totalNewsletter7D.value = newsletter7DRes.data ?? 0
    totalNewsletter30D.value = newsletter30DRes.data ?? 0
    totalNewsletterNotVisible.value = newsletterNotVisibleRes.data ?? 0
    totalLinks.value = linksRes.data ?? 0
    totalStreamersWithLink.value = streamersWithLinkRes.data ?? 0
    conversionLink.value = conversionLinkRes.data ?? 0
    totalLinks7D.value = links7DRes.data ?? 0
    totalLinks30D.value = links30DRes.data ?? 0
    totalSlots.value = slotsRes.data ?? 0
    totalStreamersWithSlot.value = streamersWithSlotRes.data ?? 0
    conversionSlot.value = conversionSlotRes.data ?? 0
    totalSlots7D.value = slots7DRes.data ?? 0
    totalSlots30D.value = slots30DRes.data ?? 0
})

const fmt = (n) => n > 0 ? `+${n}` : `${n}`

const activationRate = computed(() => {
    return totalStreamers.value > 0
        ? Math.round((totalStreamersVisible.value / totalStreamers.value) * 100)
        : 0
})

const newsletterConversion = computed(() => {
    return totalNewsletter.value > 0
        ? Math.round(
            ((totalNewsletter.value - totalNewsletterNotVisible.value) /
                totalNewsletter.value) *
            100
        )
        : 0
})

const growthWeekOverWeek = computed(() => {
    const prev = totalStreamersVisiblePrev7D.value
    const current = totalStreamersVisible7D.value

    if (prev === 0) {
        if (current === 0) return 0
        return 100 // ou null si tu préfères afficher "Nouveau"
    }

    return Math.round(((current - prev) / prev) * 100)
})

const growthAbsolute = computed(() => {
    return totalStreamersVisible7D.value - totalStreamersVisiblePrev7D.value
})

const healthScore = computed(() => {
    const weights = {
        activation: 0.4,
        engagementLink: 0.3,
        engagementSlot: 0.2,
        newsletter: 0.1,
    }

    const score =
        activationRate.value * weights.activation +
        conversionLink.value * weights.engagementLink +
        conversionSlot.value * weights.engagementSlot +
        newsletterConversion.value * weights.newsletter

    return Math.min(100, Math.round(score))
})

const funnelSteps = computed(() => [
    {
        label: 'Inscrits',
        value: totalStreamers.value,
        percentage: 100,
    },
    {
        label: 'Profils actifs',
        value: totalStreamersVisible.value,
        percentage: activationRate.value,
    },
    {
        label: 'Ajoutent un lien',
        value: totalStreamersWithLink.value,
        percentage: conversionLink.value,
    },
    {
        label: 'Créent un stream',
        value: totalStreamersWithSlot.value,
        percentage: conversionSlot.value,
    },
])

const funnelIntegrity = computed(() => {
    if (totalStreamersVisible.value === 0) return 0
    return Math.round(
        (conversionSlot.value / conversionLink.value) * 100
    )
})
</script>