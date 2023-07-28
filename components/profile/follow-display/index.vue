<script setup lang="ts">
  import { Return_Followers, Return_Following } from '~/models/return.model';
  import { useStore } from '~/stores/main';
  import { useViewsStore } from '~/stores/view-state';
  import { useProfileStore } from '~/stores/profile';

  const store = useStore();
  const viewsStore = useViewsStore();
  const profileStore = useProfileStore();

  const followers_dialog = ref(false);
  const following_dialog = ref(false);

  const user = computed(() => store.getUser)
  const state = computed(() => viewsStore.getState)
  const profile = computed(() => profileStore.getProfile)
  const followers = computed(() => profileStore.getFollowers)
  const following = computed(() => profileStore.getFollowing)
  const followers_loading = computed(() => profileStore.getFollowers_loading)
  const following_loading = computed(() => profileStore.getFollowing_loading)
  const followers_false = computed(() => profileStore.getFollowers_false)
  const following_false = computed(() => profileStore.getFollowing_false)

  const fetchFollow = async (type: 'followers' | 'following', skip:number):Promise<Return_Followers | Return_Following> => {
    try {    
      const route = useRoute();
      const handle = route.params.handle;
      const token = Object.keys(user.value).length === 0 ?
        undefined :
        await user.value.getIdToken();
      const result:Return_Followers | Return_Following = await $fetch(`/api/users/user/profile/${type}/${handle}`, {
        method: 'POST',
        body: {
          limit: 15,
          skip: skip,
          token: token,
        }
      });

      if (result === undefined) {
        throw 'Result is undefined';
      } else if (result.data === undefined) {
        throw 'Result.data is undefined';
      }

      if (result.success) {
        return result;
      } else {
        throw result.error
      }
    } catch (error:any) {
      return {
        success: false,
        error: error,
      }
    }
  };
  const followersHandler = async () => {
    try {
      if (!followers_loading) {
        throw {
          message: 'Max count reached',
          code: 'profile/followers-max-count-reached',
          severity: 4,
          type: 'client',
        }
      }

      const result:any = await fetchFollow('followers', followers.value.skip_amount);

      if (result.success) {
        profileStore.pushFollowers(result)
      } else {
        throw {
          message: 'Followers fetch failed',
          code: 'profile/followers-fetch-failed',
          severity: 3,
          type: 'server',
          server_error: result.error
        }
      }
    } catch(error: any) {
      handle_error(error)
    }
  };
  const followingHandler = async () => {
    try {
      if (!following_loading) {
        throw {
          message: 'Max count reached',
          code: 'profile/following-max-count-reached',
          severity: 4,
          type: 'client',
        }
      }

      const result:any = await fetchFollow('following', following.value.skip_amount);
      if (result.success) {
        profileStore.pushFollowing(result)
      } else {
        throw {
          message: 'Following fetch failed',
          code: 'profile/following-fetch-failed',
          severity: 3,
          type: 'server',
          server_error: result.error
        }
      }
    } catch(error: any) {
      handle_error(error)
    }
  };
</script>

<template>
  <v-row align="center" class="ma-0">
    <v-col cols="4" class="d-flex justify-center pa-0">
      <profile-buttons-page-follow />
    </v-col>
    <v-col cols="4" class="d-flex justify-center pa-0">
      <v-btn 
        flat
        :size="state === 'xs' ? 'small' : 'default'"
        @click="followers_dialog = !followers_dialog"
      >
        {{ profile.user_followers_count }} 
        {{ profile.user_followers_count === 1 ? 'Follower' : 'Followers' }}
      </v-btn>
    </v-col>
    <v-col cols="4" class="d-flex justify-center pa-0">
      <v-btn 
        flat
        :size="state === 'xs' ? 'small' : 'default'"
        @click="following_dialog = !following_dialog"
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
              :user_same="profile.user_same"
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
              :user_same="profile.user_same"
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
