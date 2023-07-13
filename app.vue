<template>
  <v-app v-if="loading">
    <v-row class="ma-0" align="center" justify="center">
      <v-progress-circular indeterminate :size="40" :width="2"></v-progress-circular>
    </v-row>
  </v-app>
  <v-app v-else>
    <navigation />
    <overlay-sign-in />
    <NuxtPage />
    <!-- <overlay-alert /> -->
  </v-app>
</template>

<style>
@import url(~/assets/css/fonts.css);
@import url(~/assets/css/loaders.css);
@import url(~/assets/css/animations.css);
@import url(~/assets/css/cursors.css);
@import url(~/assets/css/selects.css);

* {
  font-family: 'Quicksand-Regular';
  text-transform: unset !important;
}

html {
  overflow-y: overlay;
  touch-action: manipulation;
}

.v-overlay__scrim {
  background: rgba(var(--v-theme-background), 1)
}

.mdi-check-decagram {
  color: #429aff;
}

/* Scroll */

*::-webkit-scrollbar {
  width: 9px;
  height: 9px;
  background: transparent;
}

*::-webkit-scrollbar-track {
  background: transparent;
  width: 9px;
}

*::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 7px;
  width: 7px;
  border: 1px solid transparent;
}

</style>

<script lang="ts">
import { useStore } from '~/stores/main';
import { useViewsStore } from '~/stores/view-state';
export default {
  setup() {
    useHead({
      titleTemplate: (pageTitle) => {
        return pageTitle ? `${pageTitle} - Osiris` : 'Osiris';
      },
    });
    const store = useStore()
    const viewsStore = useViewsStore();
    return {
      store,
      viewsStore,
    };
  },
  data() {
    return {};
  },
  computed: {
    loading() {
      return this.store.getGlobalLoading;
    },
    state() {
      return this.viewsStore.getState;
    },
  },
  methods: {
    onResize() {
      this.viewsStore.setState(window.innerWidth)
    }
  },
  mounted() {
    firebase_initAuth();
    this.onResize();
    window.addEventListener('resize', this.onResize)
  },
  updated() {},
};
</script>
