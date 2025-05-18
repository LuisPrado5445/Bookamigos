<template>
  <div class="perfil-usuario">
    <h2>👤 Perfil de {{ usuario?.nombre }}</h2>

    <div class="perfil-card" v-if="usuario">
      <img :src="fotoUrl" alt="Foto de perfil" />
      <h3>{{ usuario.nombre }}</h3>

      <p><strong>Descripción:</strong></p>
      <p class="descripcion">{{ usuario.descripcion || 'Sin descripción.' }}</p>

      <div class="estadisticas">
        <span @click="mostrarSeguidores = !mostrarSeguidores">
          📥 Seguidores: {{ estadisticas.seguidores }}
        </span>
        <span @click="mostrarSeguidos = !mostrarSeguidos">
          📤 Siguiendo: {{ estadisticas.seguidos }}
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

      <div v-if="usuario.id !== miId">
        <button @click="toggleSeguir" :class="{ siguiendo: yaLoSigo }">
          {{ yaLoSigo ? '✓ Siguiendo' : '+ Seguir' }}
        </button>
      </div>
    </div>

    <p v-else>Cargando perfil...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../axios'

const route = useRoute()
const usuario = ref(null)
const miId = ref(null)
const yaLoSigo = ref(false)
const mostrarSeguidores = ref(false)
const mostrarSeguidos = ref(false)

const estadisticas = ref({
  reseñas: 0,
  seguidores: 0,
  seguidos: 0
})

const seguidores = ref([])
const seguidos = ref([])

const fotoUrl = computed(() => {
  return usuario.value?.fotoperfil
    ? `http://localhost:3001${usuario.value.fotoperfil}`
    : '/default-user.png'
})

const obtenerMiPerfil = async () => {
  try {
    const res = await api.get('/users/me')
    miId.value = res.data.id
  } catch (error) {
    console.error('Error al obtener tu perfil', error)
  }
}

const obtenerUsuario = async () => {
  try {
    const res = await api.get(`/users/${route.params.id}`)
    usuario.value = res.data
  } catch (error) {
    console.error('Error al obtener el usuario:', error)
  }
}

const verificarSiLoSigo = async () => {
  try {
    const res = await api.get(`/follows/seguidos/${miId.value}`)
    yaLoSigo.value = res.data.some(seg => seg.id === Number(route.params.id))
  } catch (error) {
    console.error('Error verificando seguimiento:', error)
  }
}

const obtenerEstadisticas = async () => {
  try {
    const [reseñas, seguidoresRes, seguidosRes] = await Promise.all([
      api.get('/reviews'),
      api.get(`/follows/seguidores/${route.params.id}`),
      api.get(`/follows/seguidos/${route.params.id}`)
    ])
    estadisticas.value.reseñas = reseñas.data.filter(r => r.usuarioId == route.params.id).length
    estadisticas.value.seguidores = seguidoresRes.data.length
    estadisticas.value.seguidos = seguidosRes.data.length
    seguidores.value = seguidoresRes.data
    seguidos.value = seguidosRes.data
  } catch (error) {
    console.error('Error al obtener estadísticas', error)
  }
}

const toggleSeguir = async () => {
  try {
    if (!yaLoSigo.value) {
      await api.post('/follows', { seguidoId: usuario.value.id })
      yaLoSigo.value = true
      estadisticas.value.seguidores++
    } else {
      await api.delete(`/follows/${usuario.value.id}`)
      yaLoSigo.value = false
      estadisticas.value.seguidores--
    }
  } catch (error) {
    console.error('Error al seguir/dejar de seguir:', error)
  }
}

onMounted(async () => {
  await obtenerMiPerfil()
  await obtenerUsuario()
  await verificarSiLoSigo()
  await obtenerEstadisticas()
})

watch(() => route.params.id, async () => {
  await obtenerUsuario()
  await verificarSiLoSigo()
  await obtenerEstadisticas()
})
</script>

<style scoped>
.perfil-usuario {
  max-width: 600px;
  margin: auto;
  text-align: center;
  padding: 2rem;
}

.perfil-card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.perfil-card img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px; /* ✅ Cuadrado con esquinas suaves */
  margin-bottom: 0.5rem;
  border: 2px solid #4a148c;
}

.descripcion {
  margin: 1rem 0;
  font-style: italic;
  color: #444;
}

.estadisticas {
  margin: 1rem 0;
  display: flex;
  justify-content: space-around;
  color: #555;
  font-weight: bold;
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

button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  background-color: #4a148c;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button.siguiendo {
  background-color: #888;
}
</style>
