import { useTranslation } from "react-i18next";


const languages = [
  {
    code: "en",
    name: "English",
  },
  {
    code: "ar",
    name: "العربية",
  },
  {
    code: "fr",
    name: "Français",
  },
  {
    code: "es",
    name: "Español",
  },
  {
    code: "de",
    name: "Deutsch",
  },
  {
    code: "it",
    name: "Italiano",
  },
  {
    code: "pt",
    name: "Português",
  },
  {
    code: "ru",
    name: "Русский",
  },
  {
    code: "tr",
    name: "Türkçe",
  },
  {
    code: "zh",
    name: "中文",
  },
  {
    code: "ja",
    name: "日本語",
  },
  {
    code: "ko",
    name: "한국어",
  },
  {
    code: "hi",
    name: "हिन्दी",
  },
];


export default function LanguageSwitcher() {

  const { i18n, t } = useTranslation();


  function changeLanguage(event) {

    const lang = event.target.value;

    i18n.changeLanguage(lang);


    document.documentElement.dir =
      lang === "ar"
        ? "rtl"
        : "ltr";

  }


  return (

    <div className="flex items-center gap-3">

      <label className="text-sm text-slate-400">
        {t("language")}
      </label>


      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="
          rounded-lg
          border
          border-slate-700
          bg-slate-900
          px-3
          py-2
          text-white
        "
      >

        {
          languages.map((lang) => (

            <option
              key={lang.code}
              value={lang.code}
            >
              {lang.name}
            </option>

          ))
        }

      </select>

    </div>

  );

}
