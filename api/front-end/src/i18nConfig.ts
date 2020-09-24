import en from "./translations/en.json";
import fi from "./translations/fi.json";

// i18n translation config
// https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-react-app-with-react-i18next
const i18nConfig = {
  interpolation: {escapeValue: false},    // React already does escaping
  lng: 'en',                              // language to use
  resources: {
    en: {
      i18n: en // 'i18n' is our custom namespace
    },
    fi: {
      i18n: fi
    },
  },
}

export default i18nConfig;
