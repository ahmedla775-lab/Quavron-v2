export function updateDirection(language) {

  const rtlLanguages = [
    "ar",
  ];


  document.documentElement.dir =
    rtlLanguages.includes(language)
      ? "rtl"
      : "ltr";


  document.documentElement.lang =
    language;

}
