<template>
        <div class="m-4 py-4">
            <div class="text-center flex flex-col items-center gap-4">
                <div class="flex items-center gap-2">
                    <UserSearch class="w-10 h-10" />
                    <div class="font-bold text-4xl leading-tight">Découvrir des
                        streamers
                    </div>
                </div>
                <div class="text-xl leading-normal">Explorez notre communauté de
                    streameurs talentueux et trouvez votre prochain coup de cœur
                </div>
            </div>
        </div>
        <FilterBar />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
        </div>
</template>

<script setup>
import { UserSearch } from 'lucide-vue-next';
</script>