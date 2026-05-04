// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', '@nuxtjs/supabase', '@pinia/nuxt', '@nuxt/icon'],
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
    optimizeDeps: {
      include: [
        'lucide-vue-next',
        'qrcode',
        'modern-screenshot',
        'node-vibrant/browser',
        'vuedraggable',
        'vue-advanced-cropper',
        '@vueuse/core',
        '@stripe/stripe-js',
      ]
    },
    plugins: [
      tailwindcss(),
    ],
  },
  supabase: {
    redirect: false
  },
  nitro: {
    externals: {
      external: ['react', 'react-dom', '@react-email/components', '@react-email/render']
    },
    esbuild: {
      options: {
        jsx: 'automatic',
        jsxImportSource: 'react'
      }
    }
  },
  runtimeConfig: {
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    stripePriceSub: '',
    stripePriceCoinsLittle: '',
    stripePriceCoinsMiddle: '',
    stripePriceCoinsBig: '',
    public: {
      stripePublishableKey: '',
      appUrl: 'http://localhost:3000',
      stripePriceSub: '',
      stripePriceCoinsLittle: '',
      stripePriceCoinsMiddle: '',
      stripePriceCoinsBig: '',
    }
  },
  app: {
    head: {
      title: 'Charmi',
      titleTemplate: '%s | Charmi',
      meta: [
        { name: 'description', content: 'Le compagnon des streamers Twitch. Centralise tes liens, ton planning et ta visibilité.' },
        { property: 'og:title', content: 'Charmi' },
        { property: 'og:description', content: 'Le compagnon des streamers Twitch.' },
        { property: 'og:image', content: 'https://charmi.gg/images/logo/charmi-full-violet.png' },
        { property: 'og:url', content: 'https://charmi.gg' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Charmi' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Charmi' },
        { name: 'twitter:description', content: 'Le compagnon des streamers Twitch.' },
        { name: 'twitter:image', content: 'https://charmi.gg/images/logo/charmi-full-violet.png' },
        { name: 'theme-color', content: '#6A5AE0' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/favicon.svg' },
      ],
    },
  },
})