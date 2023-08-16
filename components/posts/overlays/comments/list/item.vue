<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';

  const viewsStore = useViewsStore();
  const props = defineProps({
    'comment': {
      type: Object,
      required: true,
    }
  });

  const state = computed(() => viewsStore.getState)
  const loading = ref(false);
  const replies_section = ref(false);

  const removeComment = async () => {
    loading.value = true;
    const result = await posts_unCommentPost(props.comment.post_id, props.comment.comment_id)
    loading.value = false;
  };

  const handleLikedComment = async () => {
    if (!props.comment.liked_by_current_user) {
      const result = await posts_likeComment(props.comment.comment_id)
      if (result.success) {
        props.comment.liked_by_current_user = true
        props.comment.likes_count++
      }
    } else {
      const result = await posts_unlikeComment(props.comment.comment_id)
      if (result.success) {
        props.comment.liked_by_current_user = false
        props.comment.likes_count--
      }
    }
  }
</script>

<template>
  <v-list-item
    :prepend-avatar="comment.user.user_avatar"
  > 
    <v-row class="ma-0">
      <v-col class="py-0 px-2">
          <v-row class="ma-0" justify="space-between" align="center">
            <v-col class="pa-0">
              <v-list-item-title>
                <nuxt-link
                  :to="`/profile/${comment.user.user_handle}`"
                >
                  {{ comment.user.user_handle }}
                  <v-icon v-if="comment.user.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
                </nuxt-link>
              </v-list-item-title>
              {{ comment.text }}
            </v-col>
            <v-col cols="auto" class="pa-0">
              <v-list-item-subtitle>
                <font-awesome-icon 
                  class="cursor-pointer mx-1"
                  icon="fa-regular fa-comment"
                />
                <font-awesome-icon 
                  class="cursor-pointer mx-1"
                  @click="handleLikedComment"
                  :icon="comment.liked_by_current_user ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
                />
              </v-list-item-subtitle>       
            </v-col>
          </v-row>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-row class=ma-0 align="center">
          <v-col cols="auto" class="py-0">
            <v-list-item-subtitle>
              {{ comment.likes_count }} {{ comment.likes_count === 1 ? 'Like' : 'Likes'}}
            </v-list-item-subtitle>
          </v-col>
          <v-col v-if="replies_section" cols="auto" class="py-0">
            <v-list-item-subtitle
              class="cursor-pointer"
              @click="replies_section = !replies_section"
            > 
              Close replies
            </v-list-item-subtitle>
          </v-col>
          <v-col v-else-if="comment.reply_count > 0" cols="auto" class="py-0">
            <v-list-item-subtitle
              class="cursor-pointer"
              @click="replies_section = !replies_section"
            > 
              {{ comment.reply_count > 0 ? 'View replies' : ''}}
            </v-list-item-subtitle>
          </v-col>
          <v-col v-else cols="auto" class="py-0">
            <v-list-item-subtitle
              class="cursor-pointer"
              @click="replies_section = !replies_section"
            >
              Reply
            </v-list-item-subtitle>
          </v-col>
          <v-col class="d-flex justify-end pa-0">
            <overlay-3-dot-menu 
              :identifier="comment.comment_id"
            >
              <v-list-item
                v-if="comment.comment_by_current_user"
                class="pa-0"
              >
                <overlay-dialogs-confirmation 
                  text="Remove Comment"
                  :loading="loading"
                  color="error"
                  @click="removeComment"
                />
              </v-list-item>
            </overlay-3-dot-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row> 
  </v-list-item>
  <posts-overlays-comments-list-item-dropdown v-if="replies_section" :comment="comment" />
</template>

<style scoped>
  .svg-inline--fa {
    font-size: 1.25rem;
  }
</style>
