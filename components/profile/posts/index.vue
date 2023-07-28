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
  const posts = computed(() => postsStore.getPosts)
  const posts_loading = computed(() => postsStore.getPosts_loading)
  const posts_false = computed(() => postsStore.getPosts_false)

  const postsHandler = async () => {
      try {
        if (!posts_loading) {
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
            skip: posts.value.skip_amount,
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
  <v-container fluid>
    <pagnation
      :loading="posts_loading"
      :size="40" 
      :width="2"
      bottom="0px"
      @intersection-handler="postsHandler"
    >
      <v-row>
        <v-col
          cols="6"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          xxl="6"
        >
          <v-row>
            <profile-posts-item 
              v-for="(post, index) in posts.posts"
              :key="index"
              :post="post"
            />
          </v-row>
        </v-col>
      </v-row>
    </pagnation>
    <v-dialog>

    </v-dialog>
  </v-container>
</template>
