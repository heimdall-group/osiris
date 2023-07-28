<script setup lang="ts">
  import { Post_Unpublished } from 'models/post.model';
  import { useViewsStore } from '~~/stores/view-state';
  const viewsStore = useViewsStore();

  const loading = ref(false);
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  })
  const publishHandler = async () => {
      loading.value = true;
      await posts_publishPost(props.post as Post_Unpublished);
      loading.value = false;
    }
</script>

<template>
  <v-card-text>
    {{ post.post_id }}<br>
    {{ post.urls }}<br>
    {{ post.caption }}<br>
    {{ post.users_tagged }}<br>
    {{ post.created_at }}<br>
  </v-card-text>
  <v-btn @click="publishHandler" :loading="loading">Publish</v-btn>
</template>