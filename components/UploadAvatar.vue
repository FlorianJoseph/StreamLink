<template>
    <img :src="streamer?.avatarUrl || 'https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Avatar/default/avatar.png'"
        alt="Avatar" class="w-16 h-16 rounded-full object-cover flex-shrink-0" />
</template>

<script setup>
const streamer = useStreamer();
</script>