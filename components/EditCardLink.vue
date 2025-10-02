<template>
    <div class="flex flex-col gap-2 w-full">
        <!-- Bouton Ajouter un lien -->
        <Button class="w-full" severity="contrast" @click="visible = true">
            <Plus class="w-5 h-5" />
            <span class="font-medium">Ajouter un lien</span>
        </Button>

        <!-- Liste des liens -->
        <div v-if="links.length === 0" class="text-gray-400 text-sm text-center py-4">
            Aucun lien pour l’instant. Cliquez sur "Ajouter un lien" pour commencer
        </div>
        <div v-else v-for="link in links" :key="link.id" class="rounded-lg p-4 bg-gray-100/10">
            <!-- Header -->
            <div class="flex items-center gap-2 mb-2">
                <span class="text-lg font-semibold">{{ link.title }}</span>
                <Pencil class="w-4 h-4 cursor-pointer" @click="editLink(link)" />
            </div>

            <!-- Content -->
            <div class="flex justify-between items-center">
                <div class="flex gap-2 items-center">
                    <p class="m-0 text-sm">{{ link.url }}</p>
                    <Pencil class="w-4 h-4 cursor-pointer" @click="editLink(link)" />
                </div>
                <div class="flex gap-2">
                    <Trash2 class="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors"
                        @click="confirmDelete(link.id)" />
                </div>
            </div>
        </div>

        <!-- Modal Ajouter / Modifier -->
        <Dialog v-model:visible="visible" modal header="Lien" :style="{ width: '25rem' }">
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="title">Titre</label>
                    <InputText id="title" v-model="form.title" placeholder="Ex: Twitch" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="url">URL</label>
                    <InputText id="url" v-model="form.url" placeholder="https://..." />
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Annuler" severity="secondary" @click="resetForm()" />
                    <Button type="button" label="Sauvegarder" severity="contrast" :disabled="!form.title || !form.url"
                        @click="saveLink()" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>

import { Plus, Pencil, Trash2 } from 'lucide-vue-next';

const { links, addLink, updateLink, deleteLink } = useLink()

const visible = ref(false)
const editingLink = ref(null)
const form = reactive({ title: '', url: '' })

const resetForm = () => {
    form.title = ''
    form.url = ''
    editingLink.value = null
    visible.value = false
}

const editLink = (link) => {
    form.title = link.title
    form.url = link.url
    editingLink.value = link
    visible.value = true
}

const saveLink = async () => {
    if (editingLink.value) {
        await updateLink(editingLink.value.id, { title: form.title, url: form.url })
    } else {
        await addLink({ title: form.title, url: form.url })
    }
    resetForm()
}

const confirmDelete = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer ce lien ?")) {
        await deleteLink(id)
    }
}

</script>
