<template>
  <v-container>
    <v-row class="ma-0 pa-5" justify="center" align="center">
      <v-btn @click="loadingHandler">Global Load for 5 sec</v-btn>
      <v-btn @click="alertHandler">Fake alert</v-btn>
      <v-btn @click="firebase_destroyAuth">Sign out</v-btn>
      <v-btn @click="updateUserHandler">Update users</v-btn>
    </v-row>
  </v-container>
</template>

<style scoped>
.testing-v-col {
  max-width: 400px;
}
</style>

<script lang="ts">
import { Post } from 'models/post.model';
import { useStore } from '~/stores/main';
import { useViewsStore } from '~/stores/view-state';
export default {
  setup() {
    useHead({
      title: 'Sign in',
    });
    const store = useStore();
    const viewsStore = useViewsStore();
    return {
      store,
      viewsStore
    };
  },
  name: '',
  data() {
    return {
      alert_count: 0,
      input: '',
      list_open: false,
      pagnation_count: [] as Array<Post>,
      loading: false,
    };
  },
  computed: {
    state() {
      return this.viewsStore.getState;
    }
  },
  methods: {
    loadingHandler() {
      this.store.setGlobalLoading(true);
      setTimeout(() => {
        this.store.setGlobalLoading(false);
      }, 5000)
    },
    alertHandler() {
      this.store.setAlert({
        type: 'warning',
        icon: 'fa-solid fa-circle-info',
        message: `Fake alert Fake alert ${this.alert_count}`,
      });
      this.alert_count++
    },
    updateUserHandler() {
      $fetch('/api/development/updateUsers');
    },
  },
  mounted() {},
  updated() {},
  components: {},
};
</script>