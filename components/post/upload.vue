<template>
  <v-dialog
    transition="dialog-bottom-transition"
    width="auto"
    v-model="dialog"
    @update:modelValue="resetDialog"
  >
    <template v-slot:activator="{ props }">
      <v-btn @click="dialog = !dialog">+</v-btn>
    </template>
      <v-card
        rounded
      >
        <v-row class="ma-0">
          <v-col cols="12">
            <v-file-input variant="solo" counter show-size chips multiple v-model="files"></v-file-input>
          </v-col>
          <v-col cols="12">
            <v-form>
              <v-label class="mb-2 ml-1">Caption</v-label>
              <form-text-area-post-caption 
                :origin="options.caption" 
                label="Me working out...." 
                @onInput="(origin) => options.caption = origin" 
              />
            </v-form>
          </v-col>
          <v-col cols="12">
            <v-btn @click="submitHandler" :loading="submit_loading">Submit</v-btn>
          </v-col>
        </v-row>
      </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Upload_Options } from 'models/upload.model';
import { useStore } from '~/stores/main';

export default {
setup() {
  const store = useStore();
  return {
    store,
  }
},
name: 'postUploadComponent',
data() {
  return {
    dialog: false,
    submit_loading: false,
    files: [],
    blobs: [] as Array<any>,
    options: {
      types: {
        videos: false,
        images: false,
      },
      autopublish: false,
      caption: ''
    } as Upload_Options,
  };
},
computed: {
  user() {
    return this.store.getUser;
  }
},
methods: {
  resetDialog() {
    this.submit_loading = false;
  },
  async submitHandler() {
    // this.submit_loading = true;
    const result = await posts_createPost(this.files, this.options);
    // this.files = [];
    // this.submit_loading = false;
  },
},
mounted() {
},
updated() {},
components: {},
emits: [],
};
</script>