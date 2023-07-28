<script setup lang="ts">
  import { useStore } from '~/stores/main';
  const store = useStore();

  const email = '';
  const handle = '';
  const displayName = '';
  const pwd = '';
  const pwdRepeat = '';
  const validation = false;

  const submitHandler = (event: Event) => {
    event.preventDefault();
    if (validation) {
      firebase_password_createUser(
        displayName,
        email,
        pwd,
        handle,
      );
    }
  };
</script>

<template>
  <v-row justify="center" class="my-8">
    <v-card width="600px" class="pa-4" rounded="lg">
      <v-card-title class="text-center"> Sign Up </v-card-title>
      <v-form validate-on="lazy" v-model="validation" @submit="submitHandler">
        <form-text-fields-email
          v-model="email"
          validate
        />
        <form-text-fields-handle
          v-model="handle"
        />
        <form-text-fields-display-name 
          v-model="displayName"
        />
        {{ displayName }}
        <form-text-fields-password 
          v-model="pwd"
        />
        <form-text-fields-password-repeat
          v-model="pwdRepeat"
          :repeat="pwd"
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
