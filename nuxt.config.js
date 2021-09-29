import i18n from './config/i18n'
require('dotenv').config()

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'Kolel - כולל',
    htmlAttrs: {
      lang: 'he'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css' },
      { rel: 'stylesheet', href: 'https://players.brightcove.net/videojs-thumbnails/1/videojs-thumbnails.css' }
    ],
    script: [
      { src: "facebook-pixel-code.js" }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'video.js/dist/video-js.css',
    '~/assets/videoplayertheme.css',
    "vue-slick-carousel/dist/vue-slick-carousel.css",
    "vue-slick-carousel/dist/vue-slick-carousel-theme.css"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/filters.js',
    { src: '~/plugins/vue-slick-carousel', ssr: false },
    '~/plugins/social-sharing.js',
    { src: './plugins/vue-google-oauth2', ssr: false },
    '~/plugins/vue-observe-visibility'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: ['en', 'he'],
    defaultLocale: 'he',
    vueI18n: i18n
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/style.scss', '~/assets/variables.scss', '~/assets/vjs-styles.scss'],
    theme: {
      themes: {
        dark: {
          primary: '#1e88e5',
          info: '#1e88e5',
          success: '#21c1d6',
          accent: '#fc4b6c',
          default: '#563dea'
        },
        light: {
          primary: '#1e88e5',
          info: '#1e88e5',
          success: '#21c1d6',
          accent: '#fc4b6c',
          default: '#563dea'
        }
      }
    },
    rtl: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vue-google-oauth2'
    ]
  },

  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  }
}
