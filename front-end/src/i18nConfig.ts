import en from "./translations/en.json";
import fi from "./translations/fi.json";
import cn from "./translations/cn.json";
import hi from "./translations/hi.json";

const LANGUAGE_KEY: string = 'LANGUAGE_KEY';


export const saveLanguageSelection = (language: string) => {
  localStorage.setItem(LANGUAGE_KEY, language);
};

export const getLanguageSelection = () => {
  return localStorage.getItem(LANGUAGE_KEY) || 'en';
};


// i18n translation config
// https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-react-app-with-react-i18next
const i18nConfig = {
  interpolation: {escapeValue: false},    // React already does escaping
  lng: getLanguageSelection(),                              // language to use
  resources: {
    en: {
      i18n: en // 'i18n' is our custom namespace
    },
    fi: {
      i18n: fi
    },
    cn: {
      i18n: cn
    },
    hi: {
      i18n: hi
    },
  },
};

export default i18nConfig;
