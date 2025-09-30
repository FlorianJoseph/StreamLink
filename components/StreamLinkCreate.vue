<template>
    <div class="flex flex-col gap-4">
        <div class="py-4">
            <div class="flex flex-col items-center h-12 justify-end">
                <h1 class="text-3xl font-bold">Créer mon StreamLink</h1>
                <p class="text-center lg:text-left">
                    Créez votre page de liens personnalisée à partager avec votre audience
                </p>
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <InputGroup>
                <InputGroupAddon>streamlink/</InputGroupAddon>
                <InputText v-model="form.username" placeholder="Nom d'utilisateur" />
            </InputGroup>

            <button type="button" @click="createStreamlink"
                class="bg-purple-600 font-medium text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                Créer mon StreamLink
            </button>
        </div>
    </div>
</template>

<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();
const emit = defineEmits(['created'])

const form = ref({
    username: user.value?.user_metadata.nickname || '',
});

const createStreamlink = async () => {
    if (!form.value.username) return;

    const { data, error } = await supabase
        .from('Streamer')
        .insert({
            id: user.value.id,
            username: form.value.username,
            updatedAt: new Date(),
        })
        .select()
        .single();

    if (!error) {
        emit('created', data)
        router.push('/admin')
    } else {
        console.error('Erreur création StreamLink', error);
    }
};
</script>
