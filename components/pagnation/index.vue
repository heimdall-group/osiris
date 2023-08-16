<script setup lang="ts">
  const props = defineProps({
    loading: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    bottom: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['intersectionHandler'])

  const observerHandler = (entries:any) => {
    if (entries) {
      emits('intersectionHandler')
    }
  };
</script>

<template>
  <v-row class="ma-0" no-gutters>
    <slot></slot>
    <v-col cols="12"
      class="has-pagnation-trigger pa-0"
      :style="{
        bottom: bottom,
      }"
      v-intersect="{
        handler: observerHandler,
        options: {
          threshold: 0.5,
        },
      }"
    ></v-col>
    <v-col cols="12" v-if="loading" class="loading-v-col">
      <v-progress-circular indeterminate :size="size" :width="width"></v-progress-circular>
    </v-col>
  </v-row>
</template>

<style scoped>
.loading-v-col {
  position: relative;
  height: 35px;
}
.v-progress-circular {
  position: absolute;
  left: calc(50% - 12.5px)
}

.has-pagnation-trigger {
  position: static;
  width: 100%;
  height: 0px;
  z-index: 2500;
}
</style>
