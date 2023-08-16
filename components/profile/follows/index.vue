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

  const items = [
    { text: 'Real-Time', icon: 'mdi-clock' },
    { text: 'Audience', icon: 'mdi-account' },
    { text: 'Conversions', icon: 'mdi-flag' },
  ]

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
      if (!followers_loading.value) {
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
      if (!following_loading.value) {
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
    <v-col 
      class="d-flex justify-center px-0 py-1"
      cols="12"
      sm="4"
      md="4"
      lg="4"
      xl="4"
      xxl="4"    
    >
      <v-btn
        v-if="profile.user_same"
        flat
        :to="`/profile/${profile.user_handle}/edit`"
        block
        prepend-icon="fa-solid fa-pen"
        color="primary"
      >
        Edit
      </v-btn>
      <v-btn
        v-else-if="profile.current_user_follows" 
        @click="profilePage_removeFollower"
        flat
        block
        color="primary"
      >
        Unfollow
      </v-btn>
      <v-btn
        v-else-if="profile.current_user_followed" 
        @click="profilePage_addFollower"
        flat
        block
        color="primary"
      >
        Follow back
      </v-btn>
      <v-btn
        v-else 
        @click="profilePage_addFollower"
        flat
        block
        color="primary"
      >
        Follow
      </v-btn>
    </v-col>
    <v-col 
      class="d-flex justify-center px-0 py-1"
      cols="6"
      sm="4"
      md="4"
      lg="4"
      xl="4"
      xxl="4"    
    >
      <v-btn 
        flat
        @click="followers_dialog = !followers_dialog"
      >
        {{ profile.user_followers_count }} 
        {{ profile.user_followers_count === 1 ? 'Follower' : 'Followers' }}
      </v-btn>
    </v-col>
    <v-col 
      class="d-flex justify-center px-0 py-1"
      cols="6"
      sm="4"
      md="4"
      lg="4"
      xl="4"
      xxl="4"    
    >
      <v-btn 
        flat
        @click="following_dialog = !following_dialog"
      >
        Following {{ profile.user_following_count }}
      </v-btn>
    </v-col>
  </v-row>
  <v-dialog
      v-model="followers_dialog"
      :eager="true"
      max-width="300"
      min-width="250px"
      transition="dialog-bottom-transition"
    >
      <v-card
        height="500px"
        width="100%"
        rounded="lg"
      >
        <div class="ux-list">
          <div class="ux-list-item">
            <v-toolbar
              rounded
              color="surface"
            >
              <v-btn
                :ripple="false"
                variant="plain"
                prepend-icon="fa-solid fa-arrow-left"
                @click="followers_dialog = !followers_dialog"
              >
                Back to profile
              </v-btn>
            </v-toolbar>
          </div>
          <div class="ux-list-item">
            <pagnation
              v-if="followers_false"
              :loading="followers_loading"
              :size="25"
              :width="2"
              bottom="0px"
              @intersection-handler="followersHandler"
            >
              <v-list
                width="100%"
              >
                <profile-follows-list-item
                  v-for="(follower, index) in followers.followers"
                  :key="`profile-follows-followers-${index}`"
                  :follow="follower"
                  :user_same="profile.user_same"
                />
              </v-list>

            </pagnation>
            <ux-no-results-followers v-else />
          </div>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="following_dialog"
      :eager="true"
      max-width="300"
      min-width="250px"
      transition="dialog-bottom-transition"
    >
      <v-card
        height="500px"
        width="100%"
        rounded="lg"
      >
      <div class="ux-list">
          <div class="ux-list-item">
            <v-toolbar
              rounded
              color="surface"
            >
              <v-btn
                :ripple="false"
                variant="plain"
                prepend-icon="fa-solid fa-arrow-left"
                @click="following_dialog = !following_dialog"
              >
                Back to profile
              </v-btn>
            </v-toolbar>
          </div>
          <div class="ux-list-item">
            <pagnation
              v-if="following_false"
              :loading="following_loading"
              :size="25"
              :width="2"
              bottom="0px"
              @intersection-handler="followingHandler"
            >
              <v-list
                width="100%"
              >
                <profile-follows-list-item
                  v-for="(follower, index) in following.following"
                  :key="`profile-follows-following-${index}`"
                  :follow="follower"
                  :user_same="profile.user_same"
                />
              </v-list>
            </pagnation>
            <ux-no-results-following />
          </div>
        </div>
      </v-card>
    </v-dialog>
</template>

<style scoped>
  .ux-list .ux-list-item:nth-child(2) {
    height: calc(100% - 64px);
  }
</style>
