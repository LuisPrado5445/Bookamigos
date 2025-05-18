<template>
  <div>
    <h2>📝 Reseñas de Libros</h2>

    <div v-if="usuarioCargado">
      <div class="reseñas-container">
        <div class="reseña-card" v-for="reseña in reseñas" :key="reseña.id">
          <h3>
            {{ reseña.autorReview?.nombre || 'Anónimo' }} reseñó
            <span>{{ reseña.libroReview?.titulo || 'Desconocido' }}</span>
          </h3>

          <p class="calificacion">⭐ Calificación: {{ reseña.puntuacion }}/5</p>
          <p>{{ reseña.contenido }}</p>
          <small>{{ formatFecha(reseña.createdat) }}</small>

          <!-- ✅ Botones solo para el autor -->
          <div v-if="usuarioActual && reseña.usuarioId === usuarioActual.id" class="acciones">
            <button @click="editarReseña(reseña.id)">✏️ Editar</button>
            <button @click="eliminarReseña(reseña.id)">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <p v-else>Cargando reseñas...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const reseñas = ref([])
const usuarioActual = ref(null)
const usuarioCargado = ref(false)
const router = useRouter()

const obtenerReseñas = async () => {
  try {
    const res = await api.get('/reviews')
    reseñas.value = res.data
  } catch (error) {
    console.error('Error al obtener las reseñas:', error)
  }
}

const obtenerUsuario = async () => {
  try {
    const res = await api.get('/users/me')
    usuarioActual.value = res.data
  } catch (err) {
    console.warn('No autenticado')
  } finally {
    usuarioCargado.value = true
  }
}

function formatFecha(fecha) {
  if (!fecha) return 'Fecha no disponible'
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const editarReseña = (id) => {
  router.push(`/editar-reseña/${id}`)
}

const eliminarReseña = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta reseña?')) {
    try {
      await api.delete(`/reviews/${id}`)
      reseñas.value = reseñas.value.filter(r => r.id !== id)
    } catch (err) {
      alert('Error al eliminar la reseña')
      console.error(err)
    }
  }
}

onMounted(() => {
  obtenerUsuario()
  obtenerReseñas()
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

.acciones {
  margin-top: 1rem;
}
button {
  margin-right: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: #4a148c;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
</style>
