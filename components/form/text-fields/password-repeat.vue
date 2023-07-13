<template>
  <v-text-field
    v-model="text"
    :loading="loading"
    label="Repeat Password"
    variant="solo"
    type="password"
    :disabled="disabled"
    :rules="[
      verify.global_required, 
      () => {return verify.text_field_pwd_match(pwd_2, pwd_1)}, 
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
  name: 'formPasswordRepeatComponent',
  data() {
    return {
      text: this.pwd_2,
    };
  },
  methods: {
    onInput() {
      this.$emit('onInput', this.text)
    }
  },
  watch: {
    origin() {
      this.text = this.pwd_2
    }
  },
  props: {
    pwd_1: {
      type: String,
      required: true,
    },
    pwd_2: {
      type:  String,
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