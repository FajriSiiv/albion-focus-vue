<template>
    <div class="flex flex-col gap-2">
        <label v-if="label" :for="id" class="text-gray-900 ">
            {{ label }}
        </label>

        <input :id="id" :type="type" :value="modelValue" @input="handleInput" :placeholder="placeholder"
            :required="required"
            class="border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            :class="{ 'border-red-500': hasError }" />

        <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// 1. PROPS (Input)
const props = defineProps({
    // Wajib untuk v-model
    modelValue: {
        type: [String, Number],
        default: '',
    },
    label: String,
    placeholder: String,
    type: {
        type: String,
        default: 'text',
    },
    required: {
        type: Boolean,
        default: false,
    },
    errorMessage: String,
    hasError: {
        type: Boolean,
        default: false,
    },
    // generated random id
    id: {
        type: String,
        default: () => `input-${Math.random().toString(36).substring(2, 9)}`,
    },
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (event) => {
    let value = event.target.value;

    // Jika tipe number, pastikan dikembalikan sebagai Number, jika kosong/NaN dikembalikan null
    if (props.type === 'number') {
        value = parseFloat(value);
        if (isNaN(value)) value = null;
    }

    // Mengirim nilai kembali ke komponen Induk
    emit('update:modelValue', value);
};
</script>