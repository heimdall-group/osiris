<template>
  <v-row justify="center" class="my-8">
    <v-card width="400px" class="pa-4" rounded="lg">
      <v-card-title class="text-center"> Other methods: </v-card-title>
      <v-card-actions>
        <v-row justify="center">
          <v-list width="200px">
            <v-list-item
              v-for="(provider, index) in providers"
              :key="index"
              class="justify-center"
            >
              <v-btn
                :prepend-icon="provider.icon"
                @click="() => {providerHandler(provider)}"
                :loading="provider.loading"
              >
                {{ provider.text }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import { useStore } from '~/stores/main';
import { Auth_Provider } from '~/models/auth_provider.model'

export default {
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
  name: 'userProvidersComponent',
  data() {
    return {
      providers: [
        {
          icon: 'fa-brands fa-google',
          callback: firebase_redirectToGoogle,
          text: 'Google',
          loading: false,
        },
        {
          icon: 'fa-brands fa-apple',
          callback: () => {console.log('signup callback')},
          text: 'Apple',
          loading: false,
        },
        {
          icon: 'fa-brands fa-facebook',
          callback: () => {console.log('signup callback')},
          text: 'Facebook',
          loading: false,
        },
        {
          icon: 'fa-brands fa-twitter',
          callback: () => {console.log('signup callback')},
          text: 'Twitter',
          loading: false,
        },
      ]
    };
  },
  computed: {},
  methods: {
    async providerHandler(provider:Auth_Provider) {
      provider.loading = true;
      const result = await provider.callback();
      provider.loading = false;
    },
  },
  mounted() {},
  updated() {},
  components: {},
  emits: [],
};
</script>