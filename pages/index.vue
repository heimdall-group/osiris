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
        <post-upload />
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
      <post 
        v-for="(post, index) in pagnation_count" 
        :key="index"
        cols="12"
        :post_prop="post"
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
            post_id: '6499d07faaf3e1d53ff70ce2' as unknown as ObjectId,
            uid: '3tSPd5FGiua31xx02ZITogxwmGA2',
            user: {
              handle: 'felixrydberg',
              displayname: 'felix rydberg',
              avatar_url: 'https://cdn.vuetifyjs.com/images/john.png',
              verified: true,
            },
            liked: false,
            likes: [],
            comments: [],
            urls: [{
                url: '/photomode_16042022_190608.png',
                type: 'image',
              },
              {
                url: '/photomode_15042022_215001.png',
                type: 'image',
              }, 
              {
                url: '/photomode_16042022_185656.png',
                type: 'image',
              },
            ],
            likes_total: 0,
            comments_total: 0,
            caption: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,',
            users_tagged: [],
            published: true,
            created_at: new Date().getTime(),
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