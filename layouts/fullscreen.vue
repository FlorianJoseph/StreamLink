<template>
    <div class="flex flex-col h-screen overflow-hidden">
        <!-- Navbar fixe en haut -->
        <header>
            <Navbar />
        </header>

        <!-- Contenu principal -->
        <main class="flex-1 overflow-y-auto">
            <div class="mx-4 sm:mx-auto sm:w-[90vw] py-6">
                <slot />
            </div>
        </main>
    </div>
</template>