<script lang="ts" setup>
  import { useStore } from '~~/stores/main';
  import { useViewsStore } from '~~/stores/view-state';
  import { usePostsStore } from '~~/stores/posts';
  import { useProfileStore } from '~~/stores/profile';
  import { Return_Posts } from 'models/return.model';

  const store = useStore();
  const viewsStore = useViewsStore();
  const postsStore = usePostsStore();
  const profileStore = useProfileStore();

  const state = computed(() => viewsStore.getState)
  const user = computed(() => store.getUser)
  const profile = computed(() => profileStore.getProfile)
  const profile_posts = computed(() => postsStore.getPosts)
  const profile_posts_loading = computed(() => postsStore.getPosts_loading)
  const profile_posts_false = computed(() => postsStore.getPosts_false)

  const postsHandler = async () => {
      try {
        if (!profile_posts_false) {
          throw {
            message: 'Max count reached',
            code: 'profile/posts-max-count-reached',
            severity: 4,
            type: 'client',
          }
        }

        const route = useRoute();
        const handle = route.params.handle;
        const token = Object.keys(user.value).length === 0 ?
          undefined :
          await user.value.getIdToken();
        const result:Return_Posts = await $fetch(`/api/users/user/profile/posts/${handle}`, {
          method: 'POST',
          body: {
            limit: 15,
            skip: profile_posts.value.skip_amount,
            token: token,
          }
        });

        if (result === undefined) {
          throw 'Result is undefined';
        }

        if (result.success) {
          postsStore.pushPosts(result, profile.value.user_posts_count)
        } else {
          throw {
            message: 'Posts fetch failed',
            code: 'profile/posts-fetch-failed',
            severity: 3,
            type: 'server',
            server_error: result.error
          }
        }
      } catch(error: any) {
        handle_error(error)
      }
    }
</script>

<template>
    <pagnation
      v-if="profile_posts_false"
      :loading="profile_posts_loading"
      :size="40"
      :width="2"
      :bottom="'0px'"
      @intersection-handler="postsHandler"
    >
      <posts
        v-if="profile_posts.posts.length !== 0 && profile_posts_false"
        v-for="(post, index) in profile_posts.posts" 
        :key="`index-${index}`"
        cols="12"
        :post="post"
      >{{ post }}</posts>
    </pagnation>
    <ux-no-results-posts v-else />
    <v-dialog>

    </v-dialog>
</template>
