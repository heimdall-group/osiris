<script setup lang="ts">
  const props = defineProps({
    'modelValue': {
      type: Boolean,
      requireD: true,
    },
    'button_text': {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['click'])
</script>

<template>
  <v-row class="ma-0" no-gutters justify="end">
    <slot></slot>
    <v-col cols="12" v-if="modelValue">
      <v-row class="ma-0" justify="center">
        <v-list-item-subtitle
          class="cursor-pointer"
          @click="$emit('click')"
        >
          Reply
        </v-list-item-subtitle>
  </v-row>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
