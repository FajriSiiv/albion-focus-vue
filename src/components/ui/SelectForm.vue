<template>
    <div class="flex flex-col gap-2">

        <label v-if="label" :for="id" class="block text-black">
            {{ label }}
        </label>

        <select :id="id" :value="modelValue" @change="handleChange" :disabled="disabled" class="w-full p-2 rounded border border-gray-300
             focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none 
             transition duration-150 cursor-pointer"
            :class="{ 'border-red-500 ring-red-500': hasError, 'opacity-50 cursor-not-allowed': disabled }">
            <option v-if="placeholder" :value="null" disabled class="text-black">
                {{ placeholder }}
            </option>

            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.text }}
            </option>
        </select>

        <p v-if="errorMessage" class="mt-1 text-sm text-red-400">{{ errorMessage }}</p>

    </div>
</template>

<script setup>
// PROPS (Input)
const props = defineProps({
    // Nilai v-model
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
    // Array pilihan (Wajib)
    options: {
        // Format data: [{ value: 'VAL', text: 'TAMPILAN' }]
        type: Array,
        required: true,
    },
    label: String,
    placeholder: {
        type: String,
        default: 'Pilih salah satu...'
    },
    id: {
        type: String,
        default: () => `select-${Math.random().toString(36).substring(2, 9)}`,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    errorMessage: String,
    hasError: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (event) => {
    // Mengirim nilai yang dipilih kembali ke komponen Induk
    emit('update:modelValue', event.target.value);
};
</script>