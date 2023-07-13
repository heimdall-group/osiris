<template>
  <v-row justify="center" class="my-8">
    <v-card width="600px" class="pa-4" rounded="lg">
      <v-card-title class="text-center"> Sign in </v-card-title>
      <v-form validate-on="lazy" v-model="validation" @submit="submitHandler">
        <form-text-fields-email 
          :origin="email"
          :validate_db="false"          
          @onInput="(origin) => email = origin"
        />
        <form-text-fields-password 
          :origin="pwd"
          @onInput="(origin) => pwd = origin"
        />
        <v-btn
          block
          type="submit"
        >
          Sign in
        </v-btn>
      </v-form>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import { useStore } from '~/stores/main';

export default {
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
  name: 'userSignInComponent',
  data() {
    return {
      email: 'test@gmail.com',
      pwd: '1234567',
      validation: false,
    };
  },
  computed: {},
  methods: {
    submitHandler(event: Event) {
      event.preventDefault();
      console.log(this.validation)
      if (this.validation) {
        // Submit request
        firebase_password_signInUser(
          this.email,
          this.pwd,
        );
      }
    },
  },
  mounted() {},
  updated() {},
  components: {},
  emits: [],
};
</script>