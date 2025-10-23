<template>
    <div class="relative h-160 lg:min-h-0 flex lg:flex-row flex-col">
        <div class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1">
            <div class="relative flex-1 z-20 flex items-center justify-center">
                <div class="flex items-center justify-center h-full">
                    <div class="flex flex-col items-center w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
                        <h1 class="text-4xl xl:text-5xl font-bold mb-6 leading-tight!">
                            <span class="block">Développe ta chaîne</span>
                            <span class="block text-purple-500">avec StreamLink</span>
                        </h1>
                        <p class="text-lg md:text-xl leading-normal mb-8 max-w-xl lg:max-w-none">
                            StreamLink est un outil pensé pour les petits créateurs et streameurs.
                        </p>
                        <NuxtLink to="/admin">
                            <button
                                class="flex items-center justify-center gap-2 px-5 py-3 text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                <span>{{ user ? "Modifier mon StreamLink" : "Créer mon StreamLink"
                                }}</span>
                            </button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
                <div class="absolute lg:hidden inset-0 z-10" />
                <img :src="backgroundImg"
                    class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]" />
            </div>
        </div>
    </div>
</template>

<script setup>
const user = useSupabaseUser()
const backgroundImg = "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/sign/images/arriere-plan-lignes-violettes-dynamiques-gradient_23-2148995757.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NDMzZjlmNi01NGMzLTQxNzQtYmY0ZC01YzVjZDliNmI2MjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvYXJyaWVyZS1wbGFuLWxpZ25lcy12aW9sZXR0ZXMtZHluYW1pcXVlcy1ncmFkaWVudF8yMy0yMTQ4OTk1NzU3LmpwZyIsImlhdCI6MTc2MDg3NDE5NSwiZXhwIjoxNzkyNDEwMTk1fQ.AgXqRJ--nS8npOmJ5mzmaeHEQL1U7FgBs3ZtFpOuC-s"
</script>