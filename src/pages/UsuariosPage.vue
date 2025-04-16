<template>
  <div>
    <h2>👥 Usuarios Registrados</h2>

    <div class="usuarios-container">
      <div
        class="usuario-card"
        v-for="usuario in usuarios"
        :key="usuario.id"
      >
        <img :src="usuario.imagen_perfil" alt="Foto de perfil" />
        <h3>{{ usuario.nombre }}</h3>
        <p>{{ usuario.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const usuarios = ref([])

const fetchUsuarios = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/usuarios')
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al cargar los usuarios:', error)
  }
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
}

.usuario-card {
  background-color: #fff;
  border: 2px solid #4a148c;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.usuario-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}
</style>
