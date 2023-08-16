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

  const dialog = ref(false);
  const user = computed(() => store.getUser)
  const user_db = computed(() => store.getUser_db)
  const profile_edit = computed(() => profileStore.getProfile_edit)
  const state = computed(() => viewsStore.getState)
  postsStore.resetUnpublishedPosts();

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
      if (result?.success) {
        profileStore.setProfileEdit(result.data as Profile_Edit);
      } else if (result?.success === false) {
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
          {{ state }}
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
        <v-dialog
          v-model="dialog"
          width="auto"
          transition="dialog-bottom-transition"
          :persistent="true"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              prepend-icon="fa-solid fa-arrow-left"
              @click="dialog = !dialog"
            >
              Back to profile
            </v-btn>
          </template>
          <v-card
            class="pa-3"
          >
            <v-card-title class="text-center">
              Your about to leave this page
            </v-card-title>
            <v-card-text class="text-center">
              Any unsaved changes will be discarded
            </v-card-text>
            <v-row class="ma-0 mt-3" justify="space-around">
              <v-btn
                @click="dialog = !dialog"
                color="error"
                variant="outlined"
              >
                Cancel
              </v-btn>
              <v-btn
                :to="`/profile/${user_db.user_handle}`"
                @click="dialog = !dialog"
                color="success"
                variant="outlined"
              >
                Continue
              </v-btn>              
            </v-row>
          </v-card>
        </v-dialog>
      </v-app-bar>
    </v-container>
  
</template>

<style scoped>
  .v-row {
    margin: -16px -16px 8px -16px;
  }
</style>
