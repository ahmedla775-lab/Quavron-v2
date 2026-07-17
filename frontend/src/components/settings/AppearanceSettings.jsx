import { useState } from "react";

export default function AppearanceSettings() {

  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [density, setDensity] = useState("comfortable");
  const [animations, setAnimations] = useState(true);

  const accents = [
    "blue",
    "purple",
    "green",
    "orange",
    "red",
    "cyan",
  ];

  return (

    <div className="space-y-8">

      <div>

        <h2 className="mb-4 text-xl font-semibold text-white">

          Theme

        </h2>

        <div className="flex gap-4">

          {["light","dark","system"].map((item)=>(

            <button
              key={item}
              onClick={()=>setTheme(item)}
              className={`rounded-xl px-5 py-3 transition ${
                theme===item
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >

              {item}

            </button>

          ))}

        </div>

      </div>

      <div>

        <h2 className="mb-4 text-xl font-semibold text-white">

          Accent Color

        </h2>

        <div className="flex flex-wrap gap-3">

          {accents.map((item)=>(

            <button
              key={item}
              onClick={()=>setAccent(item)}
              className={`rounded-full border px-5 py-3 capitalize transition ${
                accent===item
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-slate-700 bg-slate-800 text-slate-300"
              }`}
            >

              {item}

            </button>

          ))}

        </div>

      </div>

      <div>

        <h2 className="mb-4 text-xl font-semibold text-white">

          Font Size

        </h2>

        <select
          value={fontSize}
          onChange={(e)=>setFontSize(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        >

          <option value="small">Small</option>

          <option value="medium">Medium</option>

          <option value="large">Large</option>

        </select>

      </div>

      <div>

        <h2 className="mb-4 text-xl font-semibold text-white">

          Interface Density

        </h2>

        <select
          value={density}
          onChange={(e)=>setDensity(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        >

          <option value="compact">Compact</option>

          <option value="comfortable">Comfortable</option>

          <option value="expanded">Expanded</option>

        </select>

      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5">

        <div>

          <h3 className="font-semibold text-white">

            Interface Animations

          </h3>

          <p className="text-sm text-slate-400">

            Enable smooth animations across the platform.

          </p>

        </div>

        <button
          onClick={()=>setAnimations(!animations)}
          className={`h-7 w-14 rounded-full transition ${
            animations
              ? "bg-blue-600"
              : "bg-slate-700"
          }`}
        >

          <div
            className={`h-6 w-6 rounded-full bg-white transition ${
              animations
                ? "translate-x-7"
                : "translate-x-1"
            }`}
          />

        </button>

      </div>

    </div>

  );

}
