<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { usePostsStore } from '~/stores/posts';
  import { useViewsStore } from '~/stores/view-state';
  import { Return_Posts_Comments } from 'models/return.model';
  import { Post } from 'models/post.model';

  const button_loading = ref(false);

  const props = defineProps({
    'modelValue': {
      type: Boolean,
      required: true,
    },
    'post': {
      type: Object,
      required: true,
    }
  });
  const emits = defineEmits(['update:modelValue'])

  const store = useStore();
  const postsStore = usePostsStore();
  const viewsStore = useViewsStore();

  const user = computed(() => store.getUser);
  const state = computed(() => viewsStore.getState)
  const comment_section = computed({
    get() {return props.modelValue},
    set(value) {emits('update:modelValue', value)},
  })

  const commentsHandler = async () => {
    try {
      if (!props.post.comments.comments_loading) {
        throw {
          message: 'Max count reached',
          code: 'post/comments-max-count-reached',
          severity: 4,
          type: 'client',
        }
      }

      const token = Object.keys(user.value).length === 0 ?
        undefined:
        await user.value.getIdToken();
      const result:Return_Posts_Comments = await $fetch(`/api/users/user/post/comments/${props.post.post_id}`, {
        method: 'POST',
        body: {
          token: token,
          limit: 15,
          skip: props.post.comments.skip_amount,
        },
      });

      if (result === undefined) {
        throw 'Result is undefined';
      }

      if (result.success) {
        postsStore.pushComments(result, props.post.post_id, props.post.comments_count)
      } else {
        throw {
          message: 'Post comments fetch failed',
          code: 'profile/post-comments-fetch-failed',
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
  <v-dialog
    v-model="comment_section"
    transition="dialog-bottom-transition"
    min-width="300px"
    max-width="500px"
  >
    <v-card
      rounded="lg"
      height="600px"
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
            @click="comment_section = !comment_section"
          >
            Back to feed
          </v-btn>
        </v-toolbar>
      </div>
      <div class="ux-list-item">
        <posts-overlays-comments-list v-if="post.comments.comments_false" :post="post" @intersection-handler="commentsHandler" />
        <ux-no-results-comments v-else />
      </div>
      <div class="ux-list-item">
        <posts-overlays-comments-field :post="post" />
      </div>
    </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .ux-list .ux-list-item:nth-child(2) {
    height: calc(100% - 56px - 64px);
  }
</style>
