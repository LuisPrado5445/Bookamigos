// src/composables/useAuth.js
import { ref } from 'vue'

const logueado = ref(!!localStorage.getItem('token'))

const iniciarSesion = (token) => {
  localStorage.setItem('token', token)
  logueado.value = true
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('nombre')
  logueado.value = false
}

export function useAuth() {
  return { logueado, iniciarSesion, cerrarSesion }
}
