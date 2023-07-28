<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { useViewsStore } from '~/stores/view-state';
  import { useProfileStore } from '~/stores/profile';
  import { usePostsStore } from '~/stores/posts';
  import { Profile_Edit } from 'models/profile.model';

  const store = useStore();
  const viewsStore = useViewsStore();
  const profileStore = useProfileStore();
  const postsStore = usePostsStore();
  const router = useRouter();
  const route = useRoute();
  const handle = route.params.handle;

  const user = computed(() => store.getUser)
  const user_db = computed(() => store.getUser_db)
  const profile_edit = computed(() => profileStore.getProfile_edit)
  const posts = computed(() => postsStore.getPosts)

  if (Object.keys(user.value).length === 0) {
    router.push(`/profile/${handle}`);
  };

  const token = await user.value.getIdToken();
  const { data, pending, error, refresh } = await useLazyAsyncData('profile', 
    () => $fetch(`/api/users/user/profile/edit/${handle}`, {
      method: 'POST',
      body: {
        token: token,
      }
    })
  );

  watch(data, (newData) => {
    const data: any = newData;
    if (data?.success) {
      profileStore.setProfileEdit(data.data)
    } else if (data?.success === false) {
      console.log('Push from watch');
      router.push(`/profile/${handle}`)
      handle_error({
        message: 'Fetch failed',
        code: 'edit-profile/fetch-failed',
        severity: 4,
        type: 'server',
        server_error: data.error,
      })
    }
  })

  onMounted(() => {
    if (Object.keys(profile_edit.value).length === 0) {
      const result: any = data;
      console.log(data)
      if (result?.success) {
        profileStore.setProfileEdit(result.data as Profile_Edit);
      } else if (result?.success === false) {
        console.log('Push from mount');
        router.push(`/profile/${handle}`)
        handle_error({
          message: 'Fetch failed',
          code: 'edit-profile/fetch-failed',
          severity: 4,
          type: 'server',
          server_error: result.error,
        })
      }
    }
  });
</script>

<template>
    <v-container fluid v-if="Object.keys(profile_edit).length !== 0">
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
          <v-row class="ma-0">
            <profile-edit-info />
            <profile-edit-unpublished-posts />
          </v-row>
        </v-col>
      </v-row>
      <v-app-bar
        location="bottom"
        rounded="lg"
      >
        <v-btn
          :to="`/profile/${user_db.user_handle}`"
          prepend-icon="fa-solid fa-arrow-left"
        >
          Back to profile
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          variant="outlined"
        >
          Save
        </v-btn>
      </v-app-bar>
    </v-container>
  
</template>

<style scoped>
  .v-row {
    margin: -16px -16px 8px -16px;
  }
</style>
