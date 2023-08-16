<script setup lang="ts">
  import { useStore } from '~~/stores/main';
  import { useViewsStore } from '~~/stores/view-state';
  import { usePostsStore } from '~~/stores/posts';
  import { useProfileStore } from '~~/stores/profile';
  import { Return_Unpublished_Posts } from 'models/return.model';
  
  const store = useStore();
  const viewsStore = useViewsStore();
  const postsStore = usePostsStore();
  const profileStore = useProfileStore();

  const state = computed(() => viewsStore.getState)
  const profile_edit = computed(() => profileStore.getProfile_edit)
  const user = computed(() => store.getUser)
  const unpublished_posts = computed(() => postsStore.getUnpublished_Posts)
  const unpublished_posts_loading = computed(() => postsStore.getUnpublished_Posts_loading)
  const unpublished_posts_false = computed(() => postsStore.getUnpublished_Posts_false)

  const unpublishedPostsHandler = async () => {
    try {
      if (!unpublished_posts_loading.value) {
        throw {
          message: 'Max count reached',
          code: 'profile/unpublished-posts-max-count-reached',
          severity: 4,
          type: 'client',
        }
      }

      const limit = 15
      const token = Object.keys(user.value).length === 0 ?
        undefined :
        await user.value.getIdToken();
      const result:Return_Unpublished_Posts = await $fetch(`/api/users/user/profile/posts/unpublished/`, {
        method: 'POST',
        body: {
          limit: limit,
          skip: unpublished_posts.value.skip_amount,
          token: token,
        }
      });

      if (result === undefined) {
        throw 'Result is undefined';
      }

      if (result.success) {
        postsStore.pushUnpublishedPosts(result, profile_edit.value.user_unpublished_posts_count)
      } else {
        throw {
          message: 'Unpublished posts fetch failed',
          code: 'profile/unpublished-posts-fetch-failed',
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
  <v-container fluid>
    <pagnation
      :loading="unpublished_posts_loading"
      :size="40" 
      :width="2"
      bottom="0px"
      @intersection-handler="unpublishedPostsHandler"
    >
      <v-row>
        <profile-edit-unpublished-posts-item 
          v-for="(post, index) in unpublished_posts.posts"
          :key="`profile-edit-unpublished-posts-${index}`"
          :post="post"
        />
      </v-row>
    </pagnation>
  </v-container>
</template>
