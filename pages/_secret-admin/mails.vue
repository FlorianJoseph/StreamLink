<template>
    <div class="w-full space-y-8">

        <!-- Header -->
        <div class="border-b pb-4">
            <h1 class="text-2xl font-bold tracking-tight">Newsletter</h1>
            <p class="text-sm text-zinc-500 mt-0.5">Envoi segmenté vers vos utilisateurs</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Colonne gauche — Calendrier -->
            <div class="rounded-xl border overflow-hidden self-start">
                <!-- Cal header -->
                <div class="flex items-center justify-between px-4 py-3 border-b bg-zinc-50 dark:bg-zinc-900">
                    <button @click="prevMonth"
                        class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-500">
                        <Icon name="lucide:chevron-left" size="24" />
                    </button>
                    <span class="text-xs font-semibold uppercase tracking-widest text-zinc-400 capitalize">
                        {{ monthLabel }}
                    </span>
                    <button @click="nextMonth"
                        class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-500">
                        <Icon name="lucide:chevron-right" size="24" />
                    </button>
                </div>

                <!-- Légende + counts -->
                <div class="flex items-center gap-1 px-4 py-2.5 border-b flex-wrap">
                    <button v-for="seg in segmentsMeta" :key="seg.value"
                        @click="selectedSegment = selectedSegment === seg.value ? null : seg.value"
                        class="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors text-xs font-medium"
                        :class="selectedSegment === seg.value
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'">
                        <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: seg.color }"></span>
                        {{ seg.label }}
                        <span v-if="segmentCounts[seg.value] !== undefined" class="font-mono font-semibold tabular-nums"
                            :style="{ color: seg.color }">
                            {{ segmentCounts[seg.value] }}
                        </span>
                        <Icon v-else-if="countsLoading" name="lucide:loader-2" size="10"
                            class="animate-spin opacity-40" />
                    </button>
                </div>

                <!-- Grille -->
                <div class="p-3">
                    <div class="grid grid-cols-7 mb-1">
                        <div v-for="d in dayNames" :key="d"
                            class="text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-400 pb-2">
                            {{ d }}
                        </div>
                    </div>
                    <div class="grid grid-cols-7 gap-1">
                        <div v-for="n in firstDayOffset" :key="'e' + n"></div>
                        <div v-for="day in daysInMonth" :key="day"
                            class="rounded-lg flex flex-col items-start p-1 min-h-[48px] transition-colors" :class="{
                                'opacity-40': isPast(day),
                                'bg-zinc-50 dark:bg-zinc-900': isWeekend(day),
                                'ring-1 ring-zinc-900 dark:ring-white ring-inset': isToday(day),
                            }">
                            <span
                                class="text-[11px] font-medium leading-none mb-1 w-5 h-5 flex items-center justify-center rounded"
                                :class="isToday(day)
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold'
                                    : 'text-zinc-500 dark:text-zinc-400'">
                                {{ day }}
                            </span>
                            <div class="flex flex-col gap-0.5 w-full">
                                <span v-for="seg in getDaySends(day)" :key="seg.value"
                                    class="text-[9px] font-semibold text-white rounded px-1 leading-[14px] truncate"
                                    :style="{ background: seg.color }"
                                    :class="{ 'opacity-25': selectedSegment && seg.value !== selectedSegment }">
                                    {{ seg.shortLabel }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Prochain envoi -->
                <div v-if="nextSend" class="px-4 py-2.5 border-t flex items-center justify-between"
                    :class="nextSend.isToday ? 'bg-green-950' : 'bg-zinc-900'">
                    <p class="text-xs flex items-center gap-1.5 font-medium"
                        :class="nextSend.isToday ? 'text-green-400' : 'text-zinc-400'">
                        <Icon :name="nextSend.isToday ? 'lucide:zap' : 'lucide:clock'" size="12" class="shrink-0" />
                        {{ nextSend.label }}
                    </p>
                    <Button @click="sendEmails" severity="contrast" :disabled="!selectedSegment || sending"
                        :loading="sending" size="small">
                        <Icon name="lucide:send" size="16" />
                        Envoyer {{ selectedSegment ? segmentCounts[selectedSegment] : 0 }} emails
                    </Button>
                </div>
            </div>


            <!-- Colonne droite : Historique -->
            <div class="space-y-3">
                <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Historique</h2>

                <div v-if="emailsLoading" class="flex items-center gap-2 text-sm text-zinc-400 py-4">
                    <Icon name="lucide:loader-2" size="16" class="animate-spin" />
                    Chargement…
                </div>

                <!-- Liste des emails -->
                <div v-else class="rounded-xl border overflow-hidden">
                    <div class="divide-y">
                        <div v-for="mail in emails" :key="mail.id"
                            class="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                            <!-- Statut -->
                            <span :class="[
                                'w-1.5 h-1.5 rounded-full flex-shrink-0',
                                mail.last_event === 'delivered' ? 'bg-green-500' :
                                    mail.last_event === 'bounced' ? 'bg-red-500' :
                                        'bg-zinc-300'
                            ]" />
                            <!-- To -->
                            <span class="text-xs text-zinc-400 font-mono w-50 flex-shrink-0">
                                {{ mail.to[0] }}
                            </span>
                            <!-- Subject -->
                            <span class="text-sm font-medium truncate flex-1">{{ mail.subject }}</span>
                            <!-- Date -->
                            <span class="text-xs text-zinc-400 flex-shrink-0">
                                {{ timeAgo(mail.created_at) }}
                            </span>
                        </div>
                    </div>

                    <div v-if="hasMore" class="border-t px-4 py-2.5">
                        <button @click="loadEmails"
                            class="text-xs text-zinc-400 hover:text-zinc-600 transition-colors font-medium">
                            Charger plus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

// Segments
const segmentsMeta = [
    { value: 'notVisible', label: 'Non visible', shortLabel: 'Non visible', color: '#6366f1' },
    { value: 'notSchedule', label: 'Sans planning', shortLabel: 'Sans planning', color: '#10b981' },
    { value: 'update', label: 'Mises à jour', shortLabel: 'Mise à jour', color: '#f59e0b' },
]

// Planning d’envoi : 4 semaines A/B/C/D avec règles différentes
const scheduleMatrix: Record<number, Record<'mardi' | 'jeudi', string | null>> = {
    1: { mardi: 'notVisible', jeudi: 'update' }, // Semaine A
    2: { mardi: 'notSchedule', jeudi: null }, // Semaine B
    3: { mardi: 'notVisible', jeudi: 'update' }, // Semaine C
    4: { mardi: 'notSchedule', jeudi: null }, // Semaine D
}

// Calendrier
const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

// Navigation mois précédent avec gestion d’année
function prevMonth() {
    if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
    else viewMonth.value--
}

// Navigation mois suivant avec gestion d’année
function nextMonth() {
    if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
    else viewMonth.value++
}

// Label du mois affiché, ex. "mars 2024"
const monthLabel = computed(() =>
    new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
        .format(new Date(viewYear.value, viewMonth.value, 1))
)

// Nombre de jours dans le mois affiché
const daysInMonth = computed(() =>
    new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
)

// Décalage du premier jour du mois (0 = lundi, 6 = dimanche)
const firstDayOffset = computed(() => {
    const d = new Date(viewYear.value, viewMonth.value, 1).getDay()
    return (d + 6) % 7
})

// Noms des jours de la semaine pour l’en-tête du calendrier
const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
// Jour de la semaine pour un jour donné du mois affiché (0 = dimanche, 6 = samedi)
function getDayOfWeek(day: number) {
    return new Date(viewYear.value, viewMonth.value, day).getDay()
}

// Numéro de semaine ISO (lundi = début) — cycle continu sur toute l'année
function getISOWeek(date: Date): number {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
    const week1 = new Date(d.getFullYear(), 0, 4)
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}

// Convertit un numéro de semaine ISO en index A/B/C/D (1–4)
function getCycleIndex(date: Date): number {
    return ((getISOWeek(date) - 1) % 4) + 1
}

// Indique si le jour donné est aujourd’hui (en fonction du mois/année affiché)
function isToday(day: number) {
    return day === today.getDate()
        && viewMonth.value === today.getMonth()
        && viewYear.value === today.getFullYear()
}

// Indique si le jour donné est passé (avant aujourd’hui, en fonction du mois/année affiché)
function isPast(day: number) {
    const d = new Date(viewYear.value, viewMonth.value, day)
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

// Indique si le jour donné est un week-end (samedi ou dimanche)
function isWeekend(day: number) {
    const dow = getDayOfWeek(day)
    return dow === 0 || dow === 6
}

// Récupère les segments prévus pour un jour donné du mois affiché, en fonction du planning
function getDaySends(day: number) {
    const dow = getDayOfWeek(day)
    if (dow !== 2 && dow !== 4) return []
    const date = new Date(viewYear.value, viewMonth.value, day)
    const dayKey = dow === 2 ? 'mardi' : 'jeudi'
    const wIdx = getCycleIndex(date)
    const segValue = scheduleMatrix[wIdx]?.[dayKey]
    if (!segValue) return []
    return segmentsMeta.filter(s => s.value === segValue)
}

// Calcule le prochain envoi prévu à partir d’aujourd’hui, en fonction du planning
const nextSend = computed(() => {
    if (!selectedSegment.value) return null
    for (let i = 0; i < 60; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        const dow = d.getDay()
        if (dow !== 2 && dow !== 4) continue
        const dk = dow === 2 ? 'mardi' : 'jeudi'
        const wIdx = getCycleIndex(d)
        if (scheduleMatrix[wIdx]?.[dk] !== selectedSegment.value) continue
        const label = new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long'
        }).format(d)
        return {
            isToday: i === 0,
            label: i === 0 ? `Aujourd'hui : ${label}` : `Prochain envoi : ${label}`
        }
    }
    return null
})

// Compte les segments
const segmentCounts = ref<Record<string, number>>({})
const countsLoading = ref(false)

async function loadSegmentCounts() {
    countsLoading.value = true
    try {
        const res = await $fetch<Record<string, number>>('/api/admin/mail/counts')
        segmentCounts.value = res
    } catch (err) {
        console.error(err)
    } finally {
        countsLoading.value = false
    }
}

// Aperçu et envoi
const selectedSegment = ref<string | null>(null);
const sending = ref(false)
const toast = useToast()

// Envoie les emails pour le segment sélectionné
async function sendEmails() {
    if (sending.value) return
    sending.value = true

    try {
        const res = await $fetch('/api/admin/mail/send', {
            method: 'POST',
            body: { segment: selectedSegment.value }
        })
        toast.add({ group: 'app', severity: 'success', summary: 'Emails envoyés', detail: `${res.sent} emails envoyés avec succès`, life: 4000 })
    } catch (err) {
        console.error(err)
        toast.add({ group: 'app', severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l’envoi des emails', life: 4000 })
    } finally {
        sending.value = false
    }
}

// Historique des emails
const emails = ref<any[]>([])
const emailsLoading = ref(false)
const hasMore = ref(true)
const nextCursor = ref<string | null>(null)

// Charge les emails suivants pour l’historique, avec pagination cursor-based
async function loadEmails() {
    if (!hasMore.value) return

    emailsLoading.value = true

    try {
        const res = await $fetch('/api/admin/mail/list', {
            query: {
                limit: 15,
                after: nextCursor.value
            }
        })

        emails.value.push(...res.emails)
        hasMore.value = res.hasMore
        nextCursor.value = res.nextCursor
    } catch (err) {
        console.error(err)
        toast.add({ group: 'app', severity: 'error', summary: 'Erreur', detail: 'Erreur lors du chargement des emails', life: 4000 })
    } finally {
        emailsLoading.value = false
    }
}

// Affiche le temps écoulé depuis la date donnée, en format "il y a Xmin/h/j" ou "À l'instant"
function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "À l'instant"
    if (mins < 60) return `il y a ${mins}min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `il y a ${hours}h`
    const days = Math.floor(hours / 24)
    return `il y a ${days}j`
}

onMounted(() => {
    loadEmails()
    loadSegmentCounts()
})
</script>