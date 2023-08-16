<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';
  const viewsStore = useViewsStore();

  const props = defineProps({
    follow: {
      type: Object,
      required: true,
    },
    user_same: {
      type: Boolean,
      required: false,
    }
  })

  const addFollower = () => {
    profileList_addFollower(props.follow.user_handle, props.user_same)
  }
  const removeFollower = () => {
    profileList_removeFollower(props.follow.user_handle, props.user_same)
  }

  const state = computed(() => viewsStore.getState)
</script>

<template>
  <v-list-item
    :prepend-avatar="follow.user_avatar"
    rounded="lg"
    class="ma-2"
  >
  <template v-slot:title>
    <nuxt-link
      :to="`/profile/${follow.user_handle}`"
    >
      {{ follow.user_handle }}
      <v-icon v-if="follow.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
    </nuxt-link>  
  </template>

      <v-list-item-action>
        <v-list-item-subtitle 
          v-if="follow.user_same"
          title="You cannot follow yourself"
          class="pa-2 cursor-pointer disabled"
        >
          Follow
        </v-list-item-subtitle>
        <template v-else>
          <v-list-item-subtitle
            v-if="follow.current_user_follows" 
            title="Stop following this user"
            @click="removeFollower"
            class="pa-2 cursor-pointer"
          >
            Unfollow
          </v-list-item-subtitle>
          <v-list-item-subtitle
            v-else-if="follow.current_user_followed" 
            title="Follow this user back"
            @click="addFollower"
            class="pa-2 cursor-pointer"
          >
            Follow back
          </v-list-item-subtitle>
          <v-list-item-subtitle
            v-else 
            title="Follow this user"
            @click="addFollower"
            class="pa-2 cursor-pointer"
          >
            Follow
          </v-list-item-subtitle>
        </template>
      </v-list-item-action>
  </v-list-item>
</template>

<style scoped>
  .v-list-item {
    background: rgb(var(--v-theme-surface-03));
  }
</style>
