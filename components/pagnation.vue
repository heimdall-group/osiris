<template>
  <v-row class="ma-0" no-gutters>
    <slot></slot>
    <v-col cols="12"
      class="trigger"
      :style="{
        bottom: bottom,
      }"
      v-intersect="{
        handler: observerHandler,
        options: {
          threshold: 0.5,
        },
      }"
    ></v-col>
    <v-col cols="12" v-if="loading" class="loading-col">
      <v-progress-circular indeterminate :size="size" :width="width"></v-progress-circular>
    </v-col>

  </v-row>
</template>

<style scoped>

.loading-col {
  position: relative;
  height: 35px;
}
.v-progress-circular {
  position: absolute;
  left: calc(50% - 12.5px)
}

.trigger {
  position: static;
  width: 100%;
  height: 0px;
  z-index: 2500;
}
</style>

<script lang="ts">
  export default {
  setup() {

    return {

    }
  },
  name: 'pagnationComponent',
  data() {
    return {};
  },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    bottom: {
      type: String,
      required: true,
    },
  },
  computed: {},
  methods: {
    observerHandler(entries:any) {
      if (entries) {
        this.$emit('intersectionHandler')
      }
    },
  },
  mounted() {
  },
  updated() {},
  components: {},
  emits: ['intersectionHandler'],
  };
</script>