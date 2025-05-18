<template>
  <div class="editar-container">
    <h2>✏️ Editar Libro</h2>

    <form @submit.prevent="actualizar">
      <label for="titulo">Título</label>
      <input type="text" id="titulo" v-model="libro.titulo" required />

      <label for="autor">Autor</label>
      <input type="text" id="autor" v-model="libro.autor" required />

      <label for="descripcion">Descripción</label>
      <textarea id="descripcion" v-model="libro.descripcion" rows="5" required />

      <label for="portada">Portada (URL)</label>
      <input type="text" id="portada" v-model="libro.portada" @input="validarImagen" />

      <div v-if="portadaValida" class="preview">
        <img :src="libro.portada" alt="Portada del libro" />
      </div>

      <button type="submit">Actualizar</button>
    </form>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../axios'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const libro = ref({ titulo: '', autor: '', descripcion: '', portada: '' })
const mensaje = ref('')
const portadaValida = ref(false)

onMounted(async () => {
  try {
    const res = await api.get(`/books/${id}`)
    libro.value = res.data
    validarImagen()
  } catch (err) {
    mensaje.value = 'Error al cargar el libro'
  }
})

const validarImagen = () => {
  portadaValida.value = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(libro.value.portada)
}

const actualizar = async () => {
  try {
    await api.put(`/books/${id}`, libro.value)
    mensaje.value = '✅ Libro actualizado'
    router.push('/libros')
  } catch (err) {
    mensaje.value = '❌ Error al actualizar'
    console.error(err)
  }
}
</script>

<style scoped>
.editar-container {
  max-width: 600px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
label {
  display: block;
  font-weight: bold;
  margin-top: 1rem;
}
input, textarea {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.preview {
  margin-top: 1rem;
}
.preview img {
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
}
button {
  margin-top: 1.5rem;
  background: #4a148c;
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.mensaje {
  margin-top: 1rem;
  font-weight: bold;
}
</style>
