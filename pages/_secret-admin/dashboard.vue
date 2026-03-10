<template>
    <div class="w-full space-y-8">

        <!-- HEADER / OVERVIEW -->
        <div>
            <h2 class="text-xl font-semibold text-gray-200 mb-4">
                Vue d'ensemble - {{ currentDate }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Health Score" :value="healthScore + '/100'" :trend="healthScore > 50 ? 'up' : 'down'"
                    :sub="healthScore > 50 ? 'Bon' : 'En dessous du seuil'" />
                <StatCard label="Activation" :value="activationRate + '%'"
                    :note="`${totalStreamersVisible} visibles / ${totalStreamers} inscrits`" />
                <StatCard label="Nouveaux profils visibles (7j)" :value="`${fmt(growthAbsolute)}`"
                    :sub="`${fmt(growthWeekOverWeek)}% vs semaine préc.`" :trend="growthAbsolute > 0 ? 'up' : 'down'" />
            </div>
        </div>

        <!-- ACQUISITION -->
        <div>
            <h2 class="text-lg font-semibold text-gray-200 mb-4">
                Acquisition
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Utilisateurs" :value="totalStreamers"
                    :breakdown="{ d7: totalStreamers7D, d30: totalStreamers30D }" />
                <StatCard label="Profils visibles" :value="totalStreamersVisible"
                    :breakdown="{ d7: totalStreamersVisible7D, d30: totalStreamersVisible30D }" />
                <StatCard label="Newsletter" :value="totalNewsletter"
                    :breakdown="{ d7: totalNewsletter7D, d30: totalNewsletter30D }" />
            </div>
        </div>

        <!-- FUNNEL -->
        <div>
            <h2 class="text-lg font-semibold text-gray-200 mb-4">
                Funnel d'activation
            </h2>
            <Funnel :steps="funnelSteps" />
        </div>

        <!-- ENGAGEMENT -->
        <div>
            <h2 class="text-lg font-semibold text-gray-200 mb-4">
                Engagement
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Liens" :value="totalLinks" :breakdown="{ d7: totalLinks7D, d30: totalLinks30D }"
                    :trend="totalLinks7D > 0 ? 'up' : totalLinks7D < 0 ? 'down' : 'neutral'" />
                <StatCard label="Total Streams" :value="totalSlots"
                    :breakdown="{ d7: totalSlots7D, d30: totalSlots30D }" />
                <StatCard label="Conversion Liens" :value="conversionLink + '%'"
                    :note="`${totalStreamersWithLink} streamers avec lien`" />
                <StatCard label="Conversion Slot" :value="conversionSlot + '%'"
                    :note="`${totalStreamersWithSlot} streamers avec slot`" />
                <StatCard label="Streamer avec lien qui crée un stream" :value="funnelIntegrity + '%'" />
                <StatCard label="Newsletter avec profil visible" :value="newsletterConversion + '%'"
                    :note="`${totalNewsletterNotVisible} streamers non visible`" />
                <StatCard label="Vues de pages" :value="totalPageEvents"
                    :breakdown="{ d7: totalPageEvents7D, d30: totalPageEvents30D }" />
                <StatCard label="Moyenne de vues par page" :value="viewerToStreamerRatio"/>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">

interface AdminStats {
    total_streamers: number
    streamers_7d: number
    streamers_30d: number

    total_visible: number
    visible_7d: number
    visible_30d: number
    visible_prev_7d: number

    conversion_link_pct: number
    conversion_slot_pct: number

    newsletter_total: number
    newsletter_7d: number
    newsletter_30d: number
    newsletter_not_visible: number

    links_total: number
    links_7d: number
    links_30d: number
    unique_users_with_link: number

    slots_total: number
    slots_7d: number
    slots_30d: number
    unique_users_with_slot: number

    page_events_total: number
    page_events_7d: number
    page_events_30d: number
}

const { data: stats } = await useFetch<AdminStats>('/api/admin/admin.stats')

// Date actuelle
const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
})

// Sécurisation + fallback global
const safeStats = computed(() => stats.value ?? {} as AdminStats)

// Streamers
const totalStreamers = computed(() => safeStats.value.total_streamers ?? 0)
const totalStreamers7D = computed(() => safeStats.value.streamers_7d ?? 0)
const totalStreamers30D = computed(() => safeStats.value.streamers_30d ?? 0)

// Visibles
const totalStreamersVisible = computed(() => safeStats.value.total_visible ?? 0)
const totalStreamersVisible7D = computed(() => safeStats.value.visible_7d ?? 0)
const totalStreamersVisible30D = computed(() => safeStats.value.visible_30d ?? 0)
const totalStreamersVisiblePrev7D = computed(() => safeStats.value.visible_prev_7d ?? 0)

// Conversions
const conversionLink = computed(() => safeStats.value.conversion_link_pct ?? 0)
const conversionSlot = computed(() => safeStats.value.conversion_slot_pct ?? 0)

// Newsletter
const totalNewsletter = computed(() => safeStats.value.newsletter_total ?? 0)
const totalNewsletter7D = computed(() => safeStats.value.newsletter_7d ?? 0)
const totalNewsletter30D = computed(() => safeStats.value.newsletter_30d ?? 0)
const totalNewsletterNotVisible = computed(() => safeStats.value.newsletter_not_visible ?? 0)

// Links
const totalLinks = computed(() => safeStats.value.links_total ?? 0)
const totalLinks7D = computed(() => safeStats.value.links_7d ?? 0)
const totalLinks30D = computed(() => safeStats.value.links_30d ?? 0)
const totalStreamersWithLink = computed(() => safeStats.value.unique_users_with_link ?? 0)

// Slots
const totalSlots = computed(() => safeStats.value.slots_total ?? 0)
const totalSlots7D = computed(() => safeStats.value.slots_7d ?? 0)
const totalSlots30D = computed(() => safeStats.value.slots_30d ?? 0)
const totalStreamersWithSlot = computed(() => safeStats.value.unique_users_with_slot ?? 0)

// Vues de pages
const totalPageEvents = computed(() => safeStats.value.page_events_total ?? 0)
const totalPageEvents7D = computed(() => safeStats.value.page_events_7d ?? 0)
const totalPageEvents30D = computed(() => safeStats.value.page_events_30d ?? 0)

const fmt = (n: number) => n > 0 ? `+${n}` : `${n}`

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
    if (totalStreamersWithLink.value === 0) return 0
    return Math.round((totalStreamersWithSlot.value / totalStreamersWithLink.value) * 100)
})

const viewerToStreamerRatio = computed(() => {
    if (totalStreamersVisible.value === 0) return 0
    return Math.round(totalPageEvents.value / totalStreamersVisible.value)
})
</script>