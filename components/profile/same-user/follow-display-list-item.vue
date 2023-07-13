<template>
  <v-list-item>
    <v-row no-gutters class="ma-0" justify="space-between" align="center">
      <v-col cols="2">
        <v-avatar :image="follow.user_avatar"></v-avatar>
      </v-col>
      <v-col cols="7">
        <v-btn
          nuxt
          :to="`/profile/${follow.user_handle}`"
          variant="text"
          flat
          :size="state === 'xs' ? 'small' : 'default'"
        >
          {{ follow.user_handle }}
          <v-icon v-if="follow.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="3">
        <profile-buttons-list-follow :profile="follow" :handle="follow.user_handle" />
      </v-col>
    </v-row>
</v-list-item>
</template>

<script lang="ts">
import { useViewsStore } from '~/stores/view-state';
export default {
setup() {
  const viewsStore = useViewsStore();
  return {viewsStore}
},
name: 'profileSameUserFollowDisplayListItemComponent',
data() {
  return {};
},
props: {
  follow: {
    type: Object,
    required: true,
  },
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
};
</script>