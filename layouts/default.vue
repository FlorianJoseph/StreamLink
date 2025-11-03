<template>
    <div class="flex flex-col min-h-screen">
        <!-- Navbar fixe en haut -->
        <header>
            <Navbar />
        </header>

        <!-- Contenu principal -->
        <main class="mx-4 sm:mx-auto sm:w-[90vw] lg:w-[75vw] mb-8 lg:mt-18 lg:flex lg:justify-center">
            <slot />
        </main>
    </div>
</template>
