<template>
    <div class="flex flex-col h-screen overflow-hidden">
        <!-- Navbar fixe en haut -->
        <header>
            <Navbar />
        </header>

        <!-- Contenu principal -->
        <main class="flex-1 overflow-y-auto">
            <slot />
        </main>
    </div>
</template>
