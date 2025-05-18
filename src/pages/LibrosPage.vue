<template>
  <div class="libros">
    <h2>📚 Libros Compartidos</h2>

    <div class="libros-container">
      <div class="libro-card" v-for="libro in libros" :key="libro.id">
        <router-link :to="`/libros/${libro.id}`">
          <img :src="libro.portada || '/default-cover.png'" alt="Portada" />
          <h3>{{ libro.titulo }}</h3>
        </router-link>
        <p><strong>Autor:</strong> {{ libro.autor }}</p>
        <p><strong>Compartido por:</strong> {{ libro.creador?.nombre || 'Desconocido' }}</p>
        <p class="fecha">{{ formatFecha(libro.createdat) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

const libros = ref([])

const obtenerLibros = async () => {
  try {
    const res = await api.get('/books')
    libros.value = res.data
  } catch (error) {
    console.error('Error al cargar libros:', error)
  }
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(obtenerLibros)
</script>

<style scoped>
.libros-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.libro-card {
  background: #fff;
  border: 2px solid #4a148c;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.libro-card img {
  width: 120px;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.8rem;
}

.libro-card h3 {
  margin: 0.5rem 0;
  color: #4a148c;
}

.fecha {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}
</style>
