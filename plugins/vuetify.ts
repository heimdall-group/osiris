import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import { fa } from 'vuetify/iconsets/fa'
import '@fortawesome/fontawesome-free/css/all.css'

const light = {
    dark: false,
    colors: {
      background: '#FFFFFF',
      surface: '#f6f6f6',
      primary: '#ededed',
      secondary: '#7c7c7c',
      error: '#B00020',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
    }
}




const dark = {
    dark: true,
    colors: {
      background: '#121212',
      surface: '#1d1d1d',
      "surface-02": '#212121',
      "surface-03": '#242424',
      "surface-04": '#262626',
      "surface-05": '#2c2c2c',
      primary: '#0e9ede',
      secondary: '#FF0266',
      error: '#CF6679',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
      verified: "#3286e6"
    }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
          light,
          dark,
        }
    },
    icons: {
      defaultSet: 'fa',
      sets: {
        mdi,
        fa,
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})