<template>
  <div>
    <h2>👥 Usuarios Registrados</h2>

    <div class="usuarios-container">
      <div
        class="usuario-card"
        v-for="usuario in usuarios"
        :key="usuario.id"
        @click="irAUsuario(usuario.id)"
      >
        <img :src="getFoto(usuario.fotoperfil)" alt="Foto de perfil" />
        <h3>{{ usuario.nombre }}</h3>
        <p>{{ usuario.descripcion || 'Nuevo perfil' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const usuarios = ref([])
const router = useRouter()

const fetchUsuarios = async () => {
  try {
    const response = await api.get('/users')
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al cargar los usuarios:', error)
  }
}

const getFoto = (ruta) => {
  return ruta ? `http://localhost:3001${ruta}` : '/default-user.png'
}

const irAUsuario = (id) => {
  router.push(`/usuarios/${id}`)
}

onMounted(() => {
  fetchUsuarios()
})
</script>

<style scoped>
.usuarios-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.usuario-card {
  background-color: #fff;
  border: 2px solid #4a148c;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.usuario-card:hover {
  transform: scale(1.03);
}

.usuario-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px; /* ✅ Cuadrado con esquinas suaves */
  margin-bottom: 0.5rem;
  border: 2px solid #4a148c;
}

.usuario-card h3 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.usuario-card p {
  font-size: 0.9rem;
  color: #666;
}
</style>
