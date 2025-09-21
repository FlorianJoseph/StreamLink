<template>
    <Card class="min-h-full">
        <template #title>
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <NuxtLink v-ripple :to="'/'">
                        <Button rounded severity="secondary">
                            <Home />
                        </Button>
                    </NuxtLink>
                    <Button rounded severity="secondary">
                        <span>Copier le lien</span>
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
                <LinkCard />
            </div>
        </template>

        <template #footer>
            <div class="flex justify-center mt-14">
                <NuxtLink :to="'/streamlink'">
                    <Button severity="contrast">
                        <span class="font-semibold">Rejoignez {{ user.user_metadata.nickname }} sur StreamLink</span>
                        <ArrowRight class="w-4 h-4" />
                    </Button>
                </NuxtLink>
            </div>
        </template>

    </Card>
</template>

<script setup>
import { ArrowRight, Files, Home, Link } from "lucide-vue-next";

const user = useSupabaseUser();
</script>