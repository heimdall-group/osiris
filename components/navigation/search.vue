<script setup lang="ts">
  const dialog = ref(false);

  const searchHandler = () => {

  };
</script>

<template>
  <v-btn class="mx-1" @click="dialog = !dialog" icon="mdi: mdi-magnify"></v-btn>
</template>

<style>
.close-button {
  margin: -20px 0 0 8px;
}

.close-button .fa-xmark {
  margin: -3px 0 0 0;
}
</style>
