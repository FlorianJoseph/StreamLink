<template>
    <div class="flex flex-col min-h-screen">
        <!-- Navbar fixe en haut -->
        <header>
            <Navbar />
        </header>

        <!-- Contenu principal -->
        <main class="pt-13">
            <slot />
        </main>
    </div>
</template>
