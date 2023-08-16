<template>
  <v-row class="ma-0">
    <v-col
      v-for="(link, index) in profile.user_description.links"
      :key="`profile-description-${index}`"
      class="pa-0"
      cols="auto"
      sm="auto"
      md="12"
      lg="12"
      xl="12"
      xxl="12"
    >
      <v-card-text class="pa-0 pt-2">
        <a
          :href="link.href"
          flat
          target="_blank"
        >
          {{ link.text }}
        </a>
      </v-card-text>
    </v-col>
  </v-row>
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
name: 'profileDescriptionLinksComponent',
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