<template>
  <div>
    <h2>📚 Libros Compartidos</h2>

    <div class="libros-container">
      <div v-for="libro in libros" :key="libro.id" class="libro-card">
        <img v-if="libro.portada" :src="libro.portada" alt="Portada" class="portada" />
        <h3>{{ libro.titulo }}</h3>
        <p><strong>Autor:</strong> {{ libro.autor }}</p>
        <p><strong>Compartido por:</strong> {{ libro.usuario_nombre }}</p>
        <small>{{ formatFecha(libro.creado_en) }}</small>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const libros = ref([])

const fetchLibros = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/books/disponibles')
    libros.value = response.data
  } catch (error) {
    console.error('Error al obtener los libros:', error)
  }
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString()
}

onMounted(() => {
  fetchLibros()
})
</script>

<style scoped>
.libros-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.libro-card {
  background-color: #ffffff;
  border: 2px solid #512da8;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.libro-card h3 {
  margin-top: 0.5rem;
  color: #4a148c;
}

.portada {
  width: 100%;
  max-height: 180px;
  object-fit: contain;
  margin-bottom: 10px;
  border-radius: 6px;
}
</style>
