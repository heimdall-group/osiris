<template>
  <v-container fluid :class="['loader-container', `loader-height-${vh}`, 'pa-0']">
    <v-row
      class="fill-height ma-0 pa-1"
    >
      <v-col
        v-for="(key) in lines"
        :key="key"
        cols="12"
        class="loader"
      ></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  setup() {},
  name: 'loadingContainerComponent',
  data() {
    return {};
  },
  computed: {},
  props: {
    lines: {
      type: Number, 
      required: true,
    },
    vh: {
      type: String,
      required: false,
    }
  },
  methods: {},
  mounted() {},
  updated() {},
  components: {},
  emits: [],
};
</script>
