<template>
  <v-textarea
    v-model="text"
    :loading="loading"
    :counter="maxCount"
    :label="label"
    variant="solo"
    :disabled="disabled"
    max-rows="6"
    :rules="[
      verify.global_required,
      () => verify.text_area_caption_max_count(text, maxCount),
    ]"
    @input="onInput"
  ></v-textarea>
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
  name: 'formTextAreaPostCaptionComponent',
  data() {
    return {
      text: this.origin,
    };
  },
  computed: {
    maxCount() {
      return this.verify.getTextAreaMaxCount;
    }
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
    label: {
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