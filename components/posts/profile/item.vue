<script setup lang="ts">
  import { useViewsStore } from '~~/stores/view-state';
  const viewsStore = useViewsStore();
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
    dialog: {
      type: Boolean,
      required: false,  
    }
  })
</script>

<template>
  <v-col
    cols="6"
    sm="6"
    md="6"
    lg="4"
    xl="4"
    xxl="4"
  >
    <v-img :src="post.urls[0]"></v-img>
    {{ post.liked_by_current_user }} <br>
    {{ post.likes }} <br>
    {{ post.comments }} <br>
    {{ post.likes_count }} <br>
    {{ post.comments_count }} <br>
    {{ post.caption }} <br>
    {{ post.users_tagged }} <br>
    {{ post.created_at }} <br>
  </v-col>
</template>
