<template>
    <Menubar :model="items" class="h-13 fixed top-0 left-0 right-0 z-50" style="--p-menubar-border-radius:0">
        <template #start>
            <NuxtLink v-ripple :to="'/'">
                <Home />
            </NuxtLink>
        </template>
        <template #item="{ item, props }">
            <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <Icon :name=item.icon size="20" />
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

const items = ref([
    {
        label: 'Découvrir',
        icon: 'lucide:user-search',
        route: '/discover'
    },
    {
        label: 'Mon StreamLink',
        icon: 'lucide:link',
        route: '/admin',
    },
]);

</script>