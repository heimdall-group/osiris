<template>
  <v-text-field
    v-model="handle"
    :loading="loading"
    label="Handle"
    variant="solo"
    type="text"
    :error="errors.length > 0"
    :error-messages="errors"
    :disabled="disabled"
    :rules="[
      verify.global_required,
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
  name: 'formHandleComponent',
  data() {
    return {
      handle: this.origin,
      errors: [] as Array<string>,
    };
  },
  methods: {
    onInput() {
      this.$emit('onInput', this.handle)
    },
    async onChange() {
      if (this.handle === '') {
        const index = this.errors.indexOf('Handle already exists')
        this.errors.splice(index, 1)
        return
      }
      const result:Return = await $fetch(`/api/users/register/handle/${this.handle}`, {method: 'POST'});
      if (result.success) {
        if (!result.data) {
          this.errors.push('Handle already exists')
        } else {
          const index = this.errors.indexOf('Handle already exists')
          this.errors.splice(index, 1)
        }
      }
    }
  },
  watch: {
    origin() {
      this.handle = this.origin
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
    }
  },
  emits: ['onInput']
};
</script>