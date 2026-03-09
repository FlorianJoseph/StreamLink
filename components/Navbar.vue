<template>
    <Menubar :model="menuItems" class="h-13" style="--p-menubar-border-radius:0; --p-menubar-border-color: transparent">
        <template #start>
            <NuxtLink v-ripple :to="'/'">
                <Home :size="20" />
            </NuxtLink>
        </template>
        <template #item="{ item, props, hasSubmenu, root }">
            <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <Icon :name=item.icon size="20" />
                    <span class="font-medium">{{ item.label }}</span>
                    <Icon v-if="hasSubmenu" :name="root ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                        class="ml-auto" size="20" />
                    <Tag v-if="item.badge" :value="item.badge" class="text-xs" />
                </a>
            </NuxtLink>
            <!-- Cas où l’item n’a pas de route -->
            <div v-else v-bind="props.action">
                <Icon :name="item.icon" size="20" />
                <span class="font-medium">{{ item.label }}</span>
                <Tag v-if="item.badge" :value="item.badge" class=" text-xs" />
                <Icon v-if="hasSubmenu" :name="root ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="ml-auto"
                    size="20" />
            </div>
        </template>
        <template #end>
            <div class="flex items-center gap-2">
                <a href="https://discord.gg/fVFguWc76b" target="_blank"
                    class="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-zinc-300/10"
                    v-tooltip.bottom="{ value: 'Rejoindre le Discord', pt: { text: '!text-sm' } }">
                    <Icon name="simple-icons:discord" size="24" />
                </a>
                <template v-if="!user">
                    <NuxtLink to="/auth/login">
                        <button
                            class="flex flex-row items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                            <Icon name="simple-icons:twitch" size="20" />
                            <span class="text-sm sm:text-base font-semibold">Connexion Twitch</span>
                        </button>
                    </NuxtLink>
                </template>
                <template v-else>
                    <button
                        class="flex items-center gap-2 py-1 px-2 hover:cursor-pointer hover:bg-zinc-300/10 rounded-md"
                        @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
                        <Avatar :image="user.user_metadata.avatar_url" shape="circle" />
                        <span class="text-sm sm:text-base font-medium">{{ user.user_metadata.nickname }}</span>
                        <Icon name="lucide:chevron-down" size="20" />
                    </button>
                </template>
            </div>
            <Menu ref="menu" id="overlay_menu" :model="filteredPopoverItems" :popup="true" class="w-52" :pt="{ root: { style: 'right: 0.5rem; left: auto !important' } }">
                <template #item="{ item, props }">
                    <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                            <Icon :name="item.icon" size="20" />
                            <span>{{ item.label }}</span>
                        </a>
                    </NuxtLink>
                    <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                        <Icon :name="item.icon" size="20" />
                        <span>{{ item.label }}</span>
                    </a>
                </template>
            </Menu>
        </template>
    </Menubar>
    <NotificationBanner />
</template>

<script setup>
import { Home } from 'lucide-vue-next';

const menuItems = ref([
    {
        label: 'Découvrir des streameurs',
        icon: 'lucide:user-search',
        route: '/discover',
    },
    {
        label: 'Tableau de bord',
        icon: 'lucide:layout-dashboard',
        route: '/dashboard',
    },
    {
        label: 'Mon StreamLink',
        icon: 'lucide:grid-2x2-plus',
        items: [
            {
                route: '/admin/links',
                label: 'Liens',
                icon: 'lucide:link',
            },
            {
                route: '/admin/design',
                label: 'Design',
                icon: 'lucide:palette'
            },
        ]
    },
    {
        label: 'Planning',
        icon: 'lucide:calendar-days',
        route: '/schedule',
    },
]);

const menu = ref();
const popoverItems = ref([
    {
        label: 'Menu',
        items: [
            {
                label: 'Statistiques',
                icon: 'lucide:chart-column',
                route: '/_secret-admin/dashboard',
                adminOnly: true
            },
            {
                label: 'Newsletter',
                icon: 'lucide:mail',
                route: '/_secret-admin/mails',
                adminOnly: true
            },
            {
                label: 'Compte',
                icon: 'lucide:user',
                route: '/admin/account'
            },
            {
                label: 'Déconnexion',
                icon: 'lucide:log-out',
                command: () => {
                    logOut();
                }
            }
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

const supabase = useSupabaseClient();
const user = useSupabaseUser()
const router = useRouter();

async function logOut() {
    try {
        await supabase.auth.signOut();
        router.push('/');
    } catch (err) {
        console.error('Erreur lors de la déconnexion:', err);
    }
}

const isAdmin = computed(() => streamer.value?.is_admin ?? false)
const streamerStore = useStreamerStore();
const { streamer } = storeToRefs(streamerStore);

watch(user, async (u) => {
    if (!u || streamer.value) return
    await streamerStore.fetchStreamer()
}, { immediate: true })

const filteredPopoverItems = computed(() => {
    return popoverItems.value.map(group => {
        return {
            ...group,
            items: group.items.filter(item => !item.adminOnly || isAdmin.value)
        };
    });
});

</script>