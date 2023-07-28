<script setup lang="ts">
  import { Upload_Options } from 'models/upload.model';
  import { useStore } from '~/stores/main';

  const store = useStore();  
  const dialog = ref(false);
  const state = ref(1);
  const state_class = ref('state-1');
  const summery_validation = ref(false);

  const files:Ref<Array<File>> = ref([]);
  const srcs:Ref<Array<string>> = ref([]);

  const options: Ref<Upload_Options> = ref({
    types: {
      videos: false,
      images: false,
    },
    autopublish: true,
    caption: '',
    users_tagged: [],
  });

  const user = computed(() => store.getUser)
  const props = defineProps({
    block: {
      type: Boolean,
      required: false,
    }
  });

  watch(state, (newValue) => {
    state_class.value = `state-${newValue}`
  })

  const resetDialog = () => {
    console.log('resetDialog')
    dialog.value = false;
    state.value = 1;
    state_class.value = 'state-1';

    files.value = [];
    srcs.value = [];
    summery_validation.value = false;

    options.value = {
      types: {
        videos: false,
        images: false,
      },
      autopublish: true,
      caption: '',
      users_tagged: [],
    };
  }
  const changeHandler = async (event:Event) => {
    if (!event.target) {
      return;
    }

    const arr = [] as Array<string>;
    const internal_files = (event.target as HTMLInputElement).files;
    if (internal_files === null) {
      return
    }

    for (let i = 0; i < internal_files.length; i++) {
      const file = internal_files[i];
      arr.push(await getImgSrc(file));
    }

    files.value = [...internal_files];
    srcs.value = arr;
    state.value++
  }
  const summeryHandler = async (event:Event) => {
    event.preventDefault();
    if (summery_validation) {
      state.value++
    }
  }

  const submitHandler = async () => {
    posts_createPost(files.value, options.value);
    dialog.value = false;
    resetDialog();
  }

  async function getImgSrc (file: File):Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result
        if (result) {
          resolve(result.toString())
        } else {
          reject()
        }
      };
      reader.readAsDataURL(file);
    })
  }
</script>

<template>
  <v-dialog
    transition="dialog-bottom-transition"
    width="auto"
    v-model="dialog"
    @update:modelValue="resetDialog"
  >
    <template v-slot:activator="{ props }">
      <v-btn flat rounded="lg" :block="block" @click="dialog = !dialog">+</v-btn>
    </template>
      <v-card
        rounded
        height="600px"
        max-width="600px"
      >
        <v-row :class="['ma-0', 'state-container', state_class]">

          <v-col cols="12" class="state-child d-flex align-center">
            <v-row class="file-upload-container ma-0" justify="center" align="center">
              <v-btn id="file-upload-button"><label for="file-upload">Upload file</label></v-btn>
              <input id="file-upload" multiple @change="changeHandler" type="file" />
            </v-row>
          </v-col>

          <!-- <v-col cols="12" class="state-child">
            <v-row class="ma-0 flex-nowrap">
              <v-col
                v-for="(src, index) in srcs"
                :key="index"
                class="pa-0"
              >
                <v-img :src="src"></v-img>
              </v-col>
            </v-row>
          </v-col> -->

          <v-col cols="12" class="state-child">
            <v-card-title>Summary</v-card-title>
            <v-card-text>Caption</v-card-text>

            <v-textarea
              v-model="options.caption"
              variant="solo"
              :counter="128"
              label="Caption" 
              bg-color="surface-04"
            ></v-textarea>
            <v-card-actions>
              <v-checkbox 
                :ripple="false"
                label="Auto-Publish"
                persistent-hint
                color="success"
                hint="Posts might take a while to upload. Leave this checked to auto-publish. Unpublished posts are can be found here where you edit your profile"
                v-model="options.autopublish"
                false-icon="fa-regular fa-square"
                true-icon="fa-regular fa-square-check"
              ></v-checkbox>
            </v-card-actions>
            <v-btn @click="submitHandler" block>Submit</v-btn>
          </v-col>
        </v-row>
      </v-card>
  </v-dialog>
</template>

<style scoped>
#file-upload-button {
  padding: 0;
}

#file-upload-button label {
  cursor: pointer;
  padding: 8px 16px;
}

input[type="file"] {
  display: none;
}

.state-container .state-child:nth-child(2) .v-row {
  overflow-x: scroll;
  overflow-y: hidden;
  max-height: 500px;
}

.state-container .state-child:nth-child(2) .v-row .v-col {
  aspect-ratio: 10 / 14;
  max-height: 500px;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: black;
}

.state-container,
.state-container .v-col {
  height: 600px;
}

.state-container {
  overflow-y: hidden;
}

.state-container .v-col {
  transition-property: transform;
  transition-duration: 250ms;
}

.state-container.state-1 .state-child:nth-child(1) {
  transform: translateY(0px);
}
.state-container.state-1 .state-child:nth-child(2) {
  transform: translateY(600px);
}
.state-container.state-1 .state-child:nth-child(3) {
  transform: translateY(1200px);
}

.state-container.state-2 .state-child:nth-child(1) {
  transform: translateY(-600px);
}
.state-container.state-2 .state-child:nth-child(2) {
  transform: translateY(-600px);
}
.state-container.state-2 .state-child:nth-child(3) {
  transform: translateY(-600px);
}

.state-container.state-3 .state-child:nth-child(1) {
  transform: translateY(-1200px);
}
.state-container.state-3 .state-child:nth-child(2) {
  transform: translateY(-1200px);
}
.state-container.state-3 .state-child:nth-child(3) {
  transform: translateY(-1200px);
}

</style>
