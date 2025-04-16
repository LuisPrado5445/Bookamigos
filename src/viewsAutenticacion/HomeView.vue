<template>
  <div class="home-container">
    <h1>📚 ¡Bienvenido a Bookamigos!</h1>
    <p>Conéctate con amantes de la lectura, comparte tus reseñas favoritas, descubre nuevos libros y participa en discusiones literarias.</p>

    <router-link class="btn" to="/usuarios">Explorar Usuarios</router-link>
    <router-link class="btn" to="/libros">Ver Libros</router-link>
    <router-link class="btn" to="/reseñas">Últimas Reseñas</router-link>
    <router-link class="btn" to="/discusiones">Unirse a Discusiones</router-link>
  </div>
</template>

<script setup>
// No necesitas lógica aquí por ahora
</script>

<style scoped>
.home-container {
  text-align: center;
  max-width: 700px;
  margin: auto;
  padding: 3rem 2rem;
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h1 {
  font-size: 2.5rem;
  color: #4a148c;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}

.btn {
  display: inline-block;
  margin: 0.5rem;
  padding: 0.8rem 1.2rem;
  background-color: #4a148c;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #6a1b9a;
}
</style>
