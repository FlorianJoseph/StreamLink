<template>
    <Menubar :model="items">
        <template #start>
            <h1 class="text-xl font-bold p-1.5 bg-purple-600 rounded">StreamHub</h1>
        </template>
        <template #item>
        </template>
        <template #end>
            <div class="flex items-center gap-2">
                <div class="flex items-center gap-2 mr-2">
                    <router-link v-ripple :to="'/notifications'">
                        <span v-html="svgIcons.Bell" />
                    </router-link>
                    <router-link v-ripple :to="'/parametres'">
                        <span v-html="svgIcons.Settings" />
                    </router-link>
                </div>
                <div class="mr-2">
                    <div v-if="!user">
                        <Button @click="twitchAuth" severity="help">
                            <Twitch class="w-5 h-5 text-white" />
                            <span class="text-white">Se connecter avec Twitch</span>
                        </Button>
                    </div>
                    <div v-else class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <Avatar :image="user.user_metadata.avatar_url" shape="circle" />
                            <router-link :to="'/profil'" class="hover:underline">
                                {{ user.user_metadata.nickname }}
                            </router-link>
                        </div>
                        <a @click="logOut()" v-ripple>
                            <span v-html="svgIcons.LogOut" />
                        </a>
                    </div>
                </div>
            </div>
        </template>
    </Menubar>

    <Menubar :model="items">
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span v-if="svgIcons[item.icon]" v-html="svgIcons[item.icon]" />
                    <span>{{ item.label }}</span>
                </a>
            </router-link>
        </template>
    </Menubar>
</template>

<script setup>
import { Twitch } from 'lucide-vue-next';

const svgIcons = {
    House: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    UserSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-search-icon lucide-user-search"><circle cx="10" cy="7" r="4"/><path d="M10.3 15H7a4 4 0 0 0-4 4v2"/><circle cx="17" cy="17" r="3"/><path d="m21 21-1.9-1.9"/></svg>',
    Bell: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>',
    LogOut: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>',
    Settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>',
};

const items = ref([
    {
        label: 'Accueil',
        icon: 'House',
        route: '/'
    },
    {
        label: 'Streameurs',
        icon: 'UserSearch',
        route: '/streameurs'
    },
    {
        label: 'Linktree',
        icon: 'Bell',
        route: '/linktree'
    },
]);

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