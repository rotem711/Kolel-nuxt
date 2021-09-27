import en from 'vuetify/lib/locale/en'
import he from 'vuetify/lib/locale/he'

const messages = {
  en: {
    ...require('../locales/en.json'),
    $vuetify: en,
    dir: 'ltr'
  },
  he: {
    ...require('../locales/he.json'),
    $vuetify: he,
    dir: 'rtl'
  },
}

export default {
  locale: 'he',
  fallbackLocale: 'en',
  messages
};
