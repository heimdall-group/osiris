<script setup lang="ts">
  import { useStore } from '~/stores/main';
  useHead({
    title: 'SignUpPage',
  });
  const store = useStore();
</script>

<template>
  <signup />
</template>
