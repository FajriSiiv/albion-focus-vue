<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import InputForm from '@/components/ui/InputForm.vue';
import SelectForm from '@/components/ui/SelectForm.vue';

const route = useRoute();
const router = useRouter()
const id = route.params.id;
const characters = ref([]);
const characterToEdit = ref(null);

const serverOptions = [
    { value: 'europe', text: 'Albion Europe (Europe)' },
    { value: 'west', text: 'Albion West (Global)' },
    { value: 'east', text: 'Albion East (Asia)' },
];

const refiningOptions = [
    { value: 'plank', text: 'Plank' },
    { value: 'steel', text: 'Steel' },
    { value: 'cloth', text: 'Cloth' },
    { value: 'leather', text: 'Leather' },
];

const editCharacterName = ref('');
const editCharacterEmail = ref('');
const editCharacterServer = ref('');
const editCharacterRefining = ref('');
const editCharacterFocus = ref('');


const editHasError = ref(false);
const editCharacterNameError = ref('');
const editCharacterEmailError = ref('');
const editCharacterServerError = ref('');
const editCharacterRefiningError = ref('');

const loadCharacters = (id) => {
    const charaId = parseInt(id);


    if (isNaN(charaId)) {
        router.push('/');
        return;
    }

    try {
        const storedData = localStorage.getItem('albionFocusCharacters');
        if (storedData) {
            const allCharacters = JSON.parse(storedData);

            characters.value = allCharacters;

            const foundCharacter = allCharacters.find((item) => item.id === charaId);

            if (foundCharacter) {
                characterToEdit.value = foundCharacter;
                editCharacterName.value = foundCharacter.username;
                editCharacterEmail.value = foundCharacter.email;
                editCharacterServer.value = foundCharacter.server;
                editCharacterRefining.value = foundCharacter.refine;
                editCharacterFocus.value = foundCharacter.focus;
            } else {
                console.error(`Karakter dengan ID ${charaId} tidak ditemukan.`);
                characters.value = [];
            }
        }
    } catch (error) {
        console.error("Gagal memuat data dari Local Storage:", error);
    }
}



onMounted(() => {
    loadCharacters(id)
})

const handleEditCharacter = () => {
    const originalTimestamp = characterToEdit.value ? characterToEdit.value.timestamp : new Date().toISOString();

    if (editCharacterName.value.length === 0) {
        editCharacterNameError.value = 'Username karakter tidak boleh kosong.';
        editHasError.value = true;
        return
    }

    if (editCharacterEmail.value.length === 0) {
        editCharacterEmailError.value = 'Email karakter tidak boleh kosong.';
        editHasError.value = true;
        return
    }

    if (editCharacterServer.value.length === 0) {
        editCharacterServerError.value = 'Server karakter tidak boleh kosong.';
        editHasError.value = true;
        return
    }

    if (editCharacterFocus.value.length === 0) {
        editCharacterFocusError.value = 'Focus karakter tidak boleh kosong.';
        editHasError.value = true;
        return
    }

    if (editCharacterRefining.value.length === 0) {
        editCharacterRefiningError.value = 'Refining karakter tidak boleh kosong.';
        editHasError.value = true;
        return
    }


    const updatedCharacterData = {
        id: parseInt(id),
        username: editCharacterName.value,
        email: editCharacterEmail.value,
        server: editCharacterServer.value,
        refine: editCharacterRefining.value,
        focus: parseFloat(editCharacterFocus.value),
        timestamp: originalTimestamp,
    };


    characters.value = characters.value.map(chara => {
        if (chara.id === parseInt(id)) {
            return updatedCharacterData;
        }
        return chara;
    });

    editHasError.value = false;

    router.push('/');
}

watch([characters, characterToEdit], ([newCharacters, newCharacterToEdit]) => {
    localStorage.setItem('albionFocusCharacters', JSON.stringify(newCharacters));
}, { deep: true });

</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen">
        <button class="absolute top-5 left-5 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="router.push('/')">Kembali</button>

        <form @submit.prevent="handleEditCharacter"
            class="flex flex-col gap-2 border-gray-300 border-2 rounded-md p-4 min-w-[500px]">
            <div class="flex flex-col gap-1 mb-4">
                <h1 class="text-4xl font-bold">Albion Player Form</h1>
                <p class="text-gray-500">Isi data player untuk tracking focus</p>
            </div>
            <InputForm label="Username Character" type="text" placeholder="Masukkan Username Karakter"
                v-model="editCharacterName" :error-message="editCharacterNameError"
                :hasError="!!editCharacterNameError" />
            <InputForm label="Email Character" type="email" placeholder="Masukkan Email Karakter"
                v-model="editCharacterEmail" :error-message="editCharacterEmailError"
                :hasError="!!editCharacterEmailError" />
            <SelectForm :options="serverOptions" v-model="editCharacterServer" :error-message="editCharacterServerError"
                label="Pilih Server Karakter" placeholder="Pilih server..." :hasError="!!editCharacterServerError" />
            <SelectForm :options="refiningOptions" v-model="editCharacterRefining"
                :error-message="editCharacterRefiningError" label="Pilih Refining Karakter"
                placeholder="Pilih refining..." :hasError="!!editCharacterRefiningError" />
            <div class="flex flex-col gap-2">
                <label>Focus saat ini</label>
                <input type="number" v-model="editCharacterFocus" placeholder="Masukkan Focus saat ini"
                    class="border border-gray-300 rounded p-2">
            </div>

            <p v-if="editHasError" class="text-red-500">Harap isi semua field.</p>

            <button type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-rose-300 cursor-pointer">Edit
                Karakter</button>
        </form>
    </div>
</template>