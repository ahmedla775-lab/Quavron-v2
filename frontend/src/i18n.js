import namespaces from "./i18n/namespaces/common";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ar from "./i18n/locales/ar.json";
import en from "./i18n/locales/en.json";
import fr from "./i18n/locales/fr.json";
import es from "./i18n/locales/es.json";
import de from "./i18n/locales/de.json";
import it from "./i18n/locales/it.json";
import pt from "./i18n/locales/pt.json";
import tr from "./i18n/locales/tr.json";
import ru from "./i18n/locales/ru.json";
import zh from "./i18n/locales/zh.json";
import ja from "./i18n/locales/ja.json";
import ko from "./i18n/locales/ko.json";
import hi from "./i18n/locales/hi.json";


const resources = {

  ar: { translation: ar },
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  tr: { translation: tr },
  ru: { translation: ru },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  hi: { translation: hi },

};


i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({

  resources,

ns: namespaces,

defaultNS: "common",

  fallbackLng: "en",

  lng:
    localStorage.getItem("quavron-language") ||
    "ar",


  interpolation: {

    escapeValue: false,

  },


  detection: {

    order: [
      "localStorage",
      "navigator",
    ],

    lookupLocalStorage:
      "quavron-language",

    caches: [
      "localStorage",
    ],

  },


});
const rtlLanguages = ["ar"];

function updateDocumentDirection(language) {

  document.documentElement.lang = language;

  document.documentElement.dir =
    rtlLanguages.includes(language)
      ? "rtl"
      : "ltr";

}

updateDocumentDirection(i18n.language);

i18n.on("languageChanged", (language) => {

  updateDocumentDirection(language);

});

export default i18n;
