<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';

  const viewsStore = useViewsStore();
  const state = computed(() => viewsStore.getState)

  const like_section = ref(false);
  const comment_section = ref(false);
  const loading = ref(false);

  const props = defineProps({
    cols: {
      type: String,
      required: true,
    },
    post: {
      type: Object,
      required: true,
    },
  })

  const handleLiked = async () => {
    if (!props.post.liked_by_current_user) {
      const result = await posts_likePost(props.post.post_id, props.post.likes_count)
      if (result.success) {
        props.post.liked_by_current_user = true
      }
    } else {
      const result = await posts_unlikePost(props.post.post_id)
      if (result.success) {
        props.post.liked_by_current_user = false
      }
    }
  }
  const handleTotalLikes = (event:Event) => {
    event.stopPropagation();
    like_section.value = !like_section.value;
  }
  const handleTotalComments = () => {
    comment_section.value = !comment_section.value
  }

  const removePost = async () => {
    loading.value = true;
    const result = await posts_removePost(props.post.post_id)
    loading.value = false;
  }
</script>

<template>
  <v-col
    :cols="cols"
    :class="[state === 'xs' ? 'py-2' : 'pa-2', 'd-flex', 'justify-center']"
  >
    <v-row justify="center" class="ma-0">
      <v-col 
        class="pa-0"
        cols="12"
        sm="12"
        md="8"
        lg="6"
        xl="7"
        xxl="6"
      >
        <posts-overlays-comments v-model="comment_section" :post="post" />
        <v-card
          rounded="lg"
          width="100%"
          max-width="600px"
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
                <overlay-3-dot-menu :identifier="post.post_id">
                  <v-list-item
                    v-if="post.post_by_current_user"
                    class="pa-0"
                  >
                    <overlay-dialogs-confirmation
                      text="Remove Post"
                      :loading="loading"
                      color="error"
                      @callback="removePost"
                    />
                  </v-list-item>
                </overlay-3-dot-menu>
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
                <font-awesome-icon :icon="post.liked_by_current_user ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" />
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
              {{ post.likes_count }} {{ post.likes_count === 1 ? 'Like' : 'Likes'}}
              <posts-overlays-likes :post="post" v-model="like_section" />
            </v-card-subtitle>
            <v-card-subtitle 
              class="pa-4 pt-0 pb-2 cursor-pointer user-select-none"
              @click="handleTotalComments"
            >
              {{ post.comments_count }} {{ post.comments_count === 1 ? 'Comment' : 'Comments'}}
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
          </v-card-subtitle>
          <v-card-subtitle 
            class="pa-4 pt-0"
          >
            {{ new Date(post.created_at).toLocaleDateString() }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<style scoped>
.v-card {
  margin: 0 auto;
}

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

.fa-heart, .fa-comment {
  font-size: 20px;
}

</style>