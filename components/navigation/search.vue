<template>
  <v-btn class="mx-1" @click="dialog = !dialog" icon="mdi: mdi-magnify"></v-btn>
  <v-dialog
    v-model="dialog"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
          color="transparent"
          class="ma-0 pa-4"
        >
          <v-text-field 
            variant="solo" 
            prepend-icon="fa-solid fa-magnifying-glass"
          >
          </v-text-field>
          <v-btn
            @click="dialog = false"
            icon="fa-solid fa-xmark"
            class="close-button"
          ></v-btn>
        </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<style>
.close-button {
  margin: -20px 0 0 8px;
}

.close-button .fa-xmark {
  margin: -3px 0 0 0;
}
</style>

<script lang="ts">

export default {
  async setup() {
    return {
    };
  },
  name: 'headerSearchComponent',
  data() {
    return {
      dialog: false,
    };
  },
  computed: {},
  methods: {
    searchHandler() {

    },
  },
  mounted() {},
  updated() {},
  components: {},
  emits: [],
};
</script>