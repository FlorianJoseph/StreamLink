<template>
    <Card class="min-h-full">
        <template #title>
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <router-link v-ripple :to="'/'">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40">
                            <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#7c3aed" />
                                    <stop offset="100%" stop-color="#9f5dfc" />
                                </linearGradient>
                            </defs>
                            <g fill="none" stroke="url(#grad)" stroke-width="6" stroke-linecap="round"
                                stroke-linejoin="round">
                                <!-- Hexagone plus large -->
                                <path d="M8 32 L20 8 L44 8 L56 32 L44 56 L20 56 Z" />
                                <!-- Flèche centrale -->
                                <path d="M30 22 L38 32 L30 42" stroke-linecap="round" />
                            </g>
                        </svg>
                    </router-link>
                    <Button rounded severity="contrast">
                        <Files />
                    </Button>
                </div>
            </div>

            <div class="flex items-center text-center flex-col mx-auto my-6">
                <img :src="user.user_metadata.avatar_url" alt="Avatar"
                    class="w-24 h-24 rounded-full object-cover mb-4" />
                <span class="text-xl font-semibold">{{ user.user_metadata.nickname }}</span>
                <span class="text-base font-medium">
                    {{ user.user_metadata.custom_claims.description }}
                </span>
            </div>

        </template>
        <template #content>
            <!-- Liste de liens -->
            <div class="flex flex-col gap-4">
                <CardLink />
            </div>
        </template>

        <template #footer>
            <div class="flex justify-center mt-14">
                <router-link :to="'/streamlink'">
                    <Button severity="contrast">
                        <span class="font-semibold">Rejoignez {{ user.user_metadata.nickname }} sur StreamLink</span>
                        <ArrowRight class="w-4 h-4" />
                    </Button>
                </router-link>
            </div>
        </template>

    </Card>
</template>

<script setup>
import { ArrowRight, Files } from "lucide-vue-next";

const user = useSupabaseUser();
</script>