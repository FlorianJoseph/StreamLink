<template>
    <div v-if="!user">
        <NuxtLink to="/auth/login">
            <button
                class="flex flex-row items-center gap-2 px-3 py-2 text-lg bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Icon name="lucide:twitch" size="20" />
                <span class="text-base font-semibold">Se connecter avec Twitch</span>
            </button>
        </NuxtLink>
    </div>
    <div v-else>
        <Avatar :image="user.user_metadata.avatar_url" shape="circle" @click="toggle" aria-haspopup="true"
            aria-controls="overlay_menu" class="hover:cursor-pointer" />
    </div>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
        <template #start>
            <span class="inline-flex items-center gap-2 px-2 py-2">
                <Avatar :image="user.user_metadata.avatar_url" shape="circle" />
                <span class="font-medium">{{ user.user_metadata.nickname }}</span>
            </span>
        </template>
        <template #item="{ item, props }">
            <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span v-if="svgIcons[item.icon]" v-html="svgIcons[item.icon]" />
                    <span>{{ item.label }}</span>
                </a>
            </NuxtLink>
            <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                <span v-if="svgIcons[item.icon]" v-html="svgIcons[item.icon]" />
                <span>{{ item.label }}</span>
            </a>
        </template>
    </Menu>
</template>

<script setup>
const svgIcons = {
    User: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    LogOut: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>',
};

const menu = ref();
const items = ref([
    {
        items: [
            {
                label: 'Compte',
                icon: 'User',
                route: '/admin/account'
            },
            {
                label: 'Déconnexion',
                icon: 'LogOut',
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
</script>
