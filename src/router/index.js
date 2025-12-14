import NotFoundView from '@/views/NotFoundView.vue';
import AlbionFocusView from '@/views/AlbionFocus.vue';
import AddCharactersAlbionView from '@/views/AddCharactersAlbion.vue';
import EditCharactersAlbionView from '@/views/EditCharactersAlbion.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'AlbionFocus',
    component: AlbionFocusView
  },
  {
    path: '/albion/add',
    name: 'AddCharactersAlbion',
    component: AddCharactersAlbionView
  },
  {
    path: '/albion/edit/:id',
    name: 'EditCharactersAlbion',
    component: EditCharactersAlbionView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(), // Menggunakan mode History API (URL bersih tanpa hash #)
  routes,
});


// router.beforeEach((to, from, next) => {
//   // ⚠️ PENTING: Mendapatkan store Pinia
//   // Karena Guard dijalankan di luar komponen, kita harus menggunakan 
//   // getActivePinia(). Ini hanya bisa dilakukan setelah Pinia diinisialisasi di main.js.
//   const authStore = useAuthStore(getActivePinia());

//   const requiresAuth = to.meta.requiresAuth;
//   const requiredRoles = to.meta.roles;

//   // --- A. Logika Proteksi Otentikasi (requiresAuth) ---
//   if (requiresAuth) {
//     if (!authStore.isLoggedIn) {
//       // Jika butuh login tapi belum login:
//       console.log('Navigasi diblokir: Perlu Login');
//       // Redirect ke halaman login, simpan rute tujuan sebagai query (opsional)
//       return next({ name: 'Login', query: { redirect: to.fullPath } });
//     }

//     // --- B. Logika Proteksi Peran (RBAC) ---
//     if (requiredRoles && !requiredRoles.includes(authStore.userRole)) {
//       // Jika login, tapi peran user tidak termasuk dalam peran yang diizinkan
//       console.log(`Navigasi diblokir: Peran ${authStore.userRole} tidak diizinkan.`);
//       // Redirect ke halaman yang tidak terproteksi atau halaman 403
//       return next({ name: 'Login' }); // Redirect ke dashboard utama
//     }

//     // Jika login, dan memiliki peran yang tepat:
//     return next();

//   } else {
//     // --- C. Rute Publik (e.g., /login, /home) ---
//     // Jika user sudah login dan mencoba mengakses halaman /login, kembalikan ke /dashboard
//     if (to.name === 'Login' && authStore.isLoggedIn) {
//       return next({ name: 'Post' });
//     }

//     // Jika tidak ada proteksi yang diperlukan, izinkan navigasi
//     return next();
//   }
// });

export default router;