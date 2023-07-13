<template>
  <v-text-field
    v-model="email"
    :loading="loading"
    label="Email"
    variant="solo"
    type="text"
    :error="errors.length > 0"
    :error-messages="errors"
    :disabled="disabled"
    :rules="[
      verify.global_required, 
      verify.text_field_email, 
    ]"
    @input="onInput"
    @change="onChange"
  ></v-text-field>
</template>

<script lang="ts">
import { Return } from 'models/return.model';
import { useStore } from '~/stores/main';
import { useVerifyStore } from '~/stores/verify';

export default {
  setup() {
    const store = useStore();
    const verify = useVerifyStore();
    return {
      store,
      verify,
    };
  },
  name: 'formEmailComponent',
  data() {
    return {
      email: this.origin,
      errors: [] as Array<string>,
    };
  },
  methods: {
    onInput() {
      this.$emit('onInput', this.email)
    },
    async onChange() {
      if (!this.validate_db) {
        return
      }
      if (this.email === '') {
        const index = this.errors.indexOf('Email already in use. This might be by other providers (Google, Facebook ect).')
        this.errors.splice(index, 1)
        return
      }
      const result:Return = await $fetch(`/api/users/register/email/${this.email}`, {method: 'POST'});
      console.log(result)
      if (result.success) {
        if (!result.data) {
          this.errors.push('Email already in use. This might be by other providers (Google, Facebook ect).')
        } else {
          const index = this.errors.indexOf('Email already in use. This might be by other providers (Google, Facebook ect).')
          this.errors.splice(index, 1)
        }
      }
    }
  },
  watch: {
    origin() {
      this.email = this.origin
    }
  },
  props: {
    origin: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
    },
    validate_db: {
      type: Boolean,
      required: true
    }
  },
  emits: ['onInput']
};
</script>