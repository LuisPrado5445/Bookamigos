<template>
  <div 
    class="book-card" 
    @click="$emit('click')"
    :class="{ 'no-disponible': !disponible }"
  >
    <div class="book-cover-container">
      <img 
        :src="portada" 
        :alt="`Portada de ${titulo}`" 
        class="book-cover"
        loading="lazy"
      >
      <span v-if="!disponible" class="badge-no-disponible">PRESTADO</span>
    </div>
    
    <div class="book-details">
      <h3 class="book-title">{{ titulo }}</h3>
      
      <div class="book-meta">
        <p v-if="autor" class="meta-item">
          <span class="emoji">✍️</span>
          <span class="text">{{ autor }}</span>
        </p>
        
        <p v-if="genero" class="meta-item">
          <span class="emoji">📚</span>
          <span class="text">{{ genero }}</span>
        </p>
        
        <div class="meta-row">
          <p v-if="anioPublicacion" class="meta-item">
            <span class="emoji">📅</span>
            <span class="text">{{ anioPublicacion }}</span>
          </p>
          
          <p v-if="paginas" class="meta-item">
            <span class="emoji">📖</span>
            <span class="text">{{ paginas }} págs.</span>
          </p>
        </div>
      </div>
      
      <p v-if="sinopsis" class="sinopsis">{{ sinopsis }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    titulo: {
      type: String,
      required: true
    },
    portada: {
      type: String,
      default: 'https://via.placeholder.com/150x200?text=Portada'
    },
    autor: String,
    genero: String,
    anioPublicacion: [String, Number],
    paginas: Number,
    sinopsis: String,
    disponible: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click']
};
</script>

<style scoped>
.book-card {
  --color-primary: #4a6b57;
  --color-secondary: #3a2e1e;
  --color-text: #5a4a32;
  --color-border: #e0d6c2;
  
  background: linear-gradient(135deg, #fff9f0, #ffffff);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  width: 220px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  font-family: 'Georgia', serif;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.book-cover {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.book-title {
  margin: 10px 0;
  font-size: 1.1rem;
  color: var(--color-secondary);
  font-weight: bold;
}

.meta-item {
  font-size: 0.85rem;
  color: var(--color-text);
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sinopsis {
  font-style: italic;
  font-size: 0.8rem;
  color: #7a6b58;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.badge-no-disponible {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(204, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
}

.no-disponible {
  opacity: 0.8;
  filter: grayscale(20%);
}
</style>