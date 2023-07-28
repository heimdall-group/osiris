<template>
  <v-card-text class="pa-0 pt-1">
    {{ profile.user_description.text }}
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
name: 'profileDescriptionComponent',
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