import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeProvider";

export default function HeroSection() {

  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (

    <section
      className="
      relative
      overflow-hidden
      rounded-[30px]
      px-6
      py-8
      lg:px-12
      lg:py-12
      "
      style={{
        background: isDark
          ? "linear-gradient(135deg,#020617,#0f172a,#083344)"
          : "linear-gradient(135deg,#ffffff,#ecfeff,#f8fafc)",
        border: `1px solid ${isDark ? "#1e293b" : "#dbeafe"}`
      }}
    >

      <div
        className="
        absolute
        -right-24
        -top-24
        h-72
        w-72
        rounded-full
        blur-3xl
        opacity-20
        "
        style={{
          background:"#06b6d4"
        }}
      />

      <div
        className="
        relative
        z-10
        max-w-3xl
        "
      >

        <span
          className="
          inline-flex
          items-center
          gap-2
          rounded-full
          px-4
          py-2
          text-sm
          font-semibold
          "
          style={{
            background:"#06b6d4",
            color:"#fff"
          }}
        >

          <Sparkles size={16}/>

          QUAVRON PLATFORM

        </span>

        <h1
          className="
          mt-6
          text-4xl
          font-black
          leading-tight
          lg:text-6xl
          "
          style={{
            color:isDark ? "#fff" : "#0f172a"
          }}
        >
          Build.
          <br/>
          Create.
          <br/>
          Grow.
        </h1>

        <p
          className="
          mt-6
          max-w-2xl
          text-lg
          leading-8
          "
          style={{
            color:isDark ? "#94a3b8" : "#475569"
          }}
        >
          Everything developers need in one place:
          AI, Cloud IDE, Community,
          Hosting, Marketplace and Learning.

        </p>

        <div
          className="
          mt-8
          flex
          flex-wrap
          gap-3
          "
        >

          <button
            onClick={()=>navigate("/community")}
            className="
            rounded-2xl
            px-6
            py-3
            font-semibold
            transition-all
            hover:scale-105
            "
            style={{
              background:"#06b6d4",
              color:"#fff"
            }}
          >

            <span className="flex items-center gap-3">

              Explore Platform

              <ArrowRight size={18}/>

            </span>

          </button>

        </div>

      </div>

    </section>

  );

}
