<template>
    <div class="py-4 mt-8">
        <div class="flex items-center flex-col lg:items-start h-12 justify-end">
            <h1 class="text-3xl font-bold">Mon Profil</h1>
            <p class="text-center lg:text-left">Modifiez vos informations personnelles</p>
        </div>
    </div>
    <div class="flex flex-col lg:flex-row lg:gap-24 gap-12 mt-8 mb-8">
        <div class="flex-[2]">
            <ProfilCard />
        </div>
        <div class="flex-[1]">
            <Card>
                <template #title>Préférences de collaborations</template>
                <template #content>
                    <div class="card flex flex-wrap justify-center gap-4">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="pizza" inputId="ingredient1" name="pizza" value="Cheese" />
                            <label for="ingredient1"> Cheese </label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="pizza" inputId="ingredient2" name="pizza" value="Mushroom" />
                            <label for="ingredient2"> Mushroom </label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="pizza" inputId="ingredient3" name="pizza" value="Pepper" />
                            <label for="ingredient3"> Pepper </label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="pizza" inputId="ingredient4" name="pizza" value="Onion" />
                            <label for="ingredient4"> Onion </label>
                        </div>
                    </div>

                </template>
            </Card>
        </div>
    </div>
</template>
