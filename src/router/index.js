import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/viewsAutenticacion/HomeView.vue';
import Login from '@/viewsAutenticacion/LoginView.vue';
import Register from '@/viewsAutenticacion/RegisterView.vue';

import Usuarios from '@/pages/UsuariosPage.vue';
import LibrosPage from '@/pages/LibrosPage.vue';
import Reseñas from '@/pages/ReseñasPage.vue';
import Discusiones from '@/pages/DiscusionesPage.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/usuarios', name: 'Usuarios', component: Usuarios },
  { path: '/libros', name: 'Libros', component: LibrosPage },
  { path: '/reseñas', name: 'Reseñas', component: Reseñas },
  { path: '/discusiones', name: 'Discusiones', component: Discusiones }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
