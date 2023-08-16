<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { usePostsStore } from '~~/stores/posts';
  import { Return_Posts_Likes } from 'models/return.model';
  import { Post } from 'models/post.model';

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
  const like_section = computed({
    get() {return props.modelValue},
    set(value) {emits('update:modelValue', value)},
  })

  const user = computed(() => store.getUser);

  const likesHandler = async () => {
    try {
      if (!props.post.likes.likes_loading) {
        throw {
          message: 'Max count reached',
          code: 'post/likes-max-count-reached',
          severity: 4,
          type: 'client',
        }
      }

      const result:Return_Posts_Likes = await $fetch(`/api/users/user/post/likes/${props.post.post_id}`, {
        method: 'POST',
        body: {
          limit: 10,
          skip: props.post.likes.skip_amount,
        },
      });

      if (result === undefined) {
        throw 'Result is undefined';
      }

      if (result.success) {
        postsStore.pushLikes(result, props.post.post_id, props.post.likes_count)
      } else {
        throw {
          message: 'Post likes fetch failed',
          code: 'profile/post-likes-fetch-failed',
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
  v-model="like_section"
  transition="dialog-bottom-transition"
  width="300px"
>
  <v-card
    rounded="lg"
    height="500px"
    width="100%"
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
            @click="like_section = !like_section"
          >
            Back to feed
          </v-btn>
        </v-toolbar>
      </div>
      <div class="ux-list-item">
        <pagnation
          v-if="post.likes.likes_false"
          :loading="post.likes.likes_loading"
          :size="40" 
          :width="2"
          bottom="0px"
          @intersection-handler="likesHandler"
        >
          <v-list
            v-if="post.likes.likes.length !== 0 && post.likes.likes_false"
          >
            <posts-overlays-likes-list-item
              v-for="(like, index) in post.likes.likes"
              :key="`posts-overlays-likes-list-item-${index}`"
              :like="like"
            />
          </v-list>
        </pagnation>
        <ux-no-results-likes v-else />
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
