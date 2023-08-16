<script setup lang="ts">
  const props = defineProps({
    'text': {
      type: String,
      required: true,
    },
    'color': {
      type: String,
      required: true,
    },
    'loading': {
      type: Boolean,
      required: false,
    }
  })
  const emits = defineEmits(['callback']);

  const dialog = ref(false);
  const handleConfirm = () => {
    dialog.value = false;
    emits('callback')
  }
</script>

<template>
  <v-dialog
    transition="dialog-bottom-transition"
    width="auto"
    v-model="dialog"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        block
        variant="text"
        :color="color"
        :loading="loading"
        @click="dialog = !dialog"
      >
        {{ text }}
      </v-btn>
    </template>
    <v-card
      width="200px"
      height="150px"
      class="pa-4"
    >

      <v-card-title class="text-center">
        Are you sure?
      </v-card-title>
      <v-row class="ma-0" justify="space-around" align="center">
        <v-btn
          variant="outlined"
          color="error"
          @click="dialog = !dialog"
        >
          No
        </v-btn>
        <v-btn
          variant="outlined"
          color="success"
          @click="handleConfirm"
        >
          Yes
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>