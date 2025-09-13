<template>
    <router-link :to="{ path: `/${user.user_metadata.nickname}` }" target="_blank">
        <Button class="whitespace-nowrap" severity="contrast">
            <span>StreamLink</span>
            <ExternalLink class="w-4 h-4" />
        </Button>
    </router-link>
</template>

<script setup>
import { ExternalLink } from 'lucide-vue-next';
const user = useSupabaseUser();
</script>