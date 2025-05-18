<template>
  <div class="mi-perfil">
    <h2>👤 Mi Perfil</h2>

    <div v-if="usuario" class="perfil-card">
      <img :src="fotoUrl" alt="Foto de perfil" />

      <div class="estadisticas">
        <span @click="mostrarSeguidores = !mostrarSeguidores">
          👥 Seguidores: {{ seguidores.length }}
        </span>
        <span @click="mostrarSeguidos = !mostrarSeguidos">
          ➡️ Siguiendo: {{ seguidos.length }}
        </span>
      </div>

      <ul v-if="mostrarSeguidores">
        <li v-for="s in seguidores" :key="s.id">
          <router-link :to="`/usuarios/${s.id}`">👤 {{ s.nombre }}</router-link>
        </li>
      </ul>

      <ul v-if="mostrarSeguidos">
        <li v-for="s in seguidos" :key="s.id">
          <router-link :to="`/usuarios/${s.id}`">➡️ {{ s.nombre }}</router-link>
        </li>
      </ul>

      <label>Subir imagen de perfil:</label>
      <input type="file" @change="subirImagen" />

      <label>Nombre:</label>
      <input v-model="nombreNuevo" type="text" />

      <label>Descripción:</label>
      <textarea v-model="descripcionNueva" rows="4" />

      <button @click="guardarCambios">Guardar cambios</button>

      <hr />

      <h3>🔐 Cambiar Contraseña</h3>
      <input v-model="passwordActual" type="password" placeholder="Contraseña actual" />
      <input v-model="nuevaPassword" type="password" placeholder="Nueva contraseña" />
      <button @click="cambiarPassword">Cambiar contraseña</button>
      <p v-if="mensajePassword" class="mensaje">{{ mensajePassword }}</p>

      <hr />

      <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
      <p><strong>Email:</strong> {{ usuario.email }}</p>

      <router-link :to="`/usuarios/${usuario.id}`">Ver perfil público</router-link>

      <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
    </div>
    <p v-else>Cargando tu perfil...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../axios'

const usuario = ref(null)
const descripcionNueva = ref('')
const nombreNuevo = ref('')
const mensaje = ref('')
const mensajePassword = ref('')
const seguidores = ref([])
const seguidos = ref([])
const mostrarSeguidores = ref(false)
const mostrarSeguidos = ref(false)

const passwordActual = ref('')
const nuevaPassword = ref('')

// Computed: URL completa de la foto de perfil
const fotoUrl = computed(() => {
  return usuario.value?.fotoperfil
    ? `http://localhost:3001${usuario.value.fotoperfil}`
    : '/default-user.png'
})

const cargarPerfil = async () => {
  try {
    const res = await api.get('/users/me')
    usuario.value = res.data
    descripcionNueva.value = res.data.descripcion || ''
    nombreNuevo.value = res.data.nombre || ''
  } catch (err) {
    console.error('❌ Error al cargar el perfil:', err)
  }
}

const guardarCambios = async () => {
  try {
    await api.put('/users/me', {
      descripcion: descripcionNueva.value,
      nombre: nombreNuevo.value
    })
    mensaje.value = '✅ Cambios guardados correctamente.'
    await cargarPerfil()
  } catch (err) {
    mensaje.value = '❌ Error al guardar cambios.'
    console.error(err)
  }
}

const subirImagen = async (e) => {
  const archivo = e.target.files[0]
  if (!archivo) return
  const formData = new FormData()
  formData.append('foto', archivo)
  try {
    await api.put('/users/me/upload-foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    mensaje.value = '✅ Imagen subida correctamente'
    await cargarPerfil()
  } catch (err) {
    mensaje.value = '❌ Error al subir la imagen'
    console.error(err)
  }
}

const cambiarPassword = async () => {
  try {
    await api.put(`/users/cambiar-password/${usuario.value.id}`, {
      passwordActual: passwordActual.value,
      nuevaPassword: nuevaPassword.value
    })
    mensajePassword.value = '✅ Contraseña actualizada correctamente'
    passwordActual.value = ''
    nuevaPassword.value = ''
  } catch (err) {
    mensajePassword.value = '❌ Error: contraseña incorrecta o servidor'
    console.error(err)
  }
}

const obtenerSeguidoresYSeguidos = async () => {
  try {
    const [res1, res2] = await Promise.all([
      api.get(`/follows/seguidores/${usuario.value.id}`),
      api.get(`/follows/seguidos/${usuario.value.id}`)
    ])
    seguidores.value = res1.data
    seguidos.value = res2.data
  } catch (err) {
    console.error('Error cargando seguidores/seguidos', err)
  }
}

onMounted(async () => {
  await cargarPerfil()
  await obtenerSeguidoresYSeguidos()
})
</script>

<style scoped>
.mi-perfil {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.perfil-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.perfil-card img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}

label {
  display: block;
  text-align: left;
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
  padding: 0.8rem 1.5rem;
  background-color: #4a148c;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.mensaje {
  margin-top: 1rem;
  font-weight: bold;
}

.estadisticas {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #555;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 1rem 0;
}

li {
  text-align: left;
  margin: 0.3rem 0;
  color: #333;
}
</style>
