<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { useVerifyStore } from '~/stores/verify';

  const store = useStore();
  const verify = useVerifyStore();
  const count = ref(128);
  const props = defineProps({
    'modelValue': String,
    'disabled': {
      type: Boolean,
      required: false,
    },
    'loading': {
      type: Boolean,
      required: false,
    }
  })  
  const emits = defineEmits(['update:modelValue'])
</script>

<template>
  <v-textarea
    :model-value="modelValue"
    :loading="loading"
    label="Description"
    variant="solo"
    :counter="count"
    no-resize
    bg-color="surface-04"
    type="text"
    :disabled="disabled"
    :rules="[
    ]"
    @input="$emit('update:modelValue', $event.target.value)"
  ></v-textarea>
</template>
