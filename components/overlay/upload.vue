<template>
  <client-only>
    <v-navigation-drawer
      v-model="drawer"
      location="top"
      color="transparent"
      width="auto"
      floating
    >
      <v-list class="pa-0">
        <v-list-item>
          <v-card
            width="100%"
            class="pa-4"
          >
            <v-row align="center">
              <v-card-title>Current Uploads:</v-card-title>
              <v-spacer></v-spacer>
              <v-btn @click="drawer = !drawer">
                <font-awesome-icon icon="fa-solid fa-xmark" />
              </v-btn>
            </v-row>
          </v-card>
        </v-list-item>
        <v-list-item
          class="px-4 py-1"
          v-for="(upload, index) in uploads"
          :key="index"
        >
          <v-card
            width="100%"
            class="pa-4"
          >
            <v-row>
              <v-col cols="2" class="d-flex justify-center align-center">
                <font-awesome-icon v-if="upload.completed" icon="fa-solid fa-check" />
                <v-progress-circular v-else indeterminate :size="30" :width="2"></v-progress-circular>
              </v-col>
              <v-col cols="10">
                <v-row v-for="(item, index) in upload.upload_items">
                  <v-col cols="12">
                    <p>{{ item.name }}</p>
                    <v-row v-for="(data, index) in item.data">
                      <v-col cols="6" class="d-flex justify-center">
                        <p>- Current Fps: {{ data.current_fps }}</p>
                      </v-col>
                      <v-col cols="6" class="d-flex justify-center">
                        <p>- Time elapsed: {{ data.timemark }}</p>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar 
      v-if="Object.keys(uploads).length !== 0"
      color="transparent"
      flat
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
  </client-only>
</template>

<style>
.upload-list {
  position: fixed;
  top: 0;
  z-index: 2000;
  background: transparent;
}

</style>

<script lang="ts">
import { useUploadStore } from "~/stores/upload";

export default {
setup() {
  const store = useUploadStore();
  return {
    store,
  }
},
name: 'overlayUploadComponent',
data() {
  return {
    drawer: false,
  };
},
computed: {
  uploads() {
    return this.store.getUploads;
  }
},
methods: {},
mounted() {
},
updated() {},
components: {},
emits: [],
};

</script>