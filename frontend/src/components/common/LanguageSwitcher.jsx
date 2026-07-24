import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";


const languages = [
  {
    code: "ar",
    name: "العربية",
  },
  {
    code: "en",
    name: "English",
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
    code: "tr",
    name: "Türkçe",
  },
  {
    code: "ru",
    name: "Русский",
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

  const {
    i18n,
  } = useTranslation();


  function changeLanguage(e) {

    const lang = e.target.value;

    i18n.changeLanguage(lang);

    localStorage.setItem(
      "quavron-language",
      lang
    );

  }


  return (

    <div className="
      flex
      items-center
      gap-2
      rounded-xl
      border
      border-slate-700
      bg-slate-900
      px-3
      py-2
    ">

      <Languages
        size={18}
        className="text-white"
      />


      <select

        value={i18n.language}

        onChange={changeLanguage}

        className="
          bg-transparent
          text-white
          outline-none
        "

      >

        {languages.map((lang)=>(

          <option

            key={lang.code}

            value={lang.code}

            className="bg-slate-900"

          >

            {lang.name}

          </option>

        ))}

      </select>


    </div>

  );

}
