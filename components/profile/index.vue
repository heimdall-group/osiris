<template>
    <loading-page v-if="pending" />
    <v-container fluid>
      <v-row justify="center" class="ma-0 pa-0">
        <v-col
          cols="12"
          sm="12"
          md="10"
          lg="8"
          xl="8"
          xxl="6"
          class="pa-0"
        >
          <v-card
            v-if="!profile.user_same"
            rounded="lg"
            :class="['pa-6', state]"
            width="100%"
            flat
          >
            <v-card-text class="text-body-1 pa-0 text-center">
              {{ profile.user_handle }}
              <v-icon v-if="profile.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
            </v-card-text>
            <v-row v-if="state === 'xs'" class="ma-0 pa-0">
            </v-row>
            <v-row v-if="state === 'sm'" justify="center">
            </v-row>
            <v-row v-if="state === 'md'">
            </v-row>
            <v-row v-if="state === 'lg' || state === 'xl' || state === 'xxl'">
            </v-row>
            <v-avatar :image="profile.user_avatar"></v-avatar>
            <profile-follow-display />
            <profile-buttons-page-follow :profile="profile" />
          </v-card>
          <v-card
            v-else
            rounded="lg"
            :class="['pa-6', state]"
            width="100%"
            flat
          >
            Your profile
            <profile-same-user-follow-display />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
import { useStore } from '~/stores/main';
import { useViewsStore } from '~/stores/view-state';
import { useProfileStore } from '~/stores/profile';
import { Profile } from 'models/profile.model';

export default {
  async setup() {
    const store = useStore();
    const viewsStore = useViewsStore();
    const profileStore = useProfileStore();
    profileStore.resetProfile();
    profileStore.resetFollowers();
    profileStore.resetFollowing();
    const user = store.getUser;
    const route = useRoute();
    const handle = route.params.handle;
    const token = Object.keys(user).length === 0 ? '' : await user.getIdToken();
    const callback = Object.keys(user).length === 0 ?
      () => $fetch(`/api/users/user/profile/${handle}`) :
      () => $fetch(`/api/users/user/profile/${handle}`, {
        method: 'POST',
        body: {
          token: token,
        }
      });
    const { data, pending, error, refresh } = await useLazyAsyncData('profile', 
        callback
    );
    
    watch(data, (newData) => {
      if (newData !== null) {
        if (newData.success) {
          profileStore.setProfile(newData.data as Profile)
        } else {
          console.error(newData.error);

          // Reroute prob
        }
      }
    })

    return {
      data,
      pending,
      viewsStore,
      profileStore,
    };
  },
  name: 'profileComponent',
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
  mounted() {
    if (Object.keys(this.profile).length === 0) {
      if (this.data?.success) {
        this.profileStore.setProfile(this.data.data as Profile)
      }
    }
  },
  updated() {},
  components: {},
  emits: [],
};
</script>