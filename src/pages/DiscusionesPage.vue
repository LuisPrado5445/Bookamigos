<template>
  <div>
    <h2>🔊 Discusiones sobre Libros</h2>

    <div class="discusiones-container">
      <div class="discusion-card" v-for="d in discusiones" :key="d.id">
        <h3>{{ d.titulo }}</h3>
        <p>{{ d.contenido }}</p>
        <p><strong>Por:</strong> {{ d.participante?.nombre || 'Anónimo' }}</p>
        <p><strong>Libro:</strong> {{ d.libroComentado?.titulo || 'Desconocido' }}</p>
        <small>{{ formatFecha(d.createdat) }}</small>

        <!-- ✅ Botones solo si es el autor -->
        <div v-if="usuarioActual && d.usuarioId === usuarioActual.id" class="acciones">
          <button @click="editarDiscusion(d.id)">✏️ Editar</button>
          <button @click="eliminarDiscusion(d.id)">🗑️ Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const discusiones = ref([])
const usuarioActual = ref(null)
const router = useRouter()

const obtenerDiscusiones = async () => {
  try {
    const res = await api.get('/discussions')
    discusiones.value = res.data
  } catch (error) {
    console.error('Error al obtener discusiones:', error)
  }
}

const obtenerUsuario = async () => {
  try {
    const res = await api.get('/users/me')
    usuarioActual.value = res.data
  } catch (err) {
    console.warn('No autenticado')
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

const editarDiscusion = (id) => {
  router.push(`/editar-discusion/${id}`)
}

const eliminarDiscusion = async (id) => {
  if (confirm('¿Eliminar esta discusión?')) {
    try {
      await api.delete(`/discussions/${id}`)
      discusiones.value = discusiones.value.filter(d => d.id !== id)
    } catch (err) {
      alert('Error al eliminar la discusión')
      console.error(err)
    }
  }
}

onMounted(() => {
  obtenerUsuario()
  obtenerDiscusiones()
})
</script>

<style scoped>
.discusiones-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.discusion-card {
  background-color: #fff;
  border: 2px solid #6a1b9a;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
