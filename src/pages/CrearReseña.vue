<template>
  <div class="crear-reseña" v-if="usuarioCargado">
    <h2>✍️ Escribir Reseña</h2>

    <form @submit.prevent="crearReseña">
      <label for="libro">Libro:</label>
      <select v-model="libroId" @blur="validarLibro">
        <option value="">Selecciona un libro</option>
        <option v-for="libro in libros" :key="libro.id" :value="libro.id">
          {{ libro.titulo }}
        </option>
      </select>
      <span v-if="errores.libroId" class="error">{{ errores.libroId }}</span>

      <label for="puntuacion">Puntuación (1-5):</label>
      <input type="number" min="1" max="5" v-model="puntuacion" @blur="validarPuntuacion" />
      <span v-if="errores.puntuacion" class="error">{{ errores.puntuacion }}</span>

      <label for="contenido">Contenido:</label>
      <textarea v-model="contenido" @blur="validarContenido"></textarea>
      <span v-if="errores.contenido" class="error">{{ errores.contenido }}</span>

      <button type="submit">Publicar Reseña</button>
    </form>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>

  <p v-else>Cargando usuario...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const router = useRouter()
const libros = ref([])
const libroId = ref('')
const puntuacion = ref(5)
const contenido = ref('')
const errores = ref({})
const mensaje = ref('')

const usuarioCargado = ref(false)
const usuarioActual = ref(null)

const obtenerUsuario = async () => {
  try {
    const res = await api.get('/users/me')
    usuarioActual.value = res.data
  } catch (error) {
    console.warn('Usuario no autenticado')
  } finally {
    usuarioCargado.value = true
  }
}

const obtenerLibros = async () => {
  try {
    const res = await api.get('/books')
    libros.value = res.data
  } catch (error) {
    console.error('Error al cargar libros:', error)
  }
}

const validarLibro = () => {
  errores.value.libroId = !libroId.value ? 'Debes seleccionar un libro.' : ''
}

const validarPuntuacion = () => {
  const val = Number(puntuacion.value)
  errores.value.puntuacion = (val < 1 || val > 5) ? 'Debe ser entre 1 y 5.' : ''
}

const validarContenido = () => {
  errores.value.contenido = !contenido.value.trim() ? 'La reseña no puede estar vacía.' : ''
}

const crearReseña = async () => {
  validarLibro()
  validarPuntuacion()
  validarContenido()

  if (Object.values(errores.value).some(e => e)) return

  try {
    await api.post('/reviews', {
      contenido: contenido.value,
      puntuacion: puntuacion.value,
      libroId: libroId.value
    })
    mensaje.value = '✅ Reseña publicada exitosamente'
    setTimeout(() => router.push('/reseñas'), 2000)
  } catch (error) {
    mensaje.value = '❌ Error al publicar la reseña'
    console.error(error)
  }
}

onMounted(() => {
  obtenerUsuario()
  obtenerLibros()
})
</script>

<style scoped>
.crear-reseña {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.6rem;
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
