// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      firebase_key: process.env.FIREBASE_API_KEY,
      firebase_domain_url: process.env.FIREBASE_AUTH_DOMAIN,
      firebase_project_id: process.env.FIREBASE_PROJECT_ID,
    },
    db_url: process.env.MONGO_URL,
    default_profile_avatar_url: process.env.DEFAULT_PROFILE_AVATAR_URL,
    aws_key: process.env.AWS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
    aws_region: process.env.AWS_REGION,
    s3_bucket_url: process.env.S3_BUCKET_URL,
    s3_bucket_name: process.env.S3_BUCKET_NAME,
    s3_bucket_endpoint: process.env.S3_BUCKET_ENDPOINT,
    compression_types: process.env.COMPRESSION_TYPES,
    video_codec: process.env.VIDEO_CODEC,
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
