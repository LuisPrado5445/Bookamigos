<template>
  <div class="card" @click="$emit('click')">
    <img v-if="imagen" :src="imagen" :alt="titulo" />
    <h3>{{ titulo }}</h3>
    <p v-if="subtitulo" class="sub">{{ subtitulo }}</p>
    <p v-if="descripcion" class="desc">{{ descripcion }}</p>
    <slot></slot> <!-- contenido adicional opcional -->
  </div>
</template>

<script setup>
defineProps({
  titulo: String,
  subtitulo: String,
  descripcion: String,
  imagen: String
})
defineEmits(['click'])
</script>

<style scoped>
.card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #4a148c;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  cursor: pointer;
}
.card:hover {
  transform: scale(1.03);
}
.card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.5rem;
}
.card h3 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}
.card .sub {
  font-weight: bold;
  color: #4a148c;
}
.card .desc {
  color: #555;
  font-size: 0.9rem;
}
</style>
