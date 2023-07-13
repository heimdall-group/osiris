// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      firebase_key: process.env.FIREBASE_API_KEY,
      firebase_domain_url: process.env.FIREBASE_AUTH_DOMAIN,
      firebase_project_id: process.env.FIREBASE_PROJECT_ID,
    },
    db_url: process.env.MONGO_URL,
    default_profile_avatar_url: process.env.DEFAULT_PROFILE_AVATAR_URL,
  },
  modules: [
    '@pinia/nuxt',
    'formidable',
  ],
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    preset: 'digital-ocean',
    plugins: ['~/server/index.ts'],
  },
  vite: {
    define: {
      'process.env.DEBUG': true,
    },
  },
  typescript: {
    strict: true
  }
})
