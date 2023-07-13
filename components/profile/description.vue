<template>
  <v-card-text class="px-0">
    {{ profile.user_handle }}
    <v-icon v-if="profile.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
    <p>{{ profile.user_displayName }}</p>
    <p class="pt-1">{{ profile.user_description }}</p>
  </v-card-text>
</template>

<script lang="ts">
import { useStore } from '~/stores/main';
import { useViewsStore } from '~/stores/view-state';

export default {
async setup() {
  const store = useStore();
  const viewsStore = useViewsStore();

  return {
    store,
    viewsStore
  };
},
name: 'profileDescriptionComponent',
data() {
  return {};
},
props: {
  profile: {
    type: Object,
    required: true,
  }
},
computed: {
  state() {
    return this.viewsStore.getState;
  },
},
methods: {},
mounted() {},
updated() {},
components: {},
emits: [],
};
</script>