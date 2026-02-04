<template>
    <div class="flex flex-col min-h-screen">
        <!-- Navbar fixe en haut -->
        <header>
            <Navbar />
        </header>

        <!-- Contenu principal -->
        <main class="mx-4 sm:mx-auto sm:w-[95vw] mb-8 lg:mt-18">
            <slot />
        </main>
    </div>
</template>