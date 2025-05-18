<!-- src/viewsAutenticacion/HomeView.vue -->
<template>
  <div class="home">
    <h2>📚 ¡Bienvenido a Bookamigos!</h2>
    <p>Una red social para amantes de los libros.</p>

    <div class="cuadros">
      <router-link to="/libros" class="cuadro-link">
        <div class="cuadro">
          <h3>Libros</h3>
          <p>{{ totalLibros }} publicados</p>
        </div>
      </router-link>

      <router-link to="/usuarios" class="cuadro-link">
        <div class="cuadro">
          <h3>Usuarios</h3>
          <p>{{ totalUsuarios }} registrados</p>
        </div>
      </router-link>

      <router-link to="/reseñas" class="cuadro-link">
        <div class="cuadro">
          <h3>Reseñas</h3>
          <p>{{ totalReseñas }} escritas</p>
        </div>
      </router-link>

      <router-link to="/discusiones" class="cuadro-link">
        <div class="cuadro">
          <h3>Discusiones</h3>
          <p>{{ totalDiscusiones }} activas</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

const totalLibros = ref(0)
const totalUsuarios = ref(0)
const totalReseñas = ref(0)
const totalDiscusiones = ref(0)

onMounted(async () => {
  try {
    const [libros, usuarios, reseñas, discusiones] = await Promise.all([
      api.get('/books'),
      api.get('/users'),
      api.get('/reviews'),
      api.get('/discussions')
    ])
    totalLibros.value = libros.data.length
    totalUsuarios.value = usuarios.data.length
    totalReseñas.value = reseñas.data.length
    totalDiscusiones.value = discusiones.data.length
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
})
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.cuadros {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.cuadro-link {
  text-decoration: none;
  color: inherit;
}

.cuadro {
  background: white;
  border: 2px solid #4a148c;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.cuadro:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cuadro h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.cuadro p {
  font-size: 1rem;
  color: #555;
}
</style>
