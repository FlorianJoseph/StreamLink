<template>
    <div class="flex flex-col h-screen overflow-hidden">
        <header>
            <Navbar />
        </header>
        <div class="flex flex-1 overflow-hidden">
            <!-- Contenu principal : scroll indépendant -->
            <main class="flex-1 overflow-y-auto scrollbar-hide">
                <slot />
            </main>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>