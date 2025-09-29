<template>
    <img :src="user.user_metadata.avatar_url" alt="Avatar" class="w-16 h-16 rounded-full object-cover flex-shrink-0" />
</template>

<script setup>
const user = useSupabaseUser()
</script>