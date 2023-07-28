<script setup lang="ts">
  import { Return } from 'models/return.model';
  import { useStore } from '~/stores/main';
  import { useVerifyStore } from '~/stores/verify';

  const store = useStore();
  const verify = useVerifyStore();

  const errors: Array<string> = reactive([] as Array<string>);
  const user_db = reactive(store.getUser_db);
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
    'registered': {
      type: Boolean,
      required: false,
    }
  })
  const onChange = async () => {
      if (props.modelValue === '') {
        const index = errors.indexOf('Handle already exists')
        errors.splice(index, 1)
        return 'Handle is empty'
      }

      if (props.registered && props.modelValue === user_db.user_handle) {
        const index = errors.indexOf('Handle already exists')
        errors.splice(index, 1)
        return 'Handle is not changed'
      }

      try {
        const result:Return = await $fetch(`/api/users/register/handle/${props.modelValue}`, {method: 'POST'});
        if (result.success) {
          if (!result.data) {
            errors.push('Handle already exists')
          } else {
            const index = errors.indexOf('Handle already exists')
            errors.splice(index, 1)
          }
        } else {
          throw {
            code: 'auth/validate-handle-failed',
            message: 'Validation of handle failed',
            severity: 3,
            type: 'client',
          }
        }
      } catch(error: any) {
        handle_error(error);
      }
    }
  const emist = defineEmits(['update:modelValue'])
</script>

<template>
  <v-text-field
    :loading="loading"
    label="Handle"
    variant="solo"
    bg-color="surface-04"
    type="text"
    :error="errors.length > 0"
    :error-messages="errors"
    :disabled="disabled"
    :rules="[
      verify.global_required,
    ]"
    @input="$emit('update:modelValue', $event.target.value)"
    @change="onChange"
  ></v-text-field>
</template>
