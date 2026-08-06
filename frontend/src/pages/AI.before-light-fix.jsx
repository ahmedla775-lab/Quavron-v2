
import AIChat from "../components/ai/AIChat";

export default function AI() {
  return (
    <main
      className="
        h-dvh
        overflow-hidden
        bg-gradient-to-b
        from-white
        via-sky-50
        to-blue-100
        dark:from-black
        dark:via-slate-950
        dark:to-blue-950
        text-[var(--q-text)]
      "
    >

      <div
        className="
          h-full
          w-full
          max-w-5xl
          mx-auto
          flex
          flex-col
          px-3
          sm:px-6
          py-3
          sm:py-6
        "
      >

        <header
          className="
            flex
            items-center
            gap-3
            mb-3
            sm:mb-6
          "
        >

          <img
            src="/branding/logo-symbol.png"
            alt="Quavron"
            className="
              w-12
              h-12
              sm:w-14
              sm:h-14
              object-contain
            "
          />

          <div>
            <h1
              className="
                text-xl
                sm:text-3xl
                font-black
              "
            >
              Quavron AI
            </h1>

            <p
              className="
                text-xs
                sm:text-sm
                text-slate-500
              "
            >
              Intelligent assistant of the Quavron ecosystem
            </p>
          </div>

        </header>


        <div className="flex-1 min-h-0">
          <AIChat />
        </div>

      </div>

    </main>
  );
}
