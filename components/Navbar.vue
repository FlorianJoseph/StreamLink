<template>
    <Menubar :model="menuItems" class="h-13 fixed top-0 left-0 right-0 z-100" style="--p-menubar-border-radius:0">
        <template #start>
            <NuxtLink v-ripple :to="'/'">
                <Home />
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
            <div v-if="!user">
                <NuxtLink to="/auth/login">
                    <button
                        class="flex flex-row items-center gap-2 px-3 py-2 text-lg bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Icon name="lucide:twitch" size="20" />
                        <span class="text-xs sm:text-base font-semibold">Se connecter avec Twitch</span>
                    </button>
                </NuxtLink>
            </div>
            <div v-else>
                <div class="flex items-center gap-2">
                    <a href="https://discord.gg/fVFguWc76b" target="_blank"
                        class="hover:opacity-80 transition-opacity pt-1.5 mr-2" v-tooltip.bottom="'Rejoindre le Discord'">
                        <Icon name="simple-icons:discord" size="24"/>
                    </a>
                    <button class="flex items-center gap-2 p-1 hover:cursor-pointer hover:bg-zinc-300/10 rounded-md"
                        @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
                        <Avatar :image="user.user_metadata.avatar_url" shape="circle" />
                        <span class="text-sm sm:text-base font-medium">{{ user.user_metadata.nickname }}</span>
                        <Icon name="lucide:chevron-down" size="16" />
                    </button>
                </div>
                <Menu ref="menu" id="overlay_menu" :model="filteredPopoverItems" :popup="true">
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
            </div>
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

const isAdmin = ref(false);
const streamerStore = useStreamerStore();
const { streamer } = storeToRefs(streamerStore);

onMounted(async () => {
    await streamerStore.fetchStreamer();
    if (streamer.value?.is_admin) {
        isAdmin.value = true;
    } else {
        isAdmin.value = false;
    }
});

const filteredPopoverItems = computed(() => {
    return popoverItems.value.map(group => {
        return {
            ...group,
            items: group.items.filter(item => !item.adminOnly || isAdmin.value)
        };
    });
});

</script>