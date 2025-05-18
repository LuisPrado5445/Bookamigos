<template>
  <div class="reset-container">
    <h2>Crear nueva contraseña</h2>
    <form @submit.prevent="resetear">
      <label for="password">Nueva contraseña:</label>
      <input type="password" id="password" v-model="password" required />
      <button type="submit">Actualizar</button>
    </form>
    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const password = ref('')
const mensaje = ref('')

const resetear = async () => {
  try {
  await axios.post(`http://localhost:3001/api/users/reset-password/${route.query.token}`, { newPassword: password.value })    
  } catch (error) {
    mensaje.value = '❌ Error al actualizar la contraseña.'
    console.error(error)
  }
}
</script>

<style scoped>
.reset-container {
  max-width: 400px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

label {
  font-weight: bold;
  display: block;
  margin-top: 1rem;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 6px;
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

.mensaje {
  margin-top: 1rem;
  color: green;
  text-align: center;
}
</style>
