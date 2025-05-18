<template>
  <div class="editar-container">
    <h2>✏️ Editar Reseña</h2>

    <form @submit.prevent="actualizar">
      <label for="puntuacion">Puntuación (1-5)</label>
      <input type="number" id="puntuacion" v-model="resena.puntuacion" min="1" max="5" required />

      <label for="contenido">Contenido</label>
      <textarea id="contenido" v-model="resena.contenido" rows="5" required />

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

const resena = ref({ puntuacion: 1, contenido: '' })
const mensaje = ref('')

onMounted(async () => {
  try {
    const res = await api.get(`/reviews/${id}`)
    resena.value = res.data
  } catch (err) {
    mensaje.value = 'Error al cargar la reseña'
  }
})

const actualizar = async () => {
  try {
    await api.put(`/reviews/${id}`, resena.value)
    mensaje.value = '✅ Reseña actualizada'
    router.push('/reseñas')
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
