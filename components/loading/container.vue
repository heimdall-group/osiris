<script setup lang="ts">
  const props = defineProps({
    lines: {
      type: Number, 
      required: true,
    },
    vh: {
      type: String,
      required: false,
    }
  })
</script>

<template>
  <v-container fluid :class="['loader-container', `loader-height-${vh}`, 'pa-0']">
    <v-row
      class="fill-height ma-0 pa-1"
    >
      <v-col
        v-for="(key) in lines"
        :key="`loading-container-${key}`"
        cols="12"
        class="loader"
      ></v-col>
    </v-row>
  </v-container>
</template>
