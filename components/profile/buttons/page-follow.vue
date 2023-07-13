<template>
  <v-btn v-if="profile.user_same" disabled>Follow</v-btn>
  <profile-buttons-sub-follow 
    v-else-if="!profile.user_followed_by_current_user" 
    :callback="profilePage_addFollower" 
  />
  <profile-buttons-sub-follow-back 
    v-else-if="!profile.user_follow_back_by_current_user" 
    :callback="profilePage_addFollower" 
  />
  <profile-buttons-sub-remove 
    v-else-if="profile.user_followed_by_current_user" 
    :callback="profilePage_removeFollower" 
  />
</template>

<script lang="ts">
  import { useViewsStore } from '~/stores/view-state';
  import { useProfileStore } from '~/stores/profile';

  export default {
  setup() {
    const viewsStore = useViewsStore();
    const profileStore = useProfileStore();
    return {
      viewsStore,
      profileStore
    }
  },
  name: 'profileButtonPageFollowComponent',
  data() {
    return {};
  },
  computed: {
    state() {
      return this.viewsStore.getState;
    },
    profile() {
      return this.profileStore.getProfile;
    }
  },
  methods: {},
  mounted() {},
  updated() {},
  components: {},
  };
</script>