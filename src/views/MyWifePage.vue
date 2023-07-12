<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-img src="/finger-heart.png" class="finger-heart" alt="Korean Finger Heart" />
      <h4 class="text-h4 pb-16">What is great about my wife?</h4>

      <h3 class="text-h3 font-weight-bold pb-8">{{ OPTIONS[index] }}</h3>

      <v-btn size="x-large" @click="onNext()">Next</v-btn>
    </v-responsive>
  </v-container>
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
