<template>
    <div class="flex flex-col gap-4 mt-8 min-w-full">
        <div class="py-4">
            <div class="flex items-center flex-col lg:items-start h-12 justify-end">
                <h1 class="text-3xl font-bold">Mon Profil</h1>
                <p class="text-center lg:text-left">Modifiez vos informations personnelles</p>
            </div>
        </div>
        <div class="flex flex-col gap-4 w-full">
            <ProfilCard />
            <Card>
                <template #title class="text-center">Préférences de collaborations</template>
                <template #content>
                    <div class="card flex flex-wrap gap-4">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="pizza" inputId="ingredient1" name="pizza" value="Cheese" />
                            <label for="ingredient1">Ouvert aux collaborations</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="pizza" inputId="ingredient2" name="pizza" value="Mushroom" />
                            <label for="ingredient2">Ouvert aux raids aléatoires</label>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
