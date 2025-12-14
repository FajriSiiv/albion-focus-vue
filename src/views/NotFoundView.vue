<script setup lang="ts">
import router from '@/router';

</script>

<template>
    <div class="h-screen w-full flex justify-center items-center flex-col gap-3">
        <h1 class="text-5xl font-bold"><span class="text-rose-600">404</span> - Halaman Tidak Ditemukan</h1>
        <p class="text-gray-300">Maaf, halaman yang Anda cari tidak ditemukan.</p>
        <button @click="router.push('/')" class="py-2 px-4 bg-blue-500 rounded-md text-white">Homepage</button>
    </div>
</template>