<template>
    <div class="m-4">
        <div class="py-4 md:px-12 lg:px-20">
            <div class="text-center flex flex-col items-center gap-4">
                <div class="flex items-center gap-2">
                    <UserSearch class="w-10 h-10" />
                    <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl leading-tight">Découvrir des
                        streamers
                    </div>
                </div>
                <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">Explorez notre communauté de
                    streameurs talentueux et trouvez votre prochain coup de cœur
                </div>
            </div>
        </div>
        <FilterBar />
        <StreamerCard />
    </div>
</template>

<script setup>
import { UserSearch } from 'lucide-vue-next';
</script>