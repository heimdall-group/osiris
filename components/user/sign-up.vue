<template>
  <v-row justify="center" class="my-8">
    <v-card width="600px" class="pa-4" rounded="lg">
      <v-card-title class="text-center"> Sign Up </v-card-title>
      <v-form validate-on="lazy" v-model="validation" @submit="submitHandler">
        <form-text-fields-email 
          :origin="email"
          :validate_db="true"          
          @onInput="(origin) => email = origin"
        />
        <form-text-fields-handle
          :origin="handle"
          @onInput="(origin) => handle = origin"
        />
        <form-text-fields-display-name 
          :origin="displayName"
          @onInput="(origin) => displayName = origin"
        />
        <form-text-fields-password 
          :origin="pwd"
          @onInput="(origin) => pwd = origin"
        />
        <form-text-fields-password-repeat
          :pwd_1="pwd"
          :pwd_2="pwdRepeat"
          @onInput="(origin) => pwdRepeat = origin"
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
  name: 'userSignUpComponent',
  data() {
    return {
      email: '',
      handle: '',
      displayName: '',
      pwd: '',
      pwdRepeat: '',
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
        console.log(this.validation)
        firebase_password_createUser(
          this.displayName,
          this.email,
          this.pwd,
          this.handle,
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