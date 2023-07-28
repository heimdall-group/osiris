<template>
  <v-btn
    flat
    :size="state === 'xs' ? 'small' : 'default'"
    variant="outlined"
    :loading="loading"
    @click="clickHandler"
    class="remove-follow-button"
    title="Stop following this user"
  >
    Remove
  </v-btn>
</template>

<script lang="ts">
  import { useViewsStore } from '~/stores/view-state';
  export default {
  setup() {
    const viewsStore = useViewsStore();
    return {
      viewsStore
    }
  },
  name: 'profileButtonSubRemoveComponent',
  data() {
    return {
      loading: false,
    };
  },
  props: {
    callback: {
      type: Function,
      required: true,
    }
  },
  computed: {
    state() {
      return this.viewsStore.getState;
    },
  },
  methods: {
    async clickHandler() {
      this.loading = true
      const result = await this.callback();
      this.loading = false
    },
  },
  mounted() {
  },
  updated() {},
  components: {},
  };
</script>