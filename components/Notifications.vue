<template>
    <Button @click="toggle" class="cursor-pointer" severity="contrast">
        <Bell />
    </Button>
    <Popover ref="op">
        <div class="flex flex-col gap-4 w-[25rem]">
            <div>
                <p>Zone de notifications</p>
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