<template>
  <v-container class="fill-height justify-center">
    <v-responsive class="align-center text-center fill-height" max-width="500px">

      <h3 class="text-h3 pb-16">I'll help you pick!</h3>
      <h5 class="text-h5 pb-8">Just give me some options</h5>

      <v-list>
        <v-list-item v-for="(_, index) in options" :key="index">
          <v-text-field v-model="options[index]" placeholder="Give me an option!" append-icon="mdi-delete"
            @click:append="onDelete(index)" />
        </v-list-item>
      </v-list>

      <v-row class="mt-4" align="center" justify="center">
        <v-btn size="x-large" @click="onAdd()">Add</v-btn>
        <v-btn size="x-large" :disabled="options.filter(o => !!o).length === 0" @click="onPick()">Pick One!</v-btn>
      </v-row>
    </v-responsive>

    <v-dialog v-model="show" max-width="600px">
      <v-card>
        <v-card-text>
          <h4 class="text-h4  pb-8">How about ...</h4>
          <br>
          <h4 class="text-h4 text-center  pb-8">{{ answer }}</h4>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="onClose">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const options = ref<string[]>([""]);
const answer = ref("");
const show = ref(false);

const onAdd = () => {
  options.value.push("");
};

const onDelete = (index: number) => options.value.splice(index, 1);

const onPick = () => {
  const index = Math.trunc(Math.random() * options.value.length);
  answer.value = options.value[index];
  show.value = true
};

const onClose = () => {
  show.value = false;
}
</script>


<style scoped>
.v-row button {
  background-color: rgb(203, 208, 255);
}
</style>
