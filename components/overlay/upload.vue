<script setup lang="ts">
  import { useUploadStore } from "~/stores/upload";
  const store = useUploadStore();
  const drawer = ref(false);
  const uploads = computed(() => store.getUploads)
</script>

<template>
  <client-only>
    <v-navigation-drawer
      v-model="drawer"
      location="top"
      color="transparent"
      :disable-resize-watcher="true"
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
