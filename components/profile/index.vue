<script lang="ts" setup>
  import { useStore } from '~/stores/main';
  import { useViewsStore } from '~/stores/view-state';
  import { usePostsStore } from '~~/stores/posts';
  import { useProfileStore } from '~/stores/profile';
  import { Profile } from 'models/profile.model';

  const store = useStore();
  const viewsStore = useViewsStore();
  const postsStore = usePostsStore();
  const profileStore = useProfileStore();
  profileStore.resetProfile();
  postsStore.resetPosts();
  profileStore.resetFollowers();
  profileStore.resetFollowing();

  const user = computed(() => store.getUser);
  const state = computed(() => viewsStore.getState)
  const profile = computed(() => profileStore.getProfile)

  const route = useRoute();
  const router = useRouter();
  const handle = route.params.handle;
  const token = Object.keys(user.value).length === 0 ? undefined : await user.value.getIdToken();
  const { data, pending, error, refresh } = await useLazyAsyncData('profile', 
    () => $fetch(`/api/users/user/profile/${handle}`, {
      method: 'POST',
      body: {
        token: token,
      }
    })
  );

  watch(data, (newData) => {
    const data: any = newData;
    if (data !== null && data?.success) {
        profileStore.setProfile(data?.data as Profile)
    } else {
      console.warn(data?.error);
      router.push('/')
    }
  })

  onMounted(() => {
    if (Object.keys(profile.value).length === 0) {
      const result: any = data;
      if (result?.success) {
        profileStore.setProfile(result.data as Profile)
      } else if (result?.success === false) {
        const router = useRouter();
        router.push('/')
      }
    }
  })
</script>

<template>
    <loading-page v-if="pending" />
    <v-container v-if="Object.keys(profile).length !== 0" fluid>
      <v-row justify="center" class="ma-0 pa-0">
        <v-col
          cols="12"
          sm="12"
          md="10"
          lg="9"
          xl="6"
          xxl="6"
          class="pa-0"
        >
          <v-card
            rounded="lg"
            :class="state === 'xs' ? 'pa-4' : 'pa-6'"
            width="100%"
            flat
          >
            <v-card-text
              class="text-body-1 pa-0 text-center"
            > 
              {{ state }}
              {{ profile.user_handle }}
              <v-icon v-if="profile.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
              <overlay-3-dot-menu :profile_prop="profile" />
            </v-card-text>
            <v-row v-if="state === 'xs'" class="ma-0 pa-0" align="center">
              <v-col cols="auto">
                <v-avatar :image="profile.user_avatar" size="80px"></v-avatar>
              </v-col>
              <v-col>
                <profile-description-names />
              </v-col>
              <v-col cols="12" class="pa-0 pt-1">
                <profile-description />
              </v-col>
              <v-col cols="12" class="pa-0 pt-1">
                <profile-description-links />
              </v-col>
              <v-col cols="12" class="pb-0">
                <profile-follow-display />
              </v-col>
            </v-row>
            <v-row v-if="state === 'sm'" class="ma-0 pa-0" align="center">
              <v-col cols="auto">
                <v-avatar :image="profile.user_avatar" size="80px"></v-avatar>
              </v-col>
              <v-col>
                <profile-description-names />
                <profile-description />
                <profile-description-links />
              </v-col>
              <v-col cols="12" class="pa-0 pt-2">
                <profile-follow-display />
              </v-col>
            </v-row>
            <v-row v-if="state === 'md'" class="ma-0" align="center">
              <v-col cols="auto" class="py-0">
                <v-avatar :image="profile.user_avatar" size="160px"></v-avatar>
              </v-col>
              <v-col class="pb-0">
                <profile-follow-display />
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-row>
                  <v-col cols="8" class="py-0">
                    <profile-description-names />
                    <profile-description />
                  </v-col>
                  <v-col cols="8" class="py-0">
                    <profile-description-links />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-if="state === 'lg' || state === 'xl' || state === 'xxl'" class="ma-0" align="center">
              <v-col cols="auto" class="py-0">
                <v-avatar :image="profile.user_avatar" size="160px"></v-avatar>
              </v-col>
              <v-col class="pb-0">
                <profile-follow-display />
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-row>
                  <v-col cols="8" class="py-0">
                    <profile-description-names />
                    <profile-description />
                  </v-col>
                  <v-col cols="8" class="py-0">
                    <profile-description-links />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
          <v-card
            rounded="lg"
            class="my-2"
            width="100%"
            variant="outlined"
            color="surface"
            flat
          >
            <v-row class="ma-0">
              <v-col cols="6" class="d-flex justify-center">
                <v-btn
                  flat
                  variant="text"
                  color="white"
                >
                  {{ profile.user_posts_count }}
                  Posts
                </v-btn>
              </v-col>
              <v-col cols="6" class="d-flex justify-center">
                <v-btn
                  flat
                  variant="text"
                  color="white"
                >
                  {{ profile.user_programs_count }}
                  Programs
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
          <profile-posts />
        </v-col>
      </v-row>
    </v-container>
</template>
