import { useTranslation } from "react-i18next";

export default function useLocale() {

  const {
    t,
    i18n,
  } = useTranslation();

  const language = i18n.language;

  const isRTL =
    language === "ar";

  function changeLanguage(lang) {
    return i18n.changeLanguage(lang);
  }

  return {
    t,
    i18n,
    language,
    isRTL,
    changeLanguage,
  };

}
