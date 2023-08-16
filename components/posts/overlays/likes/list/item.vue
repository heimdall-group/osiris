<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';

  const viewsStore = useViewsStore();

  const state = computed(() => viewsStore.getState)

  const props = defineProps({
    'like': {
      type: Object,
      required: true,
    }
  });

</script>

<template>
  <v-list-item
  :prepend-avatar="like.user_avatar"
    rounded="lg"
    class="ma-2"
  >
    <template v-slot:title>
      <nuxt-link
        :to="`/profile/${like.user_handle}`"
      >
        {{ like.user_handle }}
        <v-icon v-if="like.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
      </nuxt-link>  
    </template>
  </v-list-item>
</template>
