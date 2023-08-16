<script setup lang="ts">

  const props = defineProps({
    'reply': {
      type: Object,
      required: true,
    }
  })

  const loading = ref(false);

  const removeReply = async () => {
    loading.value = true;
    const result = await posts_unReplyComment(props.reply.post_id, props.reply.comment_id, props.reply.reply_id);
    loading.value = false;
  }

  const handleLikedReply = async () => {
    if (!props.reply.liked_by_current_user) {
      const result = await posts_likeReply(props.reply.reply_id)
      if (result.success) {
        props.reply.liked_by_current_user = true
        props.reply.likes_count++
      }
    } else {
      const result = await posts_unlikeReply(props.reply.reply_id)
      if (result.success) {
        props.reply.liked_by_current_user = false
        props.reply.likes_count--
      }
    }
  }
</script>

<template>
  <v-list-item
    :prepend-avatar="reply.user.user_avatar"
    class="pl-8"
  >
    <v-row class="ma-0">
      <v-col class="py-0 px-2">
          <v-row class="ma-0" justify="space-between" align="center">
            <v-col class="pa-0">
              <v-list-item-title>
                <nuxt-link
                  :to="`/profile/${reply.user.user_handle}`"
                >
                  {{ reply.user.user_handle }}
                  <v-icon v-if="reply.user.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
                </nuxt-link>
              </v-list-item-title>
              {{ reply.text }}
            </v-col>
            <v-col cols="auto" class="pa-0">
              <v-list-item-subtitle>
                <font-awesome-icon 
                  class="cursor-pointer mx-1"
                  @click="handleLikedReply"
                  :icon="reply.liked_by_current_user ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
                />
              </v-list-item-subtitle>       
            </v-col>
          </v-row>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-row class=ma-0 align="center">
          <v-col cols="auto" class="py-0">
            <v-list-item-subtitle>
              {{ reply.likes_count }} {{ reply.likes_count === 1 ? 'Like' : 'Likes'}}
            </v-list-item-subtitle>
          </v-col>
          <v-col class="d-flex justify-end pa-0">
            <overlay-3-dot-menu 
              :identifier="reply.reply_id"
            >
              <v-list-item
                v-if="reply.reply_by_current_user"
                class="pa-0"
              >
              <overlay-dialogs-confirmation 
                  text="Remove Reply"
                  :loading="loading"
                  color="error"
                  @click="removeReply"
                />
              </v-list-item>
            </overlay-3-dot-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row> 
  </v-list-item>
</template>

<style scoped>
  .svg-inline--fa {
    font-size: 1.25rem;
  }
</style>
