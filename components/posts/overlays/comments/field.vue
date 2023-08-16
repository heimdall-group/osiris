<script setup lang="ts">
  import { usePostsStore } from '~/stores/posts';
  const props = defineProps({
    'post': {
      type: Object,
      required: true,
    }
  })
  const emits = defineEmits(['update:modelValue'])
  const postsStore = usePostsStore();

  const loading = ref(false);
  const comment = ref('');
  const validation = ref(false);

  const addComment = async (event: Event) => {
    event.preventDefault();
    if (!validation) {
      return 'Validation false'
    }
    loading.value = true;
    const result = await posts_commentPost(props.post.post_id, comment.value, props.post.comment_count)
    comment.value = '';
    loading.value = false;
  }
</script>

<template>
  <v-form @submit="addComment" v-model="validation" validate-on="lazy">
    <v-text-field
      v-model="comment"
      label="Comment"
      variant="solo"
      hide-details
      bg-color="surface-04"
      type="text"
    >
      <template v-slot:append-inner>
        <v-btn
          icon="fa-solid fa-arrow-right"
          variant="plain"
          rounded
          :loading="loading"
          @click="addComment"
        >
        </v-btn>
      </template>
    </v-text-field>
  </v-form>
</template>
