<template>
    <div class="flex flex-col min-h-screen">
        <!-- Navbar fixe en haut -->
        <header>
            <Navbar />
        </header>

        <!-- Contenu principal -->
        <main class="mx-auto max-w-[75vw] pt-13">
            <slot />
        </main>
    </div>
</template>
