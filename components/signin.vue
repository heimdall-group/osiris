<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <user-sign-in />
      </v-col>
      <v-col cols="12">
        <user-providers />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">

export default {
  async setup() {
    return {
    };
  },
  name: 'signinComponent',
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {},
  updated() {},
  components: {},
  emits: [],
};
</script>