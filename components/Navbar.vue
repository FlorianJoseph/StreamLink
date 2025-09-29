<template>
    <Menubar :model="items" class="h-13 fixed top-0 left-0 right-0 z-50">
        <template #start>
            <NuxtLink v-ripple :to="'/'">
                <Home />
            </NuxtLink>
        </template>
        <template #item="{ item, props }">
            <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span v-if="svgIcons[item.icon]" v-html="svgIcons[item.icon]" />
                    <span class="font-medium">{{ item.label }}</span>
                </a>
            </NuxtLink>
        </template>
        <template #end>
            <ProfilePopover />
        </template>
    </Menubar>
</template>

<script setup>
import { Home } from 'lucide-vue-next';

const svgIcons = {
    UserSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-search-icon lucide-user-search"><circle cx="10" cy="7" r="4"/><path d="M10.3 15H7a4 4 0 0 0-4 4v2"/><circle cx="17" cy="17" r="3"/><path d="m21 21-1.9-1.9"/></svg>',
    LogOut: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>',
    Link: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    Waypoints: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-waypoints-icon lucide-waypoints"><circle cx="12" cy="4.5" r="2.5"/><path d="m10.2 6.3-3.9 3.9"/><circle cx="4.5" cy="12" r="2.5"/><path d="M7 12h10"/><circle cx="19.5" cy="12" r="2.5"/><path d="m13.8 17.7 3.9-3.9"/><circle cx="12" cy="19.5" r="2.5"/></svg>',
};

const items = ref([
    // {
    //     label: 'Streameurs',
    //     icon: 'UserSearch',
    //     route: '/streameurs'
    // },
    {
        label: 'Mon StreamLink',
        icon: 'Link',
        route: '/admin',
    },
    // {
    //     label: 'Roadmap',
    //     icon: 'Waypoints',
    //     route: '/',
    // },
]);

</script>