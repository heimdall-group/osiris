<script setup lang="ts">
  import { useStore } from "~/stores/main";
  const store = useStore();
  const signInAlert = computed(() => store.getSignInAlert)
  const closeDialog = () => {
    store.setSignInAlert(false);
  };
</script>

<template>
  <v-dialog
      v-model="signInAlert"
      width="auto"
      transition="dialog-bottom-transition"
      :persistent="true"
    >
      <v-card
        rounded="lg"
        class="pa-12"
      >
        <v-btn
          @click="closeDialog"
          variant="text"
          flat
          class="close-button"
          position="absolute"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </v-btn>
        <v-card-title class="text-center">You need to be signed in to do this!</v-card-title>
        <v-card-text class="text-center">If you have an account already plase sign in, if not feel free to sign up</v-card-text>
        <v-row>
          <v-col cols="12">
            <v-btn @click="closeDialog" color="primary" variant="flat" block nuxt to="/signin">Sign in</v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn @click="closeDialog" color="primary" variant="flat" block nuxt to="/signup">Sign up</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
</template>

<style scoped>
  .close-button {
    top: 0;
    right: 0;
    margin: 16px;
  }
</style>
