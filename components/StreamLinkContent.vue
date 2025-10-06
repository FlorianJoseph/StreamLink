<template>
    <Card class="min-h-full w-[580px]">
        <template #title>
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <NuxtLink v-ripple :to="'/'">
                        <Button rounded severity="secondary">
                            <Home />
                        </Button>
                    </NuxtLink>
                    <Button rounded severity="secondary" @click="copyText">
                        <span>Copier le lien</span>
                        <Files />
                    </Button>
                </div>
            </div>

            <div class="flex items-center text-center flex-col mx-auto my-6">
                <img :src="streamer?.avatar_url || 'https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/sign/Streamlink/Avatar/default.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NDMzZjlmNi01NGMzLTQxNzQtYmY0ZC01YzVjZDliNmI2MjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTdHJlYW1saW5rL0F2YXRhci9kZWZhdWx0LnBuZyIsImlhdCI6MTc1OTc0NTEzMCwiZXhwIjoyMDc1MTA1MTMwfQ.IppJUbOxBC5Nihi0dUVSS_bNYmdvWEi5VzzRl5xyAng'"
                    alt="Avatar" class="w-24 h-24 rounded-full object-cover mb-4" />
                <span class="text-xl font-semibold">{{ streamer?.username }}</span>
                <span class="text-base font-medium">
                    {{ streamer?.bio }}
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
                <NuxtLink :to="'/admin'">
                    <Button severity="contrast">
                        <span class="font-semibold">Rejoignez {{ streamer?.username }} sur StreamLink</span>
                        <ArrowRight class="w-4 h-4" />
                    </Button>
                </NuxtLink>
            </div>
        </template>

    </Card>
</template>

<script setup>
import { ArrowRight, Files, Home } from "lucide-vue-next";

const route = useRoute()
const { streamer } = useStreamer();
const { copy } = useClipboard()

const copyText = () => {
    const url = `${window.location.origin}/${route.params.username || ''}`
    copy(url)
}

</script>