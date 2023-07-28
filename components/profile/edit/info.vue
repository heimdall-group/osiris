
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
  const description:Ref<Profile_Description> = ref({
    text: '',
    links: [],
    disabled: false,
  });

  const user = computed(() => store.getUser)
  const user_db = computed(() => store.getUser_db)
  const profile_edit = computed(() => profileStore.getProfile_edit)

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
        if (!link.disabled) {
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
    description.value.text = profile_edit.value.user_description.text;
    description.value.links = profile_edit.value.user_description.links;
  })
</script>

<template>
  <v-col cols="12">
    <v-form>
      
    </v-form>
    user_email: {{ profile_edit.user_email }}<br>
    user_handle: {{ profile_edit.user_handle }}<br>
    user_avatar: {{ profile_edit.user_avatar }}<br>
    user_verified: {{ profile_edit.user_verified }}<br>
    user_unpublished_posts_count: {{ profile_edit.user_unpublished_posts_count }}<br>
    user_displayName: {{ profile_edit.user_displayName }}<br>
    user_description: {{ profile_edit.user_description }}<br>
  </v-col>
</template>
