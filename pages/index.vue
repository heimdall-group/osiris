<template>
  <v-container>
    <v-row class="ma-0 pa-5" justify="center" align="center">
      <v-btn @click="loadingHandler">Global Load for 5 sec</v-btn>
      <v-btn @click="alertHandler">Fake alert</v-btn>
      <v-btn @click="firebase_destroyAuth">Sign out</v-btn>
      <v-btn @click="listHandler">Get List</v-btn>
      <v-btn @click="accountHandler">Create account</v-btn>
      <v-btn @click="updateUserHandler">Update users</v-btn>
    </v-row>
    <v-row class="ma-0" justify="center">
      <v-col class="testing-v-col">
        <v-btn @click="inputHandler">Submit</v-btn>
        <v-btn @click="clickHandler">Get</v-btn>
      </v-col>
    </v-row>
    <pagnation
      :loading="loading"
      :size="40"
      :width="2"
      :bottom="'200px'"
      @intersection-handler="intersectionHandler"
    >
      <posts
        v-for="(post, index) in pagnation_count" 
        :key="index"
        cols="12"
        :post="post"
      />
    </pagnation>
  </v-container>
</template>

<style scoped>
.testing-v-col {
  max-width: 400px;
}
</style>

<script lang="ts">
import { Post } from 'models/post.model';
import { ObjectId } from 'mongoose';
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
      account_count: 0,
      input: '',
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
    inputHandler() {
      $fetch('/api/development/test', {method: 'POST', body: {input: this.input}})
    },
    clickHandler() {
      $fetch('/api/development/get', {method: 'POST'})
    },
    listHandler() {
      $fetch('/api/posts/compression/list-info')
    },
    accountHandler() {
      firebase_password_createUser(
        'test user',
        `test${this.account_count}@gmail.com`,
        '1234567',
        `test_account_${this.account_count}`
      );
      this.account_count++
    },
    updateUserHandler() {
      $fetch('/api/development/updateUsers');
    },
    intersectionHandler() {
      console.log('New insertion')
      this.loading = true
      setTimeout(() => {
        if (this.pagnation_count.length === 50) {
          this.loading = false
        } else {
          const test = {
            "_id": "64a32e0639d40c8fd4564a55",
            "post_id": "64c2bb7c8433ee38e1ab8bc0",
            "user": {
              "verified": true,
              "handle": "felixrydberg",
              "avatar_url": "https://lh3.googleusercontent.com/a/AAcHTtd38EzKFJ_tFxd5bcxRUpk1QU65zk1XccDzob1towMl=s96-c"
            },
            "liked_by_current_user": false,
            "urls": [
              "https://s3.eu-central-2.wasabisys.com/heimdall-osiris/users/posts/1690483579739_-1628798076_100-0.webp"
            ],
            "likes_total": 0,
            "comments_total": 0,
            "caption": "Composition Api working??",
            "created_at": 1690483580990,
            "likes": {
              "likes": [],
              "skip_amount": 0
            },
            "comments": {
              "comments": [],
              "skip_amount": 0
            }
          }
          this.pagnation_count.push(test, test, test, test, test)
        }
      }, 1000)
    }
  },
  mounted() {},
  updated() {},
  components: {},
};
</script>