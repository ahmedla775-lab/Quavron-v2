import AIChat from "../components/ai/AIChat";

export default function AI() {
  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-white
        via-sky-50
        to-blue-700
        dark:from-slate-950
        dark:via-blue-950
        dark:to-black
        px-4
        py-8
      "
    >
      <div className="max-w-5xl mx-auto">

        <div className="
          mb-8
          text-center
        ">
          <h1 className="
            text-4xl
            font-black
            text-slate-900
            dark:text-white
          ">
            Quavron AI
          </h1>

          <p className="
            mt-3
            text-slate-600
            dark:text-blue-200
          ">
            Your intelligent assistant inside the Quavron ecosystem
          </p>
        </div>

        <AIChat />

      </div>
    </main>
  );
}
