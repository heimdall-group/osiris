
<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { useViewsStore } from '~/stores/view-state';
  import { useProfileStore } from '~/stores/profile';
  import { Profile_Description } from 'models/profile.model';

  const store = useStore();
  const viewsStore = useViewsStore();
  const profileStore = useProfileStore();

  const dialog = ref(false);
  const loading = ref(false);
  const email = ref('');
  const displayName = ref('');
  const handle = ref('');
  const avatar = ref('');
  const description:Ref<Profile_Description> = ref({
    text: '',
    links: [],
  });

  const user = computed(() => store.getUser)
  const user_db = computed(() => store.getUser_db)
  const profile_edit = computed(() => profileStore.getProfile_edit)
  const state = computed(() => viewsStore.getState)

  const linksClickHandler = ():void => {
    description.value.links.push({
      href: '',
      text: '',
    })
  };
  const linkClickHandler = (link: {href: string, text: string, disabled?: boolean}):void => {
    link.disabled = !link.disabled;
  };
  const saveHandler= async () => {
    try {
      loading.value = true;
      const arr = [];
      for (let i = 0; i < description.value.links.length; i++) {
        const link = description.value.links[i];
        if (!link.disabled && link.text !== '' && link.href !== '') {
          arr.push(link)
        }
      }

      const result = await $fetch('/api/users/user/profile/edit', {
        method: 'PUT',
        body: {
          token: await user.value.getIdToken(),
          email: email.value,
          handle: handle.value,
          displayName: displayName.value,
          description: {
            text: description.value.text,
            links: arr,
          },
        }
      });

      if (result.success) {
        if (handle.value !== user_db.value.user_handle) {
          const router = useRouter();
          router.replace(`/profile/${handle.value}`)
        }
        profileStore.editProfile(
          handle.value,
          displayName.value,
          {
            text: description.value.text,
            links: arr,
          },
        )
      }
      else {
        throw {
          message: 'Profile edit couldnt save',
          code: 'profile/profile-edit-couldnt-save',
          severity: 3,
          type: 'server',
          server_error: result.error,
        }
      }

      loading.value = false;
      dialog.value = false;

    } catch(error) {
      loading.value = false;
      handle_error(error);
    }
  };

  onMounted(() => {
    email.value =profile_edit.value.user_email;
    handle.value = profile_edit.value.user_handle;
    displayName.value = profile_edit.value.user_displayName;
    avatar.value = profile_edit.value.user_avatar;
    description.value.text = profile_edit.value.user_description.text;
    description.value.links = profile_edit.value.user_description.links;
  })
</script>

<template>
  <v-col cols="12">
    <v-form>
      <text-fields-email v-model="email" disabled />
      <v-label class="pa-2 pt-0">Changing you handle will cause the page to reload after you save.</v-label>
      <text-fields-handle v-model="handle" registered />
      <text-fields-display-name v-model="displayName" />
      <text-area-description v-model="description.text" />
      <v-list class="pa-0" rounded>
        <template
          v-for="(link, index) in description.links"
          :key="`profile-edit-links-${index}`"
        >
          <v-list-item
            class="pa-0"
          >
            <v-row class="ma-0">
              <v-col class="pa-0">
                <v-row class="ma-0">
                  <v-col 
                    class="pa-2"
                    :class="{
                      'pr-1': state === 'lg' || state === 'xl' || state === 'xxl'
                    }"
                    cols="12"
                    sm="12"
                    md="12"
                    lg="6"
                    xl="6"
                    xxl="6"
                  >
                    <v-text-field
                      v-model="link.text"
                      label="Text"
                      variant="solo"
                      bg-color="surface-04"
                      hide-details="auto"
                      :disabled="link.disabled"
                    ></v-text-field>
                  </v-col>
                  <v-col 
                    class="pa-2"
                    :class="{
                      'pl-1': state === 'lg' || state === 'xl' || state === 'xxl'
                    }"
                    cols="12"
                    sm="12"
                    md="12"
                    lg="6"
                    xl="6"
                    xxl="6"
                  >
                    <v-text-field
                      v-model="link.href"
                      label="Link"
                      variant="solo"
                      bg-color="surface-04"
                      hide-details="auto"
                      :disabled="link.disabled"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="auto" class="pl-0 d-flex justify-center">
                <v-btn
                  variant="plain"
                  icon="fa-solid fa-xmark"
                  @click="() => {linkClickHandler(link)}"
                ></v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </template>
        <v-list-item class="pa-0">
          <v-list-item-title>Links</v-list-item-title>
          <v-btn
            variant="plain"
            icon="fa-solid fa-plus"
            @click="linksClickHandler"
          >

          </v-btn>
        </v-list-item>
      </v-list>
      <v-row class="ma-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            variant="outlined"
            :loading="loading"
            @click="saveHandler"
          >
            Save
          </v-btn>
      </v-row>
    </v-form>
    user_email: {{ email }}<br>
    user_handle: {{ handle }}<br>
    user_avatar: {{ avatar }}<br>
    user_verified: {{ profile_edit.user_verified }}<br>
    user_unpublished_posts_count: {{ profile_edit.user_unpublished_posts_count }}<br>
    user_displayName: {{ displayName }}<br>
    user_description: {{ description }}<br>
  </v-col>
</template>
