<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>

    <form @submit.prevent="loginUsuario">
      <label for="email">Correo:</label>
      <input
        type="email"
        id="email"
        v-model="email"
        @blur="validarEmail"
        required
      />
      <span v-if="errores.email" class="error">{{ errores.email }}</span>

      <label for="password">Contraseña:</label>
      <input
        type="password"
        id="password"
        v-model="password"
        @blur="validarPassword"
        required
      />
      <span v-if="errores.password" class="error">{{ errores.password }}</span>

      <button type="submit">Ingresar</button>
    </form>

    <p class="error" v-if="errorLogin && !logueado">{{ errorLogin }}</p>

    <p class="olvide">
      <router-link to="/recuperar">¿Olvidaste tu contraseña?</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { iniciarSesion, logueado } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const errores = ref({})
const errorLogin = ref('')

const validarEmail = () => {
  errores.value.email = ''
  if (!email.value) {
    errores.value.email = 'El correo es obligatorio.'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errores.value.email = 'El correo no es válido.'
  }
}

const validarPassword = () => {
  errores.value.password = ''
  if (!password.value) {
    errores.value.password = 'La contraseña es obligatoria.'
  } else if (password.value.length < 6) {
    errores.value.password = 'Debe tener al menos 6 caracteres.'
  }
}

const loginUsuario = async () => {
  validarEmail()
  validarPassword()

  if (errores.value.email || errores.value.password) return

  try {
    const res = await axios.post('http://localhost:3001/api/auth/login', {
      email: email.value,
      password: password.value
    })

    errorLogin.value = ''
    iniciarSesion(res.data.token)
    localStorage.setItem('nombre', res.data.usuario.nombre)

    // ✅ Redirige a Mi perfil tras login
    router.push('/mi-perfil')

  } catch (err) {
    errorLogin.value = 'Correo o contraseña incorrectos.'
    console.error(err)
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

.olvide {
  margin-top: 1rem;
  text-align: center;
}
</style>
