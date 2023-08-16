<script setup lang="ts">
import { useStore } from '~/stores/main';
import { useVerifyStore } from '~/stores/verify';

  const store = useStore();
  const verify = useVerifyStore();

  const props = defineProps({
    'modelValue': {
      type: String,
      required: true,
    },
    'repeat': {
      type:  String,
      required: true,
    },
    'disabled': {
      type: Boolean,
      required: false,
    },
    'loading': {
      type: Boolean,
      required: false,
    }
  });
</script>

<template>
  <v-text-field
    :loading="loading"
    label="Repeat Password"
    variant="solo"
    bg-color="surface-04"
    type="password"
    :disabled="disabled"
    :rules="[
      verify.global_required, 
      () => {return verify.text_field_pwd_match(modelValue, repeat)}, 
      verify.text_field_pwd_length
    ]"
    @input="$emit('update:modelValue', $event.target.value)"
  ></v-text-field>
</template>