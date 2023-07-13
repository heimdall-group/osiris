<template>
  <v-row align="center" class="ma-0">
    <v-col cols="6" class="d-flex justify-center">
      <v-btn 
        flat 
        rounded="lg" 
        @click="followers_dialog = !followers_dialog"
        :size="state === 'xs' ? 'small' : 'default'"
        :class="state === 'xs' ? 'small' : ''"
      >
        {{ profile.user_followers_count }} 
        {{ profile.user_followers_count === 1 ? 'Follower' : 'Followers' }}
      </v-btn>
    </v-col>
    <v-col cols="6" class="d-flex justify-center">
      <v-btn 
        flat 
        rounded="lg" 
        @click="following_dialog = !following_dialog"
        :size="state === 'xs' ? 'small' : 'default'"
        :class="state === 'xs' ? 'small' : ''"
      >
        Following {{ profile.user_following_count }}
      </v-btn>
    </v-col>
    <v-dialog
      v-model="followers_dialog"
      :eager="true"
      width="auto"
      transition="dialog-bottom-transition"
    >
      <v-card
        v-if="followers_false"
        min-height="300px"
        max-height="500px"
        min-width="200px"
        width="auto"
        rounded="lg"
      >
        <pagnation
          :loading="followers_loading"
          :size="25"
          :width="2"
          bottom="0px"
          @intersection-handler="followersHandler"
        >
          <v-list
            width="100%"
          >
            <profile-follow-display-list-item
              v-for="(follower, index) in followers.followers"
              :key="index"
              :follow="follower"
             />
          </v-list>

        </pagnation>
      </v-card>
      <v-card v-else>
        <v-card-text>
          No followers
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="following_dialog"
      :eager="true"
      width="auto"
      transition="dialog-bottom-transition"
    > 
      <v-card
        v-if="following_false"
        min-height="300px"
        max-height="500px"
        min-width="200px"
        width="auto"
        rounded="lg"
      >
        <pagnation
          :loading="following_loading"
          :size="25"
          :width="2"
          bottom="0px"
          @intersection-handler="followingHandler"
        >
          <v-list
            width="100%"
          >
            <profile-follow-display-list-item
              v-for="(follower, index) in following.following"
              :key="index"
              :follow="follower"
             />
          </v-list>
        </pagnation>
      </v-card>
      <v-card v-else>
        <v-card-text>
          Not following anyone
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Return_Followers, Return_Following } from '~/models/return.model';
import { useStore } from '~/stores/main';
import { useViewsStore } from '~/stores/view-state';
import { useProfileStore } from '~/stores/profile';

export default {
async setup() {
  const store = useStore();
  const viewsStore = useViewsStore();
  const profileStore = useProfileStore();

  return {
    store,
    viewsStore,
    profileStore,
  };
},
name: 'profileActionComponent',
data() {
  return {
    followers_dialog: false,
    following_dialog: false,
  };
},
computed: {
  user() {
    return this.store.getUser
  },
  state() {
    return this.viewsStore.getState;
  },
  profile() {
    return this.profileStore.getProfile;
  },
  followers() {
    return this.profileStore.getFollowers;
  },
  following() {
    return this.profileStore.getFollowing;
  },
  followers_loading() {
    return this.profileStore.getFollowers_loading;
  },
  following_loading() {
    return this.profileStore.getFollowing_loading;
  },
  followers_false() {
    return this.profileStore.getFollowers_false;
  },
  following_false() {
    return this.profileStore.getFollowing_false;
  },
},
methods: {
  async fetchFollow(type: 'followers' | 'following', skip:number):Promise<Return_Followers | Return_Following> {
  try {    
    const route = useRoute();
    const handle = route.params.handle;
    const user = this.user;
    const token = Object.keys(user).length === 0 ?
      undefined :
    	await user.getIdToken();
    const result:Return_Followers | Return_Following = await $fetch(`/api/users/user/${type}/${handle}`, {
      method: 'POST',
      body: {
        limit: 15,
        skip: skip,
        token: token,
      }
    });

    if (result === undefined || result.data === undefined) {
      throw 'Result is undefined';
    }

    return result;
  } catch (err:any) {
    return {
      success: false,
      error: err,
    }
  }


  },
  async followersHandler() {
    try {
      if (!this.followers_loading) {
        throw 'Max count reached'
      }

      const result:any = await this.fetchFollow('followers', this.followers.skip_amount);

      if (result.success) {
        this.profileStore.pushFollowers(result)
      } else {
        throw result.error
      }
    } catch(err) {
      console.warn(err)
    }
  },
  async followingHandler() {
    try {
      if (!this.following_loading) {
        throw 'Max count reached'
      }

      const result:any = await this.fetchFollow('following', this.following.skip_amount);
      if (result.success) {
        this.profileStore.pushFollowing(result)
      } else {
        throw result.error
      }
    } catch(err) {
      console.warn(err)
    }
  },
},
mounted() {},
updated() {},
components: {},
emits: [],
};
</script>