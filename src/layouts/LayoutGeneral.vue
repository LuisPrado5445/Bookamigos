<template>
  <div class="layout">
    <header class="navbar">
      <h1>📚 Bookamigos</h1>
      <nav>
        <router-link to="/">Inicio</router-link>
        <router-link to="/usuarios">Usuarios</router-link>
        <router-link to="/libros">Libros</router-link>
        <router-link to="/reseñas">Reseñas</router-link>
        <router-link to="/discusiones">Discusiones</router-link>
        <router-link v-if="!logueado" to="/login">Iniciar Sesión</router-link>
        <router-link v-if="!logueado" to="/register">Registrarse</router-link>
        <router-link v-if="logueado" to="/crear-libro">➕ Crear Libro</router-link>
        <router-link v-if="logueado" to="/crear-reseña">✍️ Crear Reseña</router-link>
        <router-link v-if="logueado" to="/crear-discusion">💬 Crear Discusión</router-link>
        <router-link v-if="logueado" to="/mi-perfil">👤 Mi perfil</router-link>
        <router-link v-if="logueado" to="/Reporte-usuario">📄 Descarga PDF</router-link>

        <button v-if="logueado" @click="cerrar" class="cerrar-btn">Cerrar sesión</button>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>© 2025 Bookamigos - Todos los derechos reservados</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { logueado, cerrarSesion } = useAuth()
const router = useRouter()

const cerrar = () => {
  cerrarSesion()
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background-color: #4a148c;
  padding: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar h1 {
  margin: 0;
}

.navbar nav {
  display: flex;
  gap: 1rem;
}

.navbar nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.navbar nav a.router-link-exact-active {
  text-decoration: underline;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f3f3f3;
}

.footer {
  background-color: #4a148c;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>