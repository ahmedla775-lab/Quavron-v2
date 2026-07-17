import { useState } from "react";

export default function LanguageSettings() {

  const [language, setLanguage] = useState("English");

  const [timezone, setTimezone] = useState("Africa/Algiers");

  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  const [timeFormat, setTimeFormat] = useState("24 Hours");

  const [numberFormat, setNumberFormat] = useState("1,234.56");

  return (

    <div className="space-y-8">

      <div>

        <label className="mb-2 block text-slate-300">

          Language

        </label>

        <select
          value={language}
          onChange={(e)=>setLanguage(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        >

          <option>English</option>

          <option>العربية</option>

          <option>Français</option>

          <option>Deutsch</option>

          <option>Русский</option>

        </select>

      </div>

      <div>

        <label className="mb-2 block text-slate-300">

          Time Zone

        </label>

        <select
          value={timezone}
          onChange={(e)=>setTimezone(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        >

          <option>Africa/Algiers</option>

          <option>Europe/Paris</option>

          <option>UTC</option>

          <option>America/New_York</option>

          <option>Asia/Tokyo</option>

        </select>

      </div>

      <div>

        <label className="mb-2 block text-slate-300">

          Date Format

        </label>

        <select
          value={dateFormat}
          onChange={(e)=>setDateFormat(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        >

          <option>DD/MM/YYYY</option>

          <option>MM/DD/YYYY</option>

          <option>YYYY-MM-DD</option>

        </select>

      </div>

      <div>

        <label className="mb-2 block text-slate-300">

          Time Format

        </label>

        <select
          value={timeFormat}
          onChange={(e)=>setTimeFormat(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        >

          <option>24 Hours</option>

          <option>12 Hours</option>

        </select>

      </div>

      <div>

        <label className="mb-2 block text-slate-300">

          Number Format

        </label>

        <select
          value={numberFormat}
          onChange={(e)=>setNumberFormat(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        >

          <option>1,234.56</option>

          <option>1.234,56</option>

          <option>1234.56</option>

        </select>

      </div>

      <button
        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
      >

        Save Preferences

      </button>

    </div>

  );

}
