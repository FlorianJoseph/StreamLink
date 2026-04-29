<template>
    <header class="relative z-50">
        <nav class="h-14 bg-surface-darker border-b border-white/5">
            <div class="flex items-center h-full px-4 sm:px-6 gap-3">

                <!-- Logo -->
                <NuxtLink to="/" class="shrink-0 mr-2">
                    <AppLogo variant="full" color="blanc" :height="28" />
                </NuxtLink>

                <!-- Hamburger mobile -->
                <button @click="mobileOpen = !mobileOpen" class="lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-muted
                               hover:text-white hover:bg-white/5 transition-colors">
                    <Icon :name="mobileOpen ? 'lucide:x' : 'lucide:menu'" size="18" />
                </button>

                <!-- Navigation desktop -->
                <div class="hidden lg:flex items-center gap-0.5 flex-1">
                    <NuxtLink v-for="item in menuItemsBefore" :key="item.route" :to="item.route" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted
                                hover:text-white" exact-active-class="!text-white">
                        {{ item.label }}
                    </NuxtLink>

                    <!-- Ma page — dropdown -->
                    <div ref="maPageRef" class="relative">
                        <button @click="maPageOpen = !maPageOpen"
                            class="flex items-center gap-1.5 px-3 py-1.5 text-muted hover:text-white rounded-md">
                            Ma page
                            <Icon name="lucide:chevron-down" size="16" class="transition-transform duration-200"
                                :class="maPageOpen ? 'rotate-180' : ''" />
                        </button>

                        <Transition name="dropdown">
                            <div v-if="maPageOpen" class="absolute top-full left-0 mt-1.5 w-44 bg-surface-darker border border-white/8
                                       rounded-md shadow-xl p-2 overflow-hidden">
                                <NuxtLink v-for="sub in maPageItems" :key="sub.to" :to="sub.to"
                                    @click="maPageOpen = false" class="flex items-center gap-2.5 px-3 py-2 text-muted
                                           hover:text-white hover:bg-white/5 rounded-sm"
                                    exact-active-class="!text-white">
                                    {{ sub.label }}
                                </NuxtLink>
                            </div>
                        </Transition>
                    </div>
                    <NuxtLink v-for="item in menuItemsAfter" :key="item.route" :to="item.route" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted
                                hover:text-white" exact-active-class="!text-white">
                        {{ item.label }}
                    </NuxtLink>
                </div>

                <!-- Actions droite -->
                <div class="flex items-center gap-1.5 ml-auto">

                    <!-- Discord -->
                    <a href="https://discord.gg/fVFguWc76b" target="_blank" class="flex items-center justify-center w-8 h-8 rounded-full text-white/90
                               hover:bg-white/5"
                        v-tooltip.bottom="{ value: 'Rejoindre le Discord', pt: { text: '!text-xs' } }">
                        <Icon name="simple-icons:discord" size="20" />
                        <span class="sr-only">Rejoindre le Discord</span>
                    </a>

                    <!-- Non connecté -->
                    <template v-if="!user">
                        <NuxtLink to="/auth/login">
                            <button class="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm sm:text-base
                                           rounded-md font-bold hover:bg-primary/90 transition-colors">
                                <Icon name="simple-icons:twitch" size="16" />
                                Connexion
                            </button>
                        </NuxtLink>
                    </template>

                    <!-- Connecté -->
                    <template v-else>
                        <!-- Solde Charm -->
                        <NuxtLink to="/shop" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
                                   bg-white/5 hover:bg-white/8 transition-colors">
                            <img src="/images/assets/charmi-monnaie-jaune.svg"
                                class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" alt="" loading="eager" />
                            <span class="text-xs sm:text-sm font-bold text-white">{{ balance }}</span>
                        </NuxtLink>

                        <!-- Avatar + menu -->
                        <div ref="avatarRef" class="relative">
                            <button @click="avatarOpen = !avatarOpen; mobileOpen = false"
                                class="flex items-center gap-2 px-2 py-1.5 rounded-md"
                                :class="avatarOpen ? 'sm:bg-white/8' : 'sm:hover:bg-white/5'">
                                <Avatar :image="user.user_metadata.avatar_url" shape="circle" size="small" />
                                <span class="hidden sm:block text-white font-bold">
                                    {{ user.user_metadata.nickname }}
                                </span>
                                <div class="hidden lg:flex items-center">
                                    <Icon name="lucide:chevron-down" size="16"
                                        class="text-muted transition-transform duration-200"
                                        :class="avatarOpen ? 'rotate-180' : ''" />
                                </div>
                            </button>

                            <Transition name="dropdown">
                                <div v-if="avatarOpen" class="absolute top-full right-0 mt-1.5 w-52 bg-surface-darker border border-white/8
                                           rounded-md shadow-xl p-2 overflow-hidden">
                                    <template v-for="group in filteredPopoverItems" :key="group.label">
                                        <div v-for="item in group.items" :key="item.label">
                                            <NuxtLink v-if="item.route" :to="item.route" @click="avatarOpen = false"
                                                class="flex items-center gap-2.5 px-3 py-2 text-muted text-sm sm:text-base
                                                       hover:text-white hover:bg-white/5 rounded-sm">
                                                <Icon :name="item.icon" size="16" class="shrink-0" />
                                                {{ item.label }}
                                            </NuxtLink>
                                            <button v-else @click="item.command?.(); avatarOpen = false" class="flex items-center gap-2.5 w-full px-3 py-2 text-muted text-sm sm:text-base
                                                       hover:text-white hover:bg-white/5 text-left rounded-sm">
                                                <Icon :name="item.icon" size="16" class="shrink-0" />
                                                {{ item.label }}
                                            </button>
                                        </div>
                                    </template>
                                </div>
                            </Transition>
                        </div>
                    </template>

                </div>
            </div>
        </nav>

        <!-- Menu mobile -->
        <Transition name="mobile-menu">
            <div v-if="mobileOpen" class="lg:hidden absolute top-full left-0 right-0 bg-surface-darker border-b border-white/5
                       shadow-xl z-40">

                <div class="flex flex-col py-2">
                    <!-- Liens principaux -->
                    <NuxtLink v-for="item in menuItemsBefore" :key="item.route" :to="item.route"
                        @click="mobileOpen = false"
                        class="flex items-center gap-3 px-5 py-3 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors"
                        exact-active-class="!text-white bg-white/5">
                        {{ item.label }}
                    </NuxtLink>

                    <!-- Ma page -->
                    <div>
                        <button @click="maPageMobileOpen = !maPageMobileOpen"
                            class="flex items-center justify-between w-full px-5 py-3 text-sm text-muted hover:text-white hover:bg-white/5">
                            Ma page
                            <Icon name="lucide:chevron-down" size="14" class="transition-transform duration-200"
                                :class="maPageMobileOpen ? 'rotate-180' : ''" />
                        </button>
                        <div v-if="maPageMobileOpen">
                            <NuxtLink v-for="sub in maPageItems" :key="sub.to" :to="sub.to" @click="mobileOpen = false"
                                class="flex items-center gap-3 pl-8 pr-5 py-2.5 text-sm text-muted hover:text-white hover:bg-white/5"
                                exact-active-class="!text-white bg-white/5">
                                {{ sub.label }}
                            </NuxtLink>
                        </div>
                    </div>

                    <NuxtLink v-for="item in menuItemsAfter" :key="item.route" :to="item.route"
                        @click="mobileOpen = false"
                        class="flex items-center gap-3 px-5 py-3 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors"
                        exact-active-class="!text-white bg-white/5">
                        {{ item.label }}
                    </NuxtLink>
                </div>
            </div>
        </Transition>
    </header>

    <NotificationBanner />
</template>

<script setup>
const { balance } = useWallet()

const menuItemsBefore = [
    { label: 'Découverte', route: '/discover' },
    { label: 'Tableau de bord', route: '/dashboard' },
]
const menuItemsAfter = [
    { label: 'Planning', route: '/schedule' },
    { label: 'Boutique', route: '/shop' },
]

const maPageItems = [
    { label: 'Liens', to: '/admin/links' },
    { label: 'Design', to: '/admin/design' },
]

// Dropdowns
const maPageOpen = ref(false)
const maPageMobileOpen = ref(false)
const avatarOpen = ref(false)
const mobileOpen = ref(false)
const maPageRef = ref(null)
const avatarRef = ref(null)

const handleClickOutside = (e) => {
    if (maPageRef.value && !maPageRef.value.contains(e.target)) maPageOpen.value = false
    if (avatarRef.value && !avatarRef.value.contains(e.target)) avatarOpen.value = false
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

// Auth
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const logOut = async () => {
    try {
        await supabase.auth.signOut()
        router.push('/')
    } catch (err) {
        console.error('Erreur lors de la déconnexion:', err)
    }
}

const streamerStore = useStreamerStore()
const { streamer } = storeToRefs(streamerStore)

watch(user, async (u) => {
    if (!u || streamer.value) return
    await streamerStore.fetchStreamer()
}, { immediate: true })

const isAdmin = computed(() => streamer.value?.is_admin ?? false)

const popoverItems = ref([
    {
        label: 'Menu',
        items: [
            { label: 'Statistiques', icon: 'lucide:chart-column', route: '/_secret-admin/dashboard', adminOnly: true },
            { label: 'Mails', icon: 'lucide:mail', route: '/_secret-admin/mails', adminOnly: true },
            { label: 'Compte', icon: 'lucide:user', route: '/admin/account' },
            { label: 'Facturation', icon: 'lucide:credit-card', route: '/admin/billing' },
            { label: 'Déconnexion', icon: 'lucide:log-out', command: () => logOut() },
        ],
    },
])

const filteredPopoverItems = computed(() =>
    popoverItems.value.map(group => ({
        ...group,
        items: group.items.filter(item => !item.adminOnly || isAdmin.value),
    }))
)
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
