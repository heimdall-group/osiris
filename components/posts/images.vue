<script setup lang="ts">
  const props = defineProps({
    urls: {
      type: Array<any>,
      required: true,
    }
  })
</script>

<template>
  <v-carousel
    v-if="urls.length > 1"
    :hide-delimiter-background="true"
    delimiter-icon="mdi: mdi-circle"
    class="posts-slideshow"
  >
  <template v-slot:prev="{ props }">
      <v-btn
        variant="plain"
        :ripple="false"
        @click="props.onClick"
        icon="mdi: mdi-chevron-left"
        size="small"
      ></v-btn>
    </template>
    <template v-slot:next="{ props }">
      <v-btn
        variant="plain"
        :ripple="false"
        @click="props.onClick"
        icon="mdi: mdi-chevron-right"
        size="small"
      ></v-btn>
    </template>
    <v-carousel-item
      v-for="(url, index) in urls"
      :key="`posts-images-${index}`"
      :src="url"
    >
    </v-carousel-item>
  </v-carousel>
    <v-carousel
      v-else
      hide-delimiters
      :show-arrows="false"
      class="posts-slideshow"
    >
    <v-carousel-item
      v-for="(url, index) in urls"
      :key="`posts-images-${index}`"
      :src="url"
    >
      </v-carousel-item>
    </v-carousel>
</template>

<style>
.posts-slideshow.v-carousel {
  background: black;
  height: unset !important;
  aspect-ratio: 10 / 14;
}

.posts-slideshow .v-window__container {
  height: 100%;
  aspect-ratio: 10 / 14;
}
</style>
