<template>
  <div ref="pdfRef" class="reporte-container">
    <h1>📄 Reporte del Usuario</h1>

    <section class="perfil" v-if="usuario">
      <h2>👤 Perfil</h2>
      <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
      <p><strong>Email:</strong> {{ usuario.email }}</p>
      <p><strong>Descripción:</strong> {{ usuario.descripcion || 'Sin descripción' }}</p>
    </section>

    <section v-if="libros.length">
      <h2>📚 Libros creados</h2>
      <div v-for="libro in libros" :key="libro.id" class="card">
        <h3>{{ libro.titulo }}</h3>
        <p><strong>Autor:</strong> {{ libro.autor }}</p>
        <p><strong>Descripción:</strong> {{ libro.descripcion }}</p>
        <img v-if="libro.portada" :src="libro.portada" alt="Portada del libro" class="portada-img" />
      </div>
    </section>

    <section v-if="reseñas.length">
      <h2>📝 Reseñas</h2>
      <div v-for="r in reseñas" :key="r.id" class="card">
        <p><strong>Libro:</strong> {{ r.libroReview?.titulo || 'Desconocido' }}</p>
        <p>⭐ {{ r.puntuacion }}/5</p>
        <p>{{ r.contenido }}</p>
      </div>
    </section>

    <section v-if="discusiones.length">
      <h2>💬 Discusiones</h2>
      <div v-for="d in discusiones" :key="d.id" class="card">
        <h3>{{ d.titulo }}</h3>
        <p>{{ d.contenido }}</p>
        <p><strong>Libro:</strong> {{ d.libroComentado?.titulo || 'Desconocido' }}</p>
      </div>
    </section>

    <button @click="exportarPDF">📥 Exportar todo en PDF</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'
import html2pdf from 'html2pdf.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const pdfRef = ref(null)
const usuario = ref(null)
const libros = ref([])
const reseñas = ref([])
const discusiones = ref([])

const cargarDatos = async () => {
  try {
    const [userRes, allBooks, allReviews, allDiscusiones] = await Promise.all([
      api.get('/users/me'),
      api.get('/books'),
      api.get('/reviews'),
      api.get('/discussions')
    ])

    usuario.value = userRes.data
    libros.value = allBooks.data.filter(b => b.usuarioId === usuario.value.id)
    reseñas.value = allReviews.data.filter(r => r.usuarioId === usuario.value.id)
    discusiones.value = allDiscusiones.data.filter(d => d.usuarioId === usuario.value.id)
  } catch (err) {
    console.error('Error al cargar reporte:', err)
    router.push('/login') // redirige si falla
  }
}

const exportarPDF = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  html2pdf().set({
    margin: 0.5,
    filename: `Reporte_${usuario.value.nombre}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(pdfRef.value).save()
}

onMounted(cargarDatos)
</script>

<style scoped>
.reporte-container {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background: #fff;
}
.perfil-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}
.portada-img {
  max-width: 200px;
  margin-top: 0.5rem;
  border-radius: 8px;
}
.card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
}
button {
  margin-top: 2rem;
  padding: 0.8rem 1.5rem;
  background-color: #4a148c;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
</style>
