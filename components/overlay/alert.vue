<script setup lang="ts">
  import { Alert } from 'models/alert.model';
  import { useStore } from '~/stores/main';
  const store = useStore();
  const alerts = computed(() => store.getAlerts)
  const alertCallback = (alert:Alert) => {
    store.patchAlerts(alert)
  };
</script>

<template>
  <client-only>
    <v-row class="ma-0 alert-list" justify="center">
      <v-col
        v-for="(alert, index) in alerts"
        :key="`overlay-alert-${index}`"
        cols="12"
        class="pa-1"
      >
        <v-alert
          :icon="alert.icon"
          :type="alert.type"
        >
          <v-row align="center">
            <v-col>
              <span v-if="typeof alert.message === 'object'">
                {{ alert.message.prepend }}
                <a 
                  v-if="alert.message.button.type === 'button-callback'"
                  @click="alert.message.button.callback"
                >
                  {{ alert.message.button.text }}
                </a>
                <nuxt-link
                  v-else-if="alert.message.button.type === 'button-link'"
                  nuxt
                  :to="alert.message.button.to"
                >
                  {{ alert.message.button.text }}
                </nuxt-link>
                <a
                  v-else-if="alert.message.button.type === 'button-title'"
                  :title="alert.message.button.title"
                >
                  {{ alert.message.button.text }}
                </a>
                {{ alert.message.append }}
              </span>
              <span v-if="typeof alert.message === 'string'">
                {{ alert.message }}
              </span>
            </v-col>
            <v-col cols="auto">
              <v-btn
                flat
                color="transparent"
                :ripple="false"
                @click="() => {alertCallback(alert)}"
              >
                <font-awesome-icon icon="fa-solid fa-xmark" />
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
      <v-col
        v-if="alerts.length > 1"
        class="px-4 py-1 alert-button-list-item"
        cols="12"
      >
        <v-btn :ripple="false" position="relative" class="alert-button" color="transparent" flat @click="alert_resetAlert">Clear all</v-btn>    
      </v-col>
    </v-row>
  </client-only>
</template>

<style>
.alert-list {
  position: fixed;
  top: 0;
  left: 0;
  margin: 0 auto auto auto;
  z-index: 2000;
  background: transparent;
  max-width: 400px;
}

.alert-list .v-col {
  max-width: 400px;
}

.alert-button-list-item {
  display: flex;
  justify-content: flex-end;
}

.alert-list .v-list-item, .alert-list .v-alert {
  width: 100%;
}

.alert-list .v-alert {
  border-radius: 0px;
  transform: translateX(0px);
  transition-property: transform;
  transition-duration: 500ms;
  border-radius: 8px;
}

.alert-list .v-alert__prepend {
  height: 36px;
}

.alert-list .v-alert__prepend .v-icon {
  color: unset;
}

.alert-list a {
  text-decoration: underline;
  color: unset;
  cursor: pointer;
}
</style>
