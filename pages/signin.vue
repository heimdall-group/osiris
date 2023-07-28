<script lang="ts">
  import { useStore } from '~/stores/main';
  useHead({
    title: 'SignInPage',
  });
  const store = useStore();
</script>

<template>
  <signin />
</template>
