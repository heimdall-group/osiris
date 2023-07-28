<script setup lang="ts">
import { useProfileStore } from '~/stores/profile';
const profileStore = useProfileStore();
const props = defineProps({
  profile_prop: {
    type: Object,
    required: true,
  }
})
</script>

<template>
  <v-menu location="end">
    <template v-slot:activator="{ props }">
      <v-btn
        variant="text"
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
          Block
        </v-btn>
        <v-btn
          block
          variant="text"
          color="error"
        >
          Report
        </v-btn>
      </v-list-item>
    </v-list>
</v-menu>
</template>
