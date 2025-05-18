<template>
  <div class="crear-libro">
    <h2>📚 Crear Nuevo Libro</h2>

    <form @submit.prevent="crearLibro">
      <label for="titulo">Título:</label>
      <input id="titulo" v-model="titulo" @blur="validarTitulo" />
      <span v-if="errores.titulo" class="error">{{ errores.titulo }}</span>

      <label for="autor">Autor:</label>
      <input id="autor" v-model="autor" @blur="validarAutor" />
      <span v-if="errores.autor" class="error">{{ errores.autor }}</span>

      <label for="descripcion">Descripción:</label>
      <textarea id="descripcion" v-model="descripcion" @blur="validarDescripcion"></textarea>
      <span v-if="errores.descripcion" class="error">{{ errores.descripcion }}</span>

      <label for="portada">Portada (URL):</label>
      <input id="portada" v-model="portada" @input="validarImagen" />

      <div v-if="portadaValida" class="preview">
        <img :src="portada" alt="Portada" />
      </div>

      <button type="submit">Agregar Libro</button>
    </form>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const titulo = ref('')
const autor = ref('')
const descripcion = ref('')
const portada = ref('')
const portadaValida = ref(false)
const errores = ref({})
const mensaje = ref('')

const validarTitulo = () => {
  errores.value.titulo = titulo.value.trim() ? '' : 'El título es obligatorio.'
}
const validarAutor = () => {
  errores.value.autor = autor.value.trim() ? '' : 'El autor es obligatorio.'
}
const validarDescripcion = () => {
  errores.value.descripcion = descripcion.value.trim() ? '' : 'La descripción es obligatoria.'
}
const validarImagen = () => {
  portadaValida.value = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(portada.value)
}

const crearLibro = async () => {
  validarTitulo()
  validarAutor()
  validarDescripcion()

  if (Object.values(errores.value).some(e => e)) return

  try {
    await api.post('/books', {
      titulo: titulo.value,
      autor: autor.value,
      descripcion: descripcion.value,
      portada: portada.value
    })
    mensaje.value = '✅ Libro creado exitosamente'
    setTimeout(() => router.push('/libros'), 2000)
  } catch (err) {
    mensaje.value = '❌ Error al crear libro'
    console.error(err)
  }
}
</script>

<style scoped>
.crear-libro {
  max-width: 500px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
label {
  font-weight: bold;
  display: block;
  margin-top: 1rem;
}
input,
textarea {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
textarea {
  resize: vertical;
}
.preview {
  margin-top: 1rem;
  text-align: center;
}
.preview img {
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
}
button {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.8rem;
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
  color: green;
  font-weight: bold;
  margin-top: 1rem;
}
</style>
