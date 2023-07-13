<template>
  <v-toolbar
    color="transparent"
  ></v-toolbar>
  <v-app-bar
    rounded="lg"
    class="navigation-bar"
  >
    <v-app-bar-nav-icon @click="drawer = !drawer" icon="mdi: mdi-menu"></v-app-bar-nav-icon>
    <v-app-bar-title>Osiris</v-app-bar-title>
    <v-row class="ma-0" justify="end">
      <v-col cols="auto" class="pa-0 d-flex align-center">
        <navigation-search />
      </v-col>
      <v-col cols="auto" class="pa-0">
        <v-row class="ma-0" v-if="state !== 'xs' && state !== 'sm'">
          <v-col class="ma-0" v-if="Object.keys(user).length === 0">
            <v-btn flat rounded="lg" class="mx-1" to="/">Home</v-btn>
            <v-btn flat rounded="lg" class="mx-1" to="/signin">Sign in</v-btn>
            <v-btn flat rounded="lg" class="mx-1" to="/signup">Sign up</v-btn>
          </v-col>
          <v-col class="ma-0" v-else>
            <v-btn flat rounded="lg" class="mx-1" to="/">Your Feed</v-btn>
            <v-btn flat rounded="lg" class="mx-1" :to="`/profile/${user_db.user_handle}`">Your Profile</v-btn>
            <v-btn flat rounded="lg" class="mx-1" @click="firebase_destroyAuth">Sign out</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    :disable-resize-watcher="true"
    color="background"
    rounded="lg"
  >
    <v-list v-if="(state === 'xs' || state === 'sm') && Object.keys(user).length === 0">
      <v-list-item><v-btn flat block rounded="lg" to="/">Home</v-btn></v-list-item>
      <v-list-item><v-btn flat block rounded="lg" to="/signin">Sign in</v-btn></v-list-item>
      <v-list-item><v-btn flat block rounded="lg" to="/signup">Sign up</v-btn></v-list-item>
    </v-list>
    <v-list v-if="(state === 'xs' || state === 'sm') && Object.keys(user).length !== 0">
      <v-list-item><v-btn flat block rounded="lg" to="/">Your Feed</v-btn></v-list-item>
      <v-list-item><v-btn flat block rounded="lg" :to="`/profile/${user_db.user_handle}`">Your Profile</v-btn></v-list-item>
      <v-list-item><v-btn flat block rounded="lg" @click="firebase_destroyAuth">Sign out</v-btn></v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list>
      <v-list-item><v-btn variant="plain" block rounded="lg" to="">Social link 1</v-btn></v-list-item>
      <v-list-item><v-btn variant="plain" block rounded="lg" to="">Social link 1</v-btn></v-list-item>
      <v-list-item><v-btn variant="plain" block rounded="lg" to="">Privacy Policy</v-btn></v-list-item>
    </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style >
.navigation-bar .fa-user-plus,
.navigation-bar .fa-right-from-bracket,
.navigation-bar .fa-house,
.navigation-bar .fa-user {
  font-size: 20px;
}

.navigation-bar .fa-house {
  margin: -2px -2px 0 0;
}

.navigation-bar .fa-house {
  margin: -3px 0 0 -3px;
}

.navigation-bar .fa-right-from-bracket {
  margin: 0 0 0 0;
}

</style>

<script lang="ts">
import { useStore } from '~/stores/main';
import { useViewsStore } from '~/stores/view-state';

export default {
  async setup() {
    const store = useStore();
    const viewsStore = useViewsStore();
    return {
      store,
      viewsStore
    };
  },
  name: 'headerComponent',
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    user_db() {
      return this.store.getUser_db;
    },
    user() {
      return this.store.getUser;
    },
    state() {
      return this.viewsStore.getState;
    }
  },
  methods: {},
  mounted() {},
  updated() {},
  components: {},
  emits: [],
};
</script>