<script setup lang="ts">
  import { Return } from 'models/return.model';
  import { useStore } from '~/stores/main';
  import { useVerifyStore } from '~/stores/verify';

  const store = useStore();
  const verify = useVerifyStore();

  const errors: Array<string> = reactive([] as Array<string>);
  const user = reactive(store.getUser);
  const props = defineProps({
    'modelValue': {
      type: String, 
      required: true,
    },
    'disabled': {
      type: Boolean,
      required: false,
    },
    'loading': {
      type: Boolean,
      required: false,
    },
    'validate': {
      type: Boolean,
      required: false
    },
    'registered': {
      type: Boolean,
      required: false,
    }
  })
  const onChange = async () => {
    if (!props.validate) {
      return 'Validation turned off'
    }
    try {
      if (props.modelValue === '') {
        const index = errors.indexOf('Email already in use. This might be by other providers (Google, Facebook ect).')
        errors.splice(index, 1)
        return 'Email is empty'
      }

      if (props.registered && props.modelValue === user.email) {
      const index = errors.indexOf('Email already in use. This might be by other providers (Google, Facebook ect).')
      errors.splice(index, 1)
      return 'Email is not changed'
    }

      const result:Return = await $fetch(`/api/users/register/email/${props.modelValue}`, {method: 'POST'});
      if (result.success) {
        if (!result.data) {
          errors.push('Email already in use. This might be by other providers (Google, Facebook ect).')
        } else {
          const index = errors.indexOf('Email already in use. This might be by other providers (Google, Facebook ect).')
          errors.splice(index, 1)
        }
      } else {
        throw {
          code: 'auth/validate-email-failed',
          message: 'Validation of email failed',
          severity: 3,
          type: 'client',
        }
      }
    } catch (error: any) {
      handle_error(error)
    }
  }
  const emits = defineEmits(['update:modelValue'])
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :loading="loading"
    label="Email"
    variant="solo"
    bg-color="surface-04"
    type="text"
    :error="errors.length > 0"
    :error-messages="errors"
    :disabled="disabled"
    :rules="[
      verify.global_required, 
      verify.text_field_email, 
    ]"
    @change="onChange"
    @input="$emit('update:modelValue', $event.target.value)"
  ></v-text-field>
</template>
