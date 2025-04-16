<template>
  <div>
    <h2>💬 Discusiones sobre Libros</h2>

    <div class="discusiones-container">
      <div
        class="discusion-card"
        v-for="discusion in discusiones"
        :key="discusion.id"
      >
        <h3>{{ discusion.titulo }}</h3>
        <p>{{ discusion.contenido }}</p>
        <small><strong>Por:</strong> {{ discusion.usuario_nombre }}</small><br />
        <small><strong>Libro:</strong> {{ discusion.libro_titulo }}</small><br />
        <small>{{ formatFecha(discusion.creado_en) }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const discusiones = ref([])

const fetchDiscusiones = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/discusiones')
    discusiones.value = response.data
  } catch (error) {
    console.error('Error al obtener las discusiones:', error)
  }
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString()
}

onMounted(() => {
  fetchDiscusiones()
})
</script>

<style scoped>
.discusiones-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.discusion-card {
  background-color: #ffffff;
  border-left: 6px solid #4a148c;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.discusion-card h3 {
  color: #4a148c;
  margin-bottom: 0.5rem;
}
</style>
