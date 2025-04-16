<template>
  <div class="register-container">
    <h1>📝 Registrarse en Bookamigos</h1>
    <form @submit.prevent="registrarse">
      <input type="text" v-model="nombre" placeholder="Nombre completo" required />
      <input type="email" v-model="email" placeholder="Correo electrónico" required />
      <input type="password" v-model="password" placeholder="Contraseña" required />
      <input type="password" v-model="confirmarPassword" placeholder="Confirmar contraseña" required />
      <button type="submit">Registrarse</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <router-link to="/login">¿Ya tienes una cuenta? Inicia sesión</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const nombre = ref('')
const email = ref('')
const password = ref('')
const confirmarPassword = ref('')
const error = ref('')
const router = useRouter()

const registrarse = async () => {
  error.value = ''
  if (password.value !== confirmarPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      nombre: nombre.value,
      email: email.value,
      password: password.value
    })
    console.log('Registro exitoso:', response.data)
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrarse.'
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #4a148c;
  margin-bottom: 1rem;
}

input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  background-color: #4a148c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: bold;
}

button:hover {
  background-color: #6a1b9a;
}

.error {
  color: red;
  margin-top: 0.5rem;
}

a {
  display: inline-block;
  margin-top: 1rem;
  color: #4a148c;
  text-decoration: none;
}
</style>
