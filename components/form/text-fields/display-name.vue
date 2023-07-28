<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { useVerifyStore } from '~/stores/verify';

  const store = useStore();
  const verify = useVerifyStore();
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
  const emist = defineEmits(['update:modelValue'])
</script>

<template>
  <v-text-field
    :loading="loading"
    label="Your name"
    variant="solo"
    bg-color="surface-04"
    type="text"
    :disabled="disabled"
    :rules="[
      verify.global_required
    ]"
    @input="$emit('update:modelValue', $event.target.value)"
  ></v-text-field>
  {{ modelValue }}
</template>
