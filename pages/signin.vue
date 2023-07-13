<template>
  <signin />
</template>

<style scoped>
</style>

<script lang="ts">
import { useStore } from '~/stores/main';
export default {
  setup() {
    useHead({
      title: 'SignInPage',
    });
    const store = useStore();
    return {
      store,
    };
  },
  name: '',
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {},
  updated() {},
  components: {},
};
</script>