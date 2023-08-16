<script setup lang="ts">
  const props = defineProps({
    'post': {
      type: Object,
      required: true,
    }
  })
  const emits = defineEmits(['intersection-handler']);
</script>

<template>
  <pagnation
    :loading="post.comments.comments_loading"
    :size="40" 
    :width="2"
    bottom="0px"
    @intersection-handler="$emit('intersection-handler')"
  >
    <v-list>
      <posts-overlays-comments-list-item
        v-if="post.comments.comments.length !== 0 && post.comments.comments_false"
        v-for="(comment, index) in post.comments.comments"
        :key="`posts-overlays-comments-list-${index}`"
        :comment="comment"
      />
    </v-list>
  </pagnation>
</template>

<style scoped>
  .v-list {
    width: 100%;
  }
</style>
