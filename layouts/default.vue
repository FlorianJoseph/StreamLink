<template>
    <div class="flex flex-col min-h-screen">
        <!-- Navbar fixe en haut -->
        <header>
            <Navbar />
        </header>

        <!-- Contenu principal -->
        <main class="mx-4 sm:mx-auto sm:max-w-[75vw] pt-0 sm:pt-13">
            <slot />
        </main>
    </div>
</template>
