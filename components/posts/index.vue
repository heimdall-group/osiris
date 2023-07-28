<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';

  const viewsStore = useViewsStore();
  const state = computed(() => viewsStore.getState)

  const likes_dialog = ref(false);
  const comment_dialog = ref(false);

  const props = defineProps({
    cols: {
      type: String,
      required: true,
    },
    post: {
      type: Object,
      required: true,
    },
    index: Number
  })

  const handleLiked = () => {
    props.post.liked = !props.post.liked
    if (props.post.liked) {
      props.post.liked = true;
      props.post.likes_total++
    } else {
      props.post.liked = false;
      props.post.likes_total--
    }
  }
  const handleTotalLikes = (event:Event) => {
    event.stopPropagation();
    likes_dialog.value = true;
    // Open likes dialog, which has pagnation ect
    // Stop event propagation
  }
  const handleTotalComments = () => {
    comment_dialog.value = true
  }
</script>

<template>
  <v-col
    :cols="cols"
    :class="[state === 'xs' ? 'py-2' : 'pa-2', 'd-flex', 'justify-center']"
  >
    <v-card
      rounded="lg"
      max-width="680px"
      elevation="10"
      variant="flat"
    >
      <v-list>
        <v-list-item
          :prepend-avatar="post.user.avatar_url"
        >
          <v-list-item-title>
            <nuxt-link :to="`/profile/${post.user.handle}`">{{ post.user.handle }}</nuxt-link>
            <v-icon v-if="post.user.verified" title="Verified">mdi: mdi-check-decagram</v-icon>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ post.user.displayname }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <overlay-3-dot-menu :profile_prop="post.user" />
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <posts-images
        :urls="post.urls"
      />
      <v-divider></v-divider>
      <v-row class="ma-0">
        <v-col 
          cols="auto" 
          class="cursor-pointer pl-4" 
          @click="handleLiked"
        >
            <font-awesome-icon :icon="post.liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" />
        </v-col>
        <v-col
          cols="auto" 
          class="cursor-pointer"
          @click="handleTotalComments"
        >
          <font-awesome-icon icon="fa-regular fa-comment" />
        </v-col>
      </v-row>
      <v-row class="ma-0">
        <v-card-subtitle 
          class="pa-4 pt-0 pb-2 cursor-pointer user-select-none"
          @click="handleTotalLikes"
        >
          {{ post.likes_total }} {{ post.likes_total === 1 ? 'Like' : 'Likes'}}
          <v-dialog 
          v-model="likes_dialog" 
          transition="dialog-bottom-transition"
          width="auto"
        >
          <v-card
            class="pa-4"
          >
            List all likes
          </v-card>
        </v-dialog>
        </v-card-subtitle>
        <v-card-subtitle 
          class="pa-4 pt-0 pb-2 cursor-pointer user-select-none"
          @click="handleTotalComments"
        >
          {{ post.comments_total }} {{ post.likes_total === 1 ? 'Comment' : 'Comments'}}
        </v-card-subtitle>
      </v-row>
      <v-card-text v-if="post.caption" class="text-body-2 py-0 caption-section">
        <nuxt-link class="text-body-1" :to="`/profile/${post.user.handle}`">{{ post.user.handle }}</nuxt-link>
        <v-icon v-if="post.user.verified" title="Verified">mdi: mdi-check-decagram</v-icon>
        : {{ post.caption }}
      </v-card-text>
      <v-card-subtitle 
        class="pa-4 cursor-pointer user-select-none"
        @click="handleTotalComments"
      >
        View all comments ...
        <v-dialog
          v-model="comment_dialog" 
          transition="dialog-bottom-transition"
          width="auto"
        >
          <v-card
            class="pa-4"
          >
            List all comments and replies
          </v-card>
        </v-dialog>
      </v-card-subtitle>
      <v-card-subtitle 
        class="pa-4 pt-0"
      >
        {{ new Date(post.created_at).toLocaleDateString() }}
      </v-card-subtitle>  
    </v-card>
  </v-col>
</template>

<style scoped>
.v-btn-no-hover::before {
   background-color: transparent !important;
}

.v-card-text a,
.v-list-item-title a {
  text-decoration: none;
  color: unset;
}

.mdi-check-decagram {
  font-size: 20px;
  margin-left: 6px;
}

.caption-section {
  overflow: hidden;
  display: -webkit-box;
   -webkit-line-clamp: 3; /* number of lines to show */
           line-clamp: 3; 
   -webkit-box-orient: vertical;
}

.fa-heart[data-prefix="fas"] {
  color:red;
  animation-duration: .45s;
  animation-name: like-button-animation;
  animation-timing-function: ease-in-out;
  transform: scale(1);
}

.fa-heart, .fa-comment {
  font-size: 20px;
}

</style>