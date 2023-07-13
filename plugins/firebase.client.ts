import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore ,Firestore } from 'firebase/firestore'
export default defineNuxtPlugin((nuxtApp) => {
  const publicConfig = useRuntimeConfig().public

  const firebaseConfig = {
    apiKey: publicConfig.firebase_key,
    authDomain: publicConfig.firebase_domain_url,
    projectId: publicConfig.firebase_project_id,
  } as FirebaseOptions;

  const app = initializeApp(firebaseConfig)

  const auth = getAuth()
  const firestore = getFirestore(app)

  nuxtApp.vueApp.provide('auth', auth)
  nuxtApp.provide('auth', auth)

  nuxtApp.vueApp.provide('firestore', firestore as Firestore)
  nuxtApp.provide('firestore', firestore as Firestore)
})

