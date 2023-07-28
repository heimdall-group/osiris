<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';
  const viewsStore = useViewsStore();

  const props = defineProps({
    follow: {
      type: Object,
      required: true,
    },
    user_same: {
      type: Boolean,
      required: false,
    }
  })

  const state = computed(() => viewsStore.getState)
</script>

<template>
  <v-list-item
    :prepend-avatar="follow.user_avatar"
    rounded="xl"
  >
    <v-row class="ma-0" justify="end">
      <v-col class="pa-0">
        <v-btn
          :to="`/profile/${follow.user_handle}`"
          variant="text"
          flat
          :size="state === 'xs' ? 'small' : 'default'"
        >
          {{ follow.user_handle }}
          <v-icon v-if="follow.user_verified" title="Verified">mdi: mdi-check-decagram</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="pa-0">
        <v-list-item-action>
          <profile-buttons-list-follow
            v-if="!user_same"
            :follow="follow" 
            :handle="follow.user_handle" 
          />
          <profile-buttons-list-follow-user-same
            v-else 
            :follow="follow" 
            :handle="follow.user_handle" 
          />
        </v-list-item-action>
      </v-col>
    </v-row>
  </v-list-item>
</template>
