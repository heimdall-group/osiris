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
        <v-row justify="end">
          <v-btn
            @click="closeDialog"
            variant="text"
            flat
            position="absolute"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </v-btn>
        </v-row>
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

<script lang="ts">
import { useStore } from "~/stores/main";

export default {
setup() {
  const store = useStore();
  return {
    store,
  }
},
name: 'overlaySignInComponent',
data() {
  return {
    dialog: true,
  };
},
computed: {
  signInAlert() {
    return this.store.getSignInAlert as boolean;
  }
},
methods: {
  closeDialog() {
    this.store.setSignInAlert(false);
  },
},
mounted() {
},
updated() {},
components: {},
};

</script>