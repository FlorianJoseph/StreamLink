<template>
    <div class="px-6 py-8 md:px-12 lg:px-20">
        <div class="flex items-center flex-col lg:flex-row lg:justify-between">
            <div class="flex items-start flex-col md:flex-row gap-8">
                <Avatar :image="user.user_metadata.avatar_url" size="xlarge" shape="circle" />
                <div class="flex flex-col gap-4">
                    <div class="flex items-center">
                        <span class="text-surface-900 dark:text-surface-0 font-bold text-3xl">{{
                            user.user_metadata.nickname }}</span>
                    </div>
                    <div class="flex items-center flex-wrap gap-8">
                        <div>
                            <span>Followers</span>
                            <div class="mt-1 text-sm font-semibold">521</div>
                        </div>
                        <div>
                            <span>Projects</span>
                            <div class=" mt-1 text-sm font-semibold">10</div>
                        </div>
                        <div>
                            <span>Collections</span>
                            <div class=" mt-1 text-sm font-semibold">54</div>
                        </div>
                        <div>
                            <span>Shots</span>
                            <div class="mt-1 text-sm font-semibold">546</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-6 md:mt-0 flex items-center">
                <router-link class="mr-3" :to="'/profil'">
                    <Button class="whitespace-nowrap" outlined>
                        <SquarePen class="w-4 h-4" />
                        <span>Modifier le profil</span>
                    </Button>
                </router-link>
                <router-link :to="'/parametres'">
                    <Button class="whitespace-nowrap">
                        <Settings class="w-4 h-4" />
                        <span>Paramètres</span>
                    </Button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { SquarePen, Settings } from 'lucide-vue-next';

const user = useSupabaseUser()

</script>