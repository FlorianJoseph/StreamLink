// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', '@nuxtjs/supabase', '@pinia/nuxt', '@nuxt/icon', '@nuxtjs/seo', '@nuxt/fonts', 'nuxt-og-image'],
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
      titleTemplate: '%s | Charmi',
      meta: [
        { name: 'theme-color', content: '#6A5AE0' },
        { name: 'google-site-verification', content: 'vdrpOtagJLKsTvKx5TvVfMtZJWajJfJ_IPJBb4C1KEk' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon-light.svg', media: '(prefers-color-scheme: light)' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon-dark.svg', media: '(prefers-color-scheme: dark)' },
        { rel: 'apple-touch-icon', href: '/favicon.svg' },
      ],
    },
  },

  site: {
    url: 'https://charmi.gg',
    name: 'Charmi',
    description: 'Découverte, raids, planning et page de liens. Charmi accompagne les streamers Twitch au quotidien. Keep on streaming.',
    defaultLocale: 'fr',
  },

  robots: {
    disallow: [
      '/admin',
      '/_secret-admin',
      '/auth',
      '/dashboard',
      '/checkout',
      '/schedule',
    ],
  },

  sitemap: {
    urls: [
      { loc: '/', priority: 1.0, changefreq: 'weekly' },
      { loc: '/discover', priority: 0.9, changefreq: 'daily' },
      { loc: '/shop', priority: 0.7, changefreq: 'weekly' },
      { loc: '/contact', priority: 0.5, changefreq: 'monthly' },
      { loc: '/privacy', priority: 0.2, changefreq: 'yearly' },
    ],
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Charmi',
      url: 'https://charmi.gg',
      logo: 'https://charmi.gg/images/logo/charmi-full-violet.png',
      sameAs: [
        'https://discord.gg/fVFguWc76b',
      ],
    },
  },
  fonts: {
    families: [
      {
        name: 'Pilcrow Rounded',
        provider: 'local',
        src: '/fonts/PilcrowRounded-Variable.woff2',
      },
      {
        name: 'Plus Jakarta Sans',
        provider: 'local',
        src: '/fonts/PlusJakartaSans-Bold.woff2',
        weight: '700',
      },
      {
        name: 'Plus Jakarta Sans',
        provider: 'local',
        src: '/fonts/PlusJakartaSans-Medium.woff2',
        weight: '500',
      },
    ],
  },
})