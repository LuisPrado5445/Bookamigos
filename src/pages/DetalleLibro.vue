<template>
  <div ref="pdfRef" class="contenido-exportable">
    <div class="detalle-libro" v-if="libro">
      <h2>📖 {{ libro.titulo }}</h2>
      <p><strong>Autor:</strong> {{ libro.autor }}</p>
      <p><strong>Descripción:</strong> {{ libro.descripcion }}</p>
      <img
        v-if="libro.portada"
        :src="libro.portada"
        alt="Portada del libro"
        ref="portadaImg"
      />
      <p><strong>Publicado por:</strong> {{ libro.creador?.nombre }}</p>
      <p><strong>Fecha:</strong> {{ formatearFecha(libro.createdat) }}</p>

      <div v-if="usuarioActual && libro.usuarioId === usuarioActual.id" class="acciones no-exportar">
        <button @click="editarLibro">✏️ Editar</button>
        <button @click="eliminarLibro">🗑️ Eliminar</button>
      </div>

      <hr />

      <h3>📝 Reseñas</h3>
      <div v-if="reseñas.length">
        <div v-for="r in reseñas" :key="r.id" class="card">
          <p><strong>{{ r.autorReview?.nombre }}</strong> reseñó</p>
          <p>⭐ {{ r.puntuacion }}/5</p>
          <p>{{ r.contenido }}</p>
          <small>{{ formatearFecha(r.createdat) }}</small>
        </div>
      </div>
      <p v-else>No hay reseñas para este libro.</p>

      <hr />

      <h3>💬 Discusiones</h3>
      <div v-if="discusiones.length">
        <div v-for="d in discusiones" :key="d.id" class="card">
          <h4>{{ d.titulo }}</h4>
          <p>{{ d.contenido }}</p>
          <p><strong>Por:</strong> {{ d.participante?.nombre }}</p>
          <small>{{ formatearFecha(d.createdat) }}</small>
        </div>
      </div>
      <p v-else>No hay discusiones para este libro.</p>
    </div>
  </div>

  <button @click="exportarPDF" class="exportar-btn">📄 Exportar como PDF</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../axios'
import html2pdf from 'html2pdf.js'

const route = useRoute()
const router = useRouter()
const libroId = route.params.id

const libro = ref(null)
const reseñas = ref([])
const discusiones = ref([])
const usuarioActual = ref(null)
const pdfRef = ref(null)
const portadaImg = ref(null)

const formatearFecha = (f) => new Date(f).toLocaleDateString()

const cargarUsuarioActual = async () => {
  try {
    const res = await api.get('/users/me')
    usuarioActual.value = res.data
  } catch (err) {
    console.warn('No autenticado')
  }
}

const editarLibro = () => {
  router.push(`/editar-libro/${libro.value.id}`)
}

const eliminarLibro = async () => {
  if (confirm('¿Estás seguro de eliminar este libro?')) {
    try {
      await api.delete(`/books/${libro.value.id}`)
      router.push('/libros')
    } catch (err) {
      alert('Error al eliminar el libro')
      console.error(err)
    }
  }
}

const exportarPDF = async () => {
  if (!pdfRef.value) return

  // Esperar carga total de la imagen
  if (portadaImg.value && !portadaImg.value.complete) {
    await new Promise(resolve => {
      portadaImg.value.onload = resolve
      portadaImg.value.onerror = resolve
    })
  }

  // Espera adicional para asegurar el render
  await new Promise(resolve => setTimeout(resolve, 300))

  html2pdf().set({
    margin: 0.5,
    filename: `Libro_${libro.value.titulo.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(pdfRef.value).save()
}

onMounted(async () => {
  try {
    const [resLibro, resReseñas, resDiscusiones] = await Promise.all([
      api.get(`/books/${libroId}`),
      api.get('/reviews'),
      api.get('/discussions')
    ])

    libro.value = resLibro.data
    reseñas.value = resReseñas.data.filter(r => r.libroId == libroId)
    discusiones.value = resDiscusiones.data.filter(d => d.libroId == libroId)
    await cargarUsuarioActual()
  } catch (err) {
    console.error('Error al cargar detalles:', err)
  }
})
</script>

<style scoped>
.detalle-libro {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
}
.card {
  margin: 1rem 0;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}
img {
  max-width: 200px;
  margin: 1rem 0;
  border-radius: 8px;
}
.acciones {
  margin-top: 1rem;
}
button {
  margin-right: 1rem;
  padding: 0.6rem 1rem;
  background: #4a148c;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
@media print {
  .no-exportar {
    display: none !important;
  }
  .exportar-btn {
    display: none !important;
  }
}
</style>
