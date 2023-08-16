<script setup lang="ts">
import { useProfileStore } from '~/stores/profile';
const profileStore = useProfileStore();
const props = defineProps({
  identifier: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <v-menu location="end" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn
        variant="plain"
        flat
        v-bind="props"
        height="32px"
        width="32px"
        icon="fa-solid fa-ellipsis-vertical"
      >
      </v-btn>
    </template>

    <v-list class="pa-0">
      <v-list-item class="pa-0">
        <v-btn
          block
          variant="text"
          color="error"
        >
          Report
        </v-btn>
      </v-list-item>
      <slot></slot>
    </v-list>
  </v-menu>
</template>
