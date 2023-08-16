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
  <v-col
    cols="6"
    sm="6"
    md="6"
    lg="4"
    xl="4"
    xxl="4"
  >
    <v-card-text>
      {{ post.post_id }}<br>
      {{ post.caption }}<br>
      {{ post.users_tagged }}<br>
      {{ post.created_at }}<br>
    </v-card-text>
    <v-btn @click="publishHandler" :loading="loading">Publish</v-btn>
  </v-col>
</template>