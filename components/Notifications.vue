<template>
    <Button @click="toggle" severity="contrast" variant="text" rounded
        v-tooltip.bottom="{ value: 'Notifications', autoHide: false }">
        <Bell class="w-5 h-5 text-white" />
    </Button>
    <Popover ref="op">
        <div class="flex flex-col w-[20rem]">

            <!-- Header -->
            <div class="flex justify-between items-center p-2 ">
                <h3 class="font-semibold">Notifications</h3>
                <button class="text-xs text-purple-400 ">
                    Tout marquer comme lu
                </button>
            </div>
            <Divider />

            <!-- Liste de notifications -->
            <div class="flex flex-col max-h-64 overflow-y-auto">
                <div class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <p class="text-sm font-medium">Nouvelle alerte !</p>
                    <p class="text-xs text-gray-500">Il y a 5 min</p>
                </div>
                <Divider />
                <div class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <p class="text-sm font-medium">Notification 2</p>
                    <p class="text-xs text-gray-500">Il y a 30 min</p>
                </div>
                <Divider />
                <div class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <p class="text-sm font-medium">Notification 3</p>
                    <p class="text-xs text-gray-500">Hier</p>
                </div>
            </div>

            <Divider />

            <!-- Footer -->
            <div class="text-center">
                <button class="text-xs text-red-500 hover:underline">
                    Effacer toutes les notifications
                </button>
            </div>

        </div>
    </Popover>
</template>

<script setup>
import { Bell } from 'lucide-vue-next';

const op = ref();

const toggle = (event) => {
    op.value.toggle(event);
}
</script>