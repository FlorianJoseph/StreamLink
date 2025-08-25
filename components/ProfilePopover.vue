<template>
    <div v-if="!user">
        <Button @click="twitchAuth" severity="help">
            <Twitch class="w-5 h-5 text-white" />
            <span class="text-white">Se connecter avec Twitch</span>
        </Button>
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
            <Divider />
        </template>
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span v-if="svgIcons[item.icon]" v-html="svgIcons[item.icon]" />
                    <span>{{ item.label }}</span>
                </a>
            </router-link>
            <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                <span v-if="svgIcons[item.icon]" v-html="svgIcons[item.icon]" />
                <span>{{ item.label }}</span>
            </a>
        </template>
    </Menu>
</template>

<script setup>
import { Twitch } from 'lucide-vue-next';

const svgIcons = {
    LogOut: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>',
    Settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>',
};

const menu = ref();
const items = ref([
    {
        label: 'Profil',
        items: [
            {
                label: 'Édition',
                icon: 'Settings',
                route: '/profil'
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

async function twitchAuth() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo: `https://vcvwxwhiltffzmojiinc.supabase.co/auth/v1/callback`,
            },
        });

        if (error) {
            return;
        }
        router.push('/');

    } catch (err) {
        console.error('Erreur lors de la connexion Twitch:', err);
    }
}

async function logOut() {
    try {
        await supabase.auth.signOut();
        router.push('/');
    } catch (err) {
        console.error('Erreur lors de la déconnexion:', err);
    }
}
</script>
