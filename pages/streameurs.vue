<template>
    <div class="flex flex-col gap-4 mt-8">
        <div class="py-4">
            <div class="flex items-center flex-col h-12 justify-end">
                <h1 class="text-3xl font-bold">Découvrir des
                    streamers</h1>
                <p class="text-center lg:text-left">Découvrir des
                    streamers talentueux et trouvez votre prochain coup de cœur</p>
            </div>
        </div>
        <FilterBar />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
            <StreamerCard />
        </div>
    </div>
</template>