<template>
  <v-btn
    v-if="profile.user_same"
    flat
    :size="state === 'xs' ? 'small' : 'default'"
    variant="outlined"
    class="edit-button"
    :to="`/profile/${user_db.user_handle}/edit`"
  >
    Edit
  </v-btn>
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
  import { useStore } from '~/stores/main';
  import { useProfileStore } from '~/stores/profile';
  import { useViewsStore } from '~/stores/view-state';

  export default {
  setup() {
    const store = useStore();
    const profileStore = useProfileStore();
    const viewsStore = useViewsStore();

    return {
      store,
      profileStore,
      viewsStore
    }
  },
  name: 'profileButtonPageFollowComponent',
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    profile() {
      return this.profileStore.getProfile;
    },
    user() {
      return this.store.getUser;
    },
    user_db() {
      return this.store.getUser_db;
    },
    state() {
      return this.viewsStore.getState;
    }
  },
  methods: {},
  mounted() {},
  updated() {},
  components: {},
  };
</script>