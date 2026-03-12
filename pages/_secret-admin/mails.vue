<template>
    <div class="w-full space-y-8">

        <!-- Header -->
        <div class="border-b pb-4">
            <h1 class="text-2xl font-bold tracking-tight">Newsletter</h1>
            <p class="text-sm text-zinc-500 mt-0.5">Envoi segmenté vers vos utilisateurs</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Colonne gauche — Envoi -->
            <div class="space-y-4">
                <label class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Segment cible</label>
                <Select v-model="selectedSegment" :options="segments" optionValue="value" optionLabel="label"
                    placeholder="Sélectionner un segment" fluid />

                <Transition name="fade">
                    <div v-if="loading" class="flex items-center gap-2 text-sm text-zinc-400 py-4">
                        <Icon name="lucide:loader-2" size="16" class="animate-spin" />
                        Chargement…
                    </div>

                    <div v-else-if="preview" class="space-y-4">
                        <div class="grid grid-cols-2 gap-3">
                            <div class="rounded-xl border p-4">
                                <p class="text-xs text-zinc-500 mb-1">Template</p>
                                <p class="font-semibold text-sm truncate">{{ preview.templateId }}</p>
                            </div>
                            <div class="rounded-xl border p-4">
                                <p class="text-xs text-zinc-500 mb-1">Destinataires</p>
                                <p class="font-semibold text-2xl">{{ preview.count }}</p>
                            </div>
                        </div>

                        <div class="rounded-xl border overflow-hidden">
                            <div class="px-4 py-2.5 border-b bg-zinc-50 dark:bg-zinc-900">
                                <p class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Échantillon</p>
                            </div>
                            <ul class="divide-y">
                                <li v-for="u in preview.sample" :key="u.email"
                                    class="flex items-center justify-between px-4 py-2.5">
                                    <span class="text-sm font-medium">{{ u.username }}</span>
                                    <span class="text-xs text-zinc-400 font-mono">{{ u.email }}</span>
                                </li>
                            </ul>
                        </div>

                        <div class="flex items-center gap-3">
                            <Button @click="sendEmails" severity="contrast">
                                <Icon name="lucide:send" size="16" />
                                Envoyer {{ preview.count }} emails
                            </Button>
                            <Transition name="fade">
                                <span v-if="sentCount !== null"
                                    class="text-sm text-green-600 font-medium flex items-center gap-1.5">
                                    <Icon name="lucide:check-circle" size="16" />
                                    {{ sentCount }} envoyés
                                </span>
                            </Transition>
                        </div>
                    </div>
                </Transition>
            </div>

            <!-- Colonne droite — Calendrier -->
            <!-- Calendrier -->
            <div class="rounded-xl border overflow-hidden">
                <!-- Cal header -->
                <div class="flex items-center justify-between px-4 py-3 border-b bg-zinc-50 dark:bg-zinc-900">
                    <button @click="prevMonth"
                        class="w-6 h-6 flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-500">
                        <Icon name="lucide:chevron-left" size="14" />
                    </button>
                    <span class="text-xs font-semibold uppercase tracking-widest text-zinc-400 capitalize">
                        {{ monthLabel }}
                    </span>
                    <button @click="nextMonth"
                        class="w-6 h-6 flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-500">
                        <Icon name="lucide:chevron-right" size="14" />
                    </button>
                </div>

                <!-- Légende -->
                <div class="flex gap-4 px-4 py-2 border-b">
                    <span v-for="seg in segmentsMeta" :key="seg.value"
                        class="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                        <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: seg.color }"></span>
                        {{ seg.label }}
                    </span>
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
                                    :class="{ 'opacity-30': selectedSegment && seg.value !== selectedSegment }">
                                    {{ seg.shortLabel }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Prochain envoi -->
                    <div v-if="nextSend" class="px-4 py-2.5 border-t"
                        :class="nextSend.isToday ? 'bg-green-50 dark:bg-green-950' : 'bg-zinc-50 dark:bg-zinc-900'">
                        <p class="text-xs flex items-center gap-1.5 font-medium"
                            :class="nextSend.isToday ? 'text-green-600 dark:text-green-400' : 'text-zinc-400'">
                            <Icon :name="nextSend.isToday ? 'lucide:zap' : 'lucide:clock'" size="12" />
                            {{ nextSend.label }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="space-y-3">
                <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Historique</h2>

                <div v-if="emailsLoading" class="flex items-center gap-2 text-sm text-zinc-400 py-4">
                    <Icon name="lucide:loader-2" size="16" class="animate-spin" />
                    Chargement…
                </div>

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

const segments = ref([
    { value: 'update', label: 'Mises à jour' },
    { value: 'notVisible', label: 'Streameurs non visibles' },
    { value: 'notSchedule', label: 'Streameurs sans planning' },
]);

const segmentsMeta = [
    { value: 'update', label: 'Mises à jour', shortLabel: 'Mises à jour', color: '#f59e0b' },
    { value: 'notVisible', label: 'Streameurs non visibles', shortLabel: 'Non visibles', color: '#6366f1' },
    { value: 'notSchedule', label: 'Streameurs sans planning', shortLabel: 'Sans planning', color: '#10b981' },
]

const scheduleMatrix: Record<number, Record<'mardi' | 'jeudi', string | null>> = {
    1: { mardi: 'notVisible', jeudi: 'update' }, // Semaine A
    2: { mardi: 'notSchedule', jeudi: null }, // Semaine B
    3: { mardi: 'notVisible', jeudi: null }, // Semaine C
    4: { mardi: 'notSchedule', jeudi: 'update' }, // Semaine D
}

// Calendrier
const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

function prevMonth() {
    if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
    else viewMonth.value--
}
function nextMonth() {
    if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
    else viewMonth.value++
}

const monthLabel = computed(() =>
    new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
        .format(new Date(viewYear.value, viewMonth.value, 1))
)

const daysInMonth = computed(() =>
    new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
)

const firstDayOffset = computed(() => {
    const d = new Date(viewYear.value, viewMonth.value, 1).getDay()
    return (d + 6) % 7 // lundi = 0
})

const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function getDayOfWeek(day: number) {
    return new Date(viewYear.value, viewMonth.value, day).getDay()
}

function getWeekOfMonth(day: number) {
    const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay()
    return Math.ceil((day + ((firstDay + 6) % 7)) / 7)
}

function isToday(day: number) {
    return day === today.getDate()
        && viewMonth.value === today.getMonth()
        && viewYear.value === today.getFullYear()
}

function isPast(day: number) {
    const d = new Date(viewYear.value, viewMonth.value, day)
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

function isWeekend(day: number) {
    const dow = getDayOfWeek(day)
    return dow === 0 || dow === 6
}

function getDaySends(day: number) {
    const dow = getDayOfWeek(day)
    if (dow !== 2 && dow !== 4) return []

    const weekIndex = ((getWeekOfMonth(day) - 1) % 4) + 1
    const dayKey = dow === 2 ? 'mardi' : 'jeudi'
    const segValue = scheduleMatrix[weekIndex]?.[dayKey]
    if (!segValue) return []

    return segmentsMeta.filter(s => s.value === segValue)
}

const nextSend = computed(() => {
    if (!selectedSegment.value) return null

    for (let i = 0; i < 28; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        const dow = d.getDay()
        if (dow !== 2 && dow !== 4) continue

        const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay()
        const week = Math.ceil((d.getDate() + ((firstDay + 6) % 7)) / 7)
        const weekIndex = ((week - 1) % 4) + 1
        const dayKey = dow === 2 ? 'mardi' : 'jeudi'
        const segValue = scheduleMatrix[weekIndex]?.[dayKey]

        if (segValue === selectedSegment.value) {
            const isToday = i === 0
            const label = new Intl.DateTimeFormat('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long'
            }).format(d)
            return {
                isToday,
                label: isToday ? `Aujourd'hui — ${label}` : `Prochain envoi : ${label}`
            }
        }
    }
    return null
})

const selectedSegment = ref(null);
const preview = ref<any>(null)
const loading = ref(false)
const sentCount = ref<number | null>(null)

async function loadPreview() {
    loading.value = true
    preview.value = null
    sentCount.value = null
    try {
        const res = await $fetch('/api/admin/mail/preview', {
            params: { segment: selectedSegment.value }
        })
        preview.value = res
    } catch (err) {
        console.error(err)
        alert('Erreur lors du chargement de l’aperçu')
    } finally {
        loading.value = false
    }
}

async function sendEmails() {
    try {
        const res = await $fetch('/api/admin/mail/send', {
            method: 'POST',
            body: {
                segment: selectedSegment.value,
            }
        })
        sentCount.value = res.sent
    } catch (err) {
        console.error(err)
        alert('Erreur lors de l’envoi des emails')
    }
}

const emails = ref<any[]>([])
const emailsLoading = ref(false)
const hasMore = ref(true)
const nextCursor = ref<string | null>(null)

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
        alert('Erreur chargement emails')
    } finally {
        emailsLoading.value = false
    }
}

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

watch(selectedSegment, (val) => {
    if (val) loadPreview()
    else { preview.value = null; sentCount.value = null }
})

onMounted(() => {
    loadEmails()
})
</script>