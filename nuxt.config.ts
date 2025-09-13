// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', '@nuxtjs/supabase'],
  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
        }
      }
    }
  },
  css: ['~/assets/styles/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  supabase: {
    redirect: false // empêche la redirection auto par défaut
  },
})