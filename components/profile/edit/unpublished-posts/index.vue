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
        <v-col
          cols="6"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          xxl="6"
        >
          <v-row>
            <profile-edit-unpublished-posts-item 
              v-for="(post, index) in unpublished_posts.posts"
              :key="index"
              :post="post"
            />
          </v-row>
        </v-col>
      </v-row>
    </pagnation>
  </v-container>
</template>

<script lang="ts">
  import { useStore } from '~~/stores/main';
  import { useViewsStore } from '~~/stores/view-state';
  import { usePostsStore } from '~~/stores/posts';
  import { useProfileStore } from '~~/stores/profile';
  import { Return_Unpublished_Posts } from 'models/return.model';
  export default {
  async setup() {
    const store = useStore();
    const viewsStore = useViewsStore();
    const postsStore = usePostsStore();
    const profileStore = useProfileStore();
    return {
      store,
      viewsStore,
      postsStore,
      profileStore,
    };
  },
  name: 'profileEditUnpublishedPostsComponent',
  data() {
    return {};
  },
  computed: {
    state() {
      return this.viewsStore.getState;
    },
    user() {
      return this.store.getUser;
    },
    unpublished_posts() {
      return this.postsStore.getUnpublished_Posts;
    },
    unpublished_posts_loading() {
      return this.postsStore.getUnpublished_Posts_loading;
    },
    unpublished_posts_false() {
      return this.postsStore.getUnpublished_Posts_false;
    },
  },
  methods: {
    async unpublishedPostsHandler() {
      try {
        if (!this.unpublished_posts_loading) {
          throw {
            message: 'Max count reached',
            code: 'profile/posts-max-count-reached',
            severity: 4,
            type: 'client',
          }
        }

        const limit = 15
        const user = this.user;
        const token = Object.keys(user).length === 0 ?
          undefined :
          await user.getIdToken();
        const result:Return_Unpublished_Posts = await $fetch(`/api/users/user/profile/posts/unpublished/`, {
          method: 'POST',
          body: {
            limit: limit,
            skip: this.unpublished_posts.skip_amount,
            token: token,
          }
        });

        if (result === undefined) {
          throw 'Result is undefined';
        }

        if (result.success) {
          this.postsStore.pushUnpublishedPosts(result, limit)
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
    }
  },
  mounted() {},
  updated() {},
  components: {},
  emits: [],
  };
</script>