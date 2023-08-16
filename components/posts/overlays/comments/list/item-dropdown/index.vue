<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { usePostsStore } from '~/stores/posts';
  import { Return_Posts_Replies } from 'models/return.model';
  import { Comment } from 'models/post.model';

  const props = defineProps({
    comment: {
      type: Object,
      required: true,
    }
  });

  const store = useStore();
  const postsStore = usePostsStore();

  const user = computed(() => store.getUser);

  const loading = ref(false);
  const reply = ref('');

  const addReply = async (event: Event) => {
    event.preventDefault();
    loading.value = true;
    const result = await posts_replyComment(props.comment.post_id, props.comment.comment_id, reply.value, props.comment.reply_count)
    reply.value = '';
    loading.value = false;
  }

  const repliesHandler = async () => {
    try {
      if (!props.comment.replies.replies_loading) {
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
      const result:Return_Posts_Replies = await $fetch(`/api/users/user/post/comments/replies/${props.comment.comment_id}`, {
        method: 'POST',
        body: {
          token: token,
          limit: 15,
          skip: props.comment.replies.skip_amount,
        },
      })

      if (result === undefined) {
        throw 'Result is undefined';
      }

      if (result.success) {
        postsStore.pushReplies(result, props.comment.post_id, props.comment.comment_id, props.comment.reply_count)
      } else {
        throw {
          message: 'Comments replies fetch failed',
          code: 'profile/comments-replies-fetch-failed',
          severity: 3,
          type: 'server',
          server_error: result.error
        }
      }
    } catch(error: any) {
      handle_error(error)
    }
  }

  onMounted(() => {
    repliesHandler();
  })
</script>

<template>
  <v-list-item class="pr-0">
    <pagnation-comments
      v-if="comment.replies.replies_false"
      v-model="comment.replies.replies_loading"
      button_text="Load more replies"
      @click="repliesHandler"
    >
      <v-list v-if="comment.replies.replies.length !== 0 && comment.replies.replies_false">
        <posts-overlays-comments-list-item-dropdown-item
          v-for="(reply, index) in comment.replies.replies"
          :key="`posts-overlays-comments-list-item-dropdown-${index}`"
          :reply="reply"
        >
        </posts-overlays-comments-list-item-dropdown-item>
      </v-list>
    </pagnation-comments>
    <ux-no-results-replies v-else />
    <v-form @submit="addReply" class="px-2">
      <v-text-field
        v-model="reply"
        label="Reply"
        variant="solo"
        hide-details
        bg-color="surface-04"
        type="text"
      >
        <template v-slot:append-inner>
          <v-btn
            icon="fa-solid fa-arrow-turn-up"
            variant="plain"
            rounded
            :loading="loading"
            @click="addReply"
          >
          </v-btn>
        </template>
      </v-text-field>
    </v-form>
  </v-list-item>
</template>

<style scoped>
  .v-list {
    width: 100%;
  }
</style>