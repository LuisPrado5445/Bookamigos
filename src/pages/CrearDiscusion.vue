<template>
  <div class="crear-discusion">
    <h2>💬 Crear Nueva Discusión</h2>

    <form @submit.prevent="crearDiscusion">
      <label for="titulo">Título:</label>
      <input v-model="titulo" id="titulo" @blur="validarTitulo" />
      <span v-if="errores.titulo" class="error">{{ errores.titulo }}</span>

      <label for="contenido">Contenido:</label>
      <textarea v-model="contenido" id="contenido" @blur="validarContenido"></textarea>
      <span v-if="errores.contenido" class="error">{{ errores.contenido }}</span>

      <label for="libro">Libro relacionado:</label>
      <select v-model="libroId" @blur="validarLibro">
        <option value="">Selecciona un libro</option>
        <option v-for="libro in libros" :key="libro.id" :value="libro.id">
          {{ libro.titulo }}
        </option>
      </select>
      <span v-if="errores.libroId" class="error">{{ errores.libroId }}</span>

      <button type="submit">Publicar Discusión</button>
    </form>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const libros = ref([])
const titulo = ref('')
const contenido = ref('')
const libroId = ref('')
const errores = ref({})
const mensaje = ref('')

const obtenerLibros = async () => {
  try {
    const res = await api.get('/books')
    libros.value = res.data
  } catch (error) {
    console.error('Error al cargar libros:', error)
  }
}

const validarTitulo = () => {
  errores.value.titulo = titulo.value.trim() ? '' : 'El título es obligatorio.'
}
const validarContenido = () => {
  errores.value.contenido = contenido.value.trim() ? '' : 'El contenido no puede estar vacío.'
}
const validarLibro = () => {
  errores.value.libroId = libroId.value ? '' : 'Debes seleccionar un libro.'
}

const crearDiscusion = async () => {
  validarTitulo()
  validarContenido()
  validarLibro()

  if (Object.values(errores.value).some(e => e)) return

  try {
    await api.post('/discussions', {
      titulo: titulo.value,
      contenido: contenido.value,
      libroId: libroId.value
    })
    mensaje.value = '✅ Discusión publicada exitosamente'
    setTimeout(() => router.push('/discusiones'), 2000)
  } catch (error) {
    mensaje.value = '❌ Error al publicar discusión'
    console.error(error)
  }
}

onMounted(obtenerLibros)
</script>

<style scoped>
.crear-discusion {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
  display: block;
  margin-top: 1rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

textarea {
  resize: vertical;
}

button {
  margin-top: 1.5rem;
  padding: 0.8rem;
  width: 100%;
  background-color: #4a148c;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #6a1b9a;
}

.error {
  color: red;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.mensaje {
  margin-top: 1rem;
  font-weight: bold;
  color: green;
}
</style>
