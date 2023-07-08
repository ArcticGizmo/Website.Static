
<template>
  <img src="/finger-heart.png" class="finger-heart" alt="Vite logo" />
  <h3>What is great about my wife?</h3>
  <br>
  <h2>{{ OPTIONS[index] }}</h2>

  <button type="button" @click="onNext()">Next</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const OPTIONS = [
  'Her Butt',
  'Her Smile',
  'Her K-Pop addiction',
  'She is a social justice warrior',
  'Sleeps like an absolute muffin',
  'She asks me if I am alright',
  'Thinks my spelling is great'
]

const index = ref(0);

const onNext = () => index.value = (index.value + 1) % OPTIONS.length;
</script>


<style scoped>
.finger-heart {
  height: 8em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

button {
  background-color: rgb(254, 224, 228);
}
</style>
