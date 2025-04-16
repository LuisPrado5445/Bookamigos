<template>
  <div>
    <h2>📝 Reseñas de Libros</h2>

    <div class="reseñas-container">
      <div
        class="reseña-card"
        v-for="reseña in reseñas"
        :key="reseña.id"
      >
        <h3>{{ reseña.usuario_nombre }} reseñó <span>{{ reseña.libro_titulo }}</span></h3>
        <p class="calificacion">⭐ Calificación: {{ reseña.calificacion }}/5</p>
        <p>{{ reseña.contenido }}</p>
        <small>{{ formatFecha(reseña.creado_en) }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const reseñas = ref([])

const fetchReseñas = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/reseñas')
    reseñas.value = response.data
  } catch (error) {
    console.error('Error al obtener las reseñas:', error)
  }
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString()
}

onMounted(() => {
  fetchReseñas()
})
</script>

<style scoped>
.reseñas-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.reseña-card {
  background-color: #fff;
  border: 2px solid #6a1b9a;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reseña-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.reseña-card span {
  color: #4a148c;
  font-weight: bold;
}

.calificacion {
  color: #ff9800;
  font-weight: bold;
}
</style>
