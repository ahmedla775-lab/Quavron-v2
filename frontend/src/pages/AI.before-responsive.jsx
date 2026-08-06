import AIChat from "../components/ai/AIChat";

export default function AI() {
  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[var(--q-bg)]
        text-[var(--q-text)]
        px-0
        py-0
        sm:px-4
        sm:py-6
      "
    >

      <div className="w-full max-w-5xl mx-auto h-full">

        <div
          className="
          mb-6
          rounded-3xl
          p-6
          border
          border-[var(--q-border)]
          bg-[var(--q-surface)]
          shadow-xl
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              bg-transparent
              
              
              font-black
              shadow-lg
              "
            >
              <img
                                                              src="/branding/logo-symbol.png"
                                                              alt="Quavron"
                                                              className="w-12 h-12 object-contain scale-125"
                                                            /></div>

            <div>
              <h1
                className="
                text-2xl sm:text-3xl
                font-black
                "
              >
                Quavron AI
              </h1>

              <p
                className="
                text-sm
                text-[var(--q-muted)]
                mt-1
                "
              >
                Intelligent assistant of the Quavron ecosystem
              </p>

            </div>

          </div>

        </div>


        <div className="w-full h-[calc(100vh-110px)] sm:h-auto">
          <AIChat />
        </div>

      </div>

    </main>
  );
}
