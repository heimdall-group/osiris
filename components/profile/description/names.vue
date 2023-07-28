<template>
  <v-card-text class="px-0 pb-1">
    {{ profile.user_handle }}
    <v-icon v-if="profile.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
  </v-card-text>
  <v-card-text class="pa-0">
    {{ profile.user_displayName }}
  </v-card-text>
</template>

<script lang="ts">
import { useProfileStore } from '~/stores/profile';

export default {
async setup() {
  const profileStore = useProfileStore();

  return {
    profileStore
  };
},
name: 'profileDescriptionNamesComponent',
data() {
  return {};
},
computed: {
  profile() {
    return this.profileStore.getProfile;
  },
},
methods: {},
mounted() {},
updated() {},
components: {},
emits: [],
};
</script>