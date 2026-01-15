// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', '@nuxtjs/supabase', '@pinia/nuxt', '@nuxt/icon', 'nuxt-resend'],
  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark',
          cssLayer: false
        }
      }
    }
  },
  css: ['~/assets/styles/main.css', 'vue-advanced-cropper/dist/theme.classic.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  supabase: {
    redirect: false
  },
})