<template>
  <v-btn v-if="profile.user_same" disabled>Follow</v-btn>
  <profile-buttons-sub-follow 
    v-else-if="!profile.user_followed_by_current_user" 
    :callback="() => {profileList_addFollower(handle)}" 
  />
  <profile-buttons-sub-follow-back 
    v-else-if="!profile.user_follow_back_by_current_user" 
    :callback="() => {profileList_addFollower(handle)}" 
  />
  <profile-buttons-sub-remove 
    v-else-if="profile.user_followed_by_current_user" 
    :callback="() => {profileList_removeFollower(handle)}" 
  />
</template>

<script lang="ts">

  export default {
  setup() {
    return {}
  },
  name: 'profileButtonListFollowComponent',
  data() {
    return {};
  },
  props: {
    handle: {
      type: String,
      required: true,
    },
    profile: {
      type: Object,
      required: true,
    },
  },
  computed: {},
  methods: {},
  mounted() {},
  updated() {},
  components: {},
  };
</script>