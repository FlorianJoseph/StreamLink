<template>
    <div class="flex flex-col min-h-screen">
        <!-- Navbar fixe en haut -->
        <header>
            <Navbar />
        </header>

        <!-- Contenu principal -->
        <main>
            <slot />
        </main>
    </div>
</template>
