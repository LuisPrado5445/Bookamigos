<template>
  <div class="libros-page">
    <h1>Biblioteca Digital</h1>
    
    <div v-if="loading" class="loading">Cargando libros...</div>
    <div v-else class="grid-libros">
      <BookCard 
      v-for="libro in libros"
      :key="libro.id"
      v-bind="libro"
    />
    </div>
  </div>
</template>

<script>
import BookCard from '@/components/BookCard.vue';
import librosData from '@/assets/data/librosprueba.json';

export default {
  components: {
    BookCard // Registro del componente
  },
  data() {
    return {
      libros: [],
      loading: true
    };
  },
  created() {
    // Simulamos carga asíncrona aunque sea importación directa
    setTimeout(() => {
      this.libros = librosData;
      this.loading = false;
    }, 500);
  },
  methods: {
    verDetalle(libro) {
      console.log('Libro seleccionado:', libro);
      // this.$router.push(`/libros/${libro.id}`); // Ejemplo para ruta detalle
    }
  }
};
</script>

<style scoped>
.libros-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.grid-libros {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 768px) {
  .grid-libros {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .libros-page {
    padding: 1rem;
  }
}
</style>