<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const characters = ref([]);


// Konstanta Game 
const dailyGeneration = 10000;
const maxFocus = 30000;
const hoursPerDay = 24;


const loadCharacters = () => {
    const stored = localStorage.getItem('albionFocusCharacters');
    if (stored) {
        try {
            characters.value = JSON.parse(stored);
        } catch (e) {
            console.error("Gagal memuat atau parse data dari Local Storage", e);
            // Fallback jika data rusak
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

const calculatedCharacters = computed(() => {

    // Fungsi helper untuk format timestamp ke string (Ambil dari jawaban sebelumnya)
    const formatTime = (dateObj) => {
        if (!dateObj) return 'Sudah Penuh';
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        return dateObj.toLocaleTimeString('id-ID', options);
    };

    const loopChara = characters.value.map((character) => {
        const now = new Date();
        const charaTimeStamp = new Date(character.timestamp);
        const hoursPassed = (now.getTime() - charaTimeStamp.getTime()) / (1000 * 60 * 60);
        // const focusGenerated = Math.floor(hoursPassed * focusPerHour.value);
        const currentAccumulatedFocus = Math.min(character.focus, maxFocus);
        const remainingFocus = maxFocus - character.focus;
        const remainingHours = remainingFocus / focusPerHour.value;
        let fullFocusTime = null;
        if (remainingHours > 0) {
            fullFocusTime = new Date(now.getTime() + remainingHours * 60 * 60 * 1000);
        }

        return {
            ...character,
            currentAccumulatedFocus: currentAccumulatedFocus,
            remainingFocus: remainingFocus,
            hoursToMax: remainingHours.toFixed(2),
            daysToMax: (remainingHours / hoursPerDay).toFixed(2),
            lastRefreshed: formatDuration(hoursPassed),
            fullFocusTime: formatTime(fullFocusTime),
            fullFocusDateObject: fullFocusTime
        }
    })

    return loopChara;
})



const focusPerHour = computed(() => {
    return dailyGeneration / hoursPerDay;
});


const deleteCharacter = (id) => {
    const character = characters.value.filter(chara => chara.id === id)
    console.log(character)
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus karakter ini "${character[0].username}"? Aksi ini tidak dapat dibatalkan.`);

    if (isConfirmed) {
        characters.value = characters.value.filter(chara => chara.id !== id)
    } else {
        console.log("Tidak jadi menghapus")
    }

}


const calculateCurrentFocus = (character) => {
    // ... (Logika perhitungan fokus real-time) ...
    const focusPerHourValue = dailyGeneration / hoursPerDay;

    const lastTimestamp = new Date(character.timestamp);
    const now = new Date();

    if (isNaN(lastTimestamp.getTime())) return character.focus;

    const hoursPassed = (now.getTime() - lastTimestamp.getTime()) / (1000 * 60 * 60);
    const focusGenerated = Math.floor(hoursPassed * focusPerHourValue);
    const baseFocus = character.focus;

    return Math.min(baseFocus + focusGenerated, maxFocus);
};


const refreshAllFocus = () => {
    const nowIsoString = new Date().toISOString();

    characters.value = characters.value.map(character => {
        // Hitung fokus real-time karakter ini
        const currentAccumulatedFocus = calculateCurrentFocus(character);

        return {
            ...character,
            focus: currentAccumulatedFocus,
            timestamp: nowIsoString,
        };
    });

};

const formatDuration = (hours) => {
    const totalMinutes = Math.floor(hours * 60);
    if (totalMinutes < 60) {
        return `${totalMinutes} menit yang lalu`;
    }
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h} jam ${m} menit yang lalu`;
};

</script>

<template>
    <div class="p-10">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Status Fokus Semua Karakter</h1>
            <div class="flex justify-end gap-2 flex-row">

                <button @click="refreshAllFocus" :disabled="characters.length === 0"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:bg-gray-500">
                    Refresh Fokus SEMUA Karakter
                </button>
                <button @click="router.push('/albion/add')"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:bg-gray-500">
                    Tambah Karakter Baru
                </button>
            </div>
        </div>

        <div class="p-6">
            <div class="grid grid-cols-3 gap-4">
                <div v-for="chara in calculatedCharacters" :key="chara.id"
                    class="mb-4 p-4 border border-gray-700 rounded-lg bg-gray-800 flex flex-col justify-between">
                    <div class="flex flex-col gap-2">
                        <h3 class="text-xl font-semibold text-yellow-400">
                            {{ chara.username }} | {{ chara.email }} | {{ chara.refine.toUpperCase() }} | {{
                                chara.server.toUpperCase() }}
                        </h3>

                        <p class="text-lg text-white">
                            Fokus Saat Ini:
                            <strong class="text-green-500 float-right">
                                {{ chara.currentAccumulatedFocus.toFixed(0).toLocaleString('id-ID') }} / {{
                                    maxFocus.toLocaleString('id-ID') }}
                            </strong>
                        </p>

                        <div class="mt-2 text-sm text-gray-400">
                            <p>Sisa Kapasitas: {{ chara.remainingFocus.toFixed(0).toLocaleString('id-ID') }}</p>
                            <p>Diperlukan Waktu:
                                <strong>{{ chara.hoursToMax }} Jam</strong> ({{ chara.daysToMax }} Hari)
                            </p>
                            <p class="mt-1">
                                Last Refreshed:
                                <strong class="text-blue-400">{{ chara.lastRefreshed }}</strong>
                            </p>
                            <p class="mt-1">
                                Akan Penuh Pada:
                                <strong class="text-blue-400">{{ chara.fullFocusTime }}</strong>
                            </p>
                        </div>
                    </div>
                    <div class="flex justify-end mt-4 gap-2 text-white">

                        <button @click="deleteCharacter(chara.id)"
                            class="bg-rose-500 px-5 py-1 rounded-md">Hapus</button>
                        <button class="bg-orange-500 px-5 py-1 rounded-md"
                            @click="router.push(`/albion/edit/${chara.id}`)">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>