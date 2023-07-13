<template>
  <v-text-field
    v-model="text"
    :loading="loading"
    label="Password"
    variant="solo"
    type="password"
    :disabled="disabled"
    :rules="[
      verify.global_required, 
      verify.text_field_pwd_length
    ]"
    @input="onInput"
  ></v-text-field>
</template>

<script lang="ts">
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
  name: 'formPasswordComponent',
  data() {
    return {
      text: this.origin,
    };
  },
  methods: {
    onInput() {
      this.$emit('onInput', this.text)
    }
  },
  watch: {
    origin() {
      this.text = this.origin
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