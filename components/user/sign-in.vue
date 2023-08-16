<script setup lang="ts">
  import { useStore } from '~/stores/main';
  const store = useStore();
  const email = ref('test@gmail.com');
  const pwd = ref('1234567');
  const validation = ref(false);

  const submitHandler = (event: Event) => {
    event.preventDefault();
    console.log(validation)
    if (validation) {
      // Submit request
      firebase_password_signInUser(
        email,
        pwd,
      );
    }
  };
</script>

<template>
  <v-row justify="center" class="my-8">
    <v-card width="600px" class="pa-4" rounded="lg">
      <v-card-title class="text-center"> Sign in </v-card-title>
      <v-form validate-on="lazy" v-model="validation" @submit="submitHandler">
        <text-fields-email 
          v-model="email"
          :validate="false"
        />
        <text-fields-password 
          v-model="pwd"
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
