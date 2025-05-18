<template>
  <div class="register-container">
    <h2>Registro de Usuario</h2>

    <form @submit.prevent="registrar">
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" v-model="nombre" @blur="validarNombre" required />
      <span v-if="errores.nombre" class="error">{{ errores.nombre }}</span>

      <label for="email">Correo:</label>
      <input type="email" id="email" v-model="email" @blur="validarEmail" required />
      <span v-if="errores.email" class="error">{{ errores.email }}</span>

      <label for="password">Contraseña:</label>
      <input type="password" id="password" v-model="password" @blur="validarPassword" required />
      <span v-if="errores.password" class="error">{{ errores.password }}</span>

      <label for="confirmar">Confirmar Contraseña:</label>
      <input type="password" id="confirmar" v-model="confirmar" @blur="validarConfirmar" required />
      <span v-if="errores.confirmar" class="error">{{ errores.confirmar }}</span>

      <button type="submit">Registrarse</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombre = ref('')
const email = ref('')
const password = ref('')
const confirmar = ref('')
const errores = ref({})
const error = ref('')

const validarNombre = () => {
  errores.value.nombre = !nombre.value ? 'El nombre es obligatorio.' : ''
}

const validarEmail = () => {
  errores.value.email = ''
  if (!email.value) errores.value.email = 'El correo es obligatorio.'
  else if (!/\S+@\S+\.\S+/.test(email.value)) errores.value.email = 'Correo inválido.'
}

const validarPassword = () => {
  errores.value.password = ''
  if (!password.value) errores.value.password = 'La contraseña es obligatoria.'
  else if (password.value.length < 6) errores.value.password = 'Mínimo 6 caracteres.'
}

const validarConfirmar = () => {
  errores.value.confirmar = ''
  if (confirmar.value !== password.value) errores.value.confirmar = 'Las contraseñas no coinciden.'
}

const registrar = async () => {
  validarNombre()
  validarEmail()
  validarPassword()
  validarConfirmar()

  if (Object.values(errores.value).some(e => e)) return

  try {
    await axios.post('http://localhost:3001/api/auth/register', {
      nombre: nombre.value,
      email: email.value,
      password: password.value
    })
    router.push('/login')
  } catch (err) {
    error.value = 'Error al registrar: ' + err.response?.data?.error || 'Error desconocido'
  }
}
</script>

<style scoped>
.register-container {
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
  margin-top: 0.3rem;
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
  color: red;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
</style>
