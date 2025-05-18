import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/viewsAutenticacion/HomeView.vue';
import Login from '@/viewsAutenticacion/LoginView.vue';
import Register from '@/viewsAutenticacion/RegisterView.vue';
import PerfilMiUsuario from '@/viewsAutenticacion/PerfilMiUsuario.vue';
import RecuperarView from '@/viewsAutenticacion/RecuperarView.vue';
import ResetearPasswordView from '@/viewsAutenticacion/ResetearPasswordView.vue';

import Usuarios from '@/pages/UsuariosPage.vue';
import Libros from '@/pages/LibrosPage.vue';
import Reseñas from '@/pages/ReseñasPage.vue';
import Discusiones from '@/pages/DiscusionesPage.vue';
import DetalleLibro from '@/pages/DetalleLibro.vue';
import CrearLibro from '../pages/CrearLibro.vue'
import CrearReseña from '../pages/CrearReseña.vue'
import CrearDiscusion from '../pages/CrearDiscusion.vue'
import PerfilUsuario from '../pages/PerfilUsuario.vue'
import EditarLibro from '../pages/EditarLibro.vue'
import EditarReseña from '../pages/EditarReseña.vue'
import EditarDiscusion from '../pages/EditarDiscusion.vue'
import ReporteUsuario from '../pages/ReporteUsuario.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/usuarios', name: 'Usuarios', component: Usuarios },
  { path: '/libros', name: 'Libros', component: Libros },
  { path: '/reseñas', name: 'Reseñas', component: Reseñas },
  { path: '/discusiones', name: 'Discusiones', component: Discusiones },
  { path: '/libros/:id', name: 'DetalleLibro', component: DetalleLibro},
  { path: '/crear-libro', name: 'CrearLibro', component: CrearLibro},
  { path: '/crear-reseña', name: 'CrearReseña', component: CrearReseña},
  { path: '/crear-discusion', name: 'CrearDiscusion', component: CrearDiscusion},
  { path: '/usuarios/:id', name: 'PerfilUsuario', component: PerfilUsuario},
  { path: '/mi-perfil', name: 'MiPerfil',component: PerfilMiUsuario},
  { path: '/recuperar', name:'RecuperPerfil', component: RecuperarView },
  { path: '/resetear', name: 'ResetearPassword', component: ResetearPasswordView },
  { path: '/editar-libro/:id', name: 'EditarLibro', component: EditarLibro },
  { path: '/editar-reseña/:id', name: 'EditarReseña', component: EditarReseña },
  { path: '/editar-discusion/:id', name: 'EditarDiscusion', component: EditarDiscusion },
  { path: '/reporte-usuario', name: 'ReporteUsuario', component: ReporteUsuario},

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
