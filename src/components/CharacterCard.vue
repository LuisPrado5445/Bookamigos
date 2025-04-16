<template>
  <div class="character-card" @click="$emit('click')">
    <img :src="imagen" :alt="nombre" />
    <h3>{{ nombre }}</h3>
    <p v-if="descripcion">{{ descripcion }}</p>
    <p v-if="especie">📖 Especie: {{ especie }}</p>
    <p v-if="genero">⚧️ Género: {{ genero }}</p>
    <p v-if="origen">🌍 Origen: {{ origen }}</p>
  </div>
</template>

<script setup>
defineProps({
  nombre: String,
  imagen: String,
  descripcion: String,
  especie: String,
  genero: String,
  origen: String,
});
defineEmits(['click']);
</script>

<style scoped>
.character-card {
  background: linear-gradient(135deg, #ffffff, #f3f3f3);
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.character-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.character-card img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.character-card h3 {
  margin: 5px 0;
  font-size: 18px;
  color: #333;
}

.character-card p {
  font-size: 14px;
  color: #555;
  margin: 4px 0;
}
</style>
