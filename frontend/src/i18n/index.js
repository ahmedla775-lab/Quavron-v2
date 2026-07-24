import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";


import en from "./locales/en.json";
import ar from "./locales/ar.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import ru from "./locales/ru.json";
import tr from "./locales/tr.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import hi from "./locales/hi.json";


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({

    resources: {

      en: {
        translation: en,
      },

      ar: {
        translation: ar,
      },

      fr: {
        translation: fr,
      },

      es: {
        translation: es,
      },

      de: {
        translation: de,
      },

      it: {
        translation: it,
      },

      pt: {
        translation: pt,
      },

      ru: {
        translation: ru,
      },

      tr: {
        translation: tr,
      },

      zh: {
        translation: zh,
      },

      ja: {
        translation: ja,
      },

      ko: {
        translation: ko,
      },

      hi: {
        translation: hi,
      }

    },


    fallbackLng: "en",


    interpolation: {
      escapeValue: false,
    },


    detection: {

      order: [
        "localStorage",
        "navigator",
      ],

      caches: [
        "localStorage",
      ],

    },


  });


export default i18n;
