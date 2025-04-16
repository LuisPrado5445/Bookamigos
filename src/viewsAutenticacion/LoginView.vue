<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="loginUsuario">
      <label for="email">Correo Electrónico:</label>
      <input type="email" id="email" v-model="email" required />

      <label for="password">Contraseña:</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">Ingresar</button>
    </form>

    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const loginUsuario = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    const { token } = response.data

    // Guardar token en localStorage
    localStorage.setItem('token', token)

    // Redirigir al home
    router.push('/')
  } catch (err) {
    error.value = 'Correo o contraseña incorrectos.'
    console.error('Error al iniciar sesión:', err)
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
  margin-top: 1rem;
  display: block;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.5rem;
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

button:hover {
  background-color: #6a1b9a;
}

.error {
  margin-top: 1rem;
  color: red;
  font-weight: bold;
}
</style>