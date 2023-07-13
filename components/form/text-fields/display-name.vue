<template>
  <v-text-field
    v-model="displayName"
    :loading="loading"
    label="Your name"
    variant="solo"
    type="text"
    :disabled="disabled"
    :rules="[
      verify.global_required
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
  name: 'formDisplayNameComponent',
  data() {
    return {
      displayName: this.origin,
    };
  },
  methods: {
    onInput() {
      this.$emit('onInput', this.displayName)
    }
  },
  watch: {
    origin() {
      this.displayName = this.origin
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