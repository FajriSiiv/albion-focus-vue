<script setup>
import InputForm from '@/components/ui/InputForm.vue';
import SelectForm from '@/components/ui/SelectForm.vue';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const characters = ref([]);
const router = useRouter();

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

const loadCharacters = () => {
    const stored = localStorage.getItem('albionFocusCharacters');
    if (stored) {
        try {
            characters.value = JSON.parse(stored);
        } catch (e) {
            console.error("Gagal memuat atau parse data dari Local Storage", e);
            characters.value = [];
        }
    } else {
        characters.value = [];
    }
}

watch(characters, () => {
    localStorage.setItem('albionFocusCharacters', JSON.stringify(characters.value));
}, { deep: true });


onMounted(loadCharacters);

const newCharacterName = ref('');
const newCharacterEmail = ref('');
const newCharacterServer = ref('');
const newCharacterFocus = ref(0);
const newCharacterRefining = ref('');

// hasError
const newHasError = ref(false);

// Error message
const newCharacterNameError = ref('');
const newCharacterEmailError = ref('');
const newCharacterServerError = ref('');
const newCharacterFocusError = ref('');
const newCharacterRefiningError = ref('');

const handleAddCharacter = () => {
    newCharacterNameError.value = '';
    newCharacterEmailError.value = '';
    newCharacterServerError.value = '';
    newCharacterFocusError.value = '';
    newCharacterRefiningError.value = '';
    newHasError.value = false;

    try {
        if (newCharacterName.value.length === 0) {
            newCharacterNameError.value = 'Username karakter tidak boleh kosong.';
            newHasError.value = true;
            return
        }

        if (newCharacterEmail.value.length === 0) {
            newCharacterEmailError.value = 'Email karakter tidak boleh kosong.';
            newHasError.value = true;
            return
        }

        if (newCharacterServer.value.length === 0) {
            newCharacterServerError.value = 'Server karakter tidak boleh kosong.';
            newHasError.value = true;
            return
        }

        if (newCharacterFocus.value.length === 0) {
            newCharacterFocusError.value = 'Focus karakter tidak boleh kosong.';
            newHasError.value = true;
            return
        }

        if (newCharacterRefining.value.length === 0) {
            newCharacterRefiningError.value = 'Refining karakter tidak boleh kosong.';
            newHasError.value = true;
            return
        }

        characters.value.push({
            id: characters.value.length + 1,
            focus: newCharacterFocus.value,
            username: newCharacterName.value,
            email: newCharacterEmail.value,
            refine: newCharacterRefining.value,
            server: newCharacterServer.value,
            timestamp: Date.now(),
        })

        newCharacterName.value = '';
        newCharacterFocus.value = '';
        newCharacterEmail.value = '';
        newCharacterRefining.value = '';
        newCharacterServer.value = '';

        router.push('/');

    } catch (error) {
        console.error("Gagal menambahkan karakter", error);
    }


}

</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen">
        <button class="absolute top-5 left-5 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="router.push('/albion')">Kembali</button>

        <form @submit.prevent="handleAddCharacter"
            class="flex flex-col gap-2 border-gray-300 border-2 rounded-md p-4 min-w-[500px]">
            <div class="flex flex-col gap-1 mb-4">
                <h1 class="text-4xl font-bold">Albion Player Form</h1>
                <p class="text-gray-500">Isi data player untuk tracking focus</p>
            </div>
            <InputForm label="Username Character" type="text" placeholder="Masukkan Username Karakter"
                v-model="newCharacterName" :error-message="newCharacterNameError" />
            <InputForm label="Email Character" type="email" placeholder="Masukkan Email Karakter"
                v-model="newCharacterEmail" :error-message="newCharacterEmailError" />
            <SelectForm :options="serverOptions" v-model="newCharacterServer" :error-message="newCharacterServerError"
                label="Pilih Server Karakter" placeholder="Pilih server..." :hasError="!!newCharacterServerError" />
            <SelectForm :options="refiningOptions" v-model="newCharacterRefining"
                :error-message="newCharacterRefiningError" label="Pilih Refining Karakter"
                placeholder="Pilih refining..." :hasError="!!newCharacterRefiningError" />
            <div class="flex flex-col gap-2">
                <label>Focus saat ini</label>
                <input type="number" v-model="newCharacterFocus" placeholder="Masukkan Focus saat ini"
                    class="border border-gray-300 rounded p-2">
            </div>

            <p v-if="newHasError" class="text-red-500">Harap isi semua field.</p>

            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-rose-300">Tambah
                Karakter</button>
        </form>
    </div>


</template>
