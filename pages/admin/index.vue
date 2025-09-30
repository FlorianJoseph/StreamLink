<template>
    <div v-if="loading" class="flex justify-center items-center w-full py-20">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" fill="transparent" animationDuration=".5s"
            aria-label="Custom ProgressSpinner" />
    </div>
    <div v-else class="mt-8">
        <div v-if="!streamer">
            <StreamLinkCreate @created="streamer = $event" />
        </div>
        <div v-else class="flex flex-col lg:flex-row lg:gap-48 gap-4">
            <div class="flex-[2]">
                <StreamLinkEdit />
            </div>
            <div class="flex-[1]">
                <StreamLinkPreview />
            </div>
        </div>
    </div>
</template>

<script setup>

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const loading = ref(true);
const streamer = ref(null);

const fetchStreamer = async () => {
    if (!user.value) {
        loading.value = false;
        return;
    }

    const { data, error } = await supabase
        .from('Streamer')
        .select('*')
        .eq('id', user.value.id)
        .single();

    if (!error) streamer.value = data;
    loading.value = false;
};

onMounted(fetchStreamer);

</script>