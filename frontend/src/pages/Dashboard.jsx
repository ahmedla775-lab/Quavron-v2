import HeroSection from "../components/dashboard/HeroSection";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import CompanyFeed from "../components/dashboard/CompanyFeed";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import QuavronAI from "../components/ai/QuavronAI";

export default function Dashboard() {

  return (

    <DashboardLayout>

      <div
        className="
        mx-auto
        w-full
        max-w-[1600px]

        px-4
        pt-5
        pb-8

        lg:px-8
        lg:pt-8
        lg:pb-10

        space-y-8

        animate-[fadeIn_.45s_ease]
        "
      >

        <section
          className="
         
          rounded-3xl

          backdrop-blur-xl

          bg-white/60
          dark:bg-slate-950/60

          border

          border-white/20
          dark:border-slate-800

          p-6

          shadow-sm
          "
        >

          <h1
            className="
            text-3xl
            lg:text-5xl

            font-black

            tracking-tight
            "
          >
            Welcome to Quavron
          </h1>

          <p
            className="
            mt-3

            max-w-3xl

            text-slate-500
            dark:text-slate-400

            lg:text-lg
            "
          >
            Next Generation Platform for Development,
            Artificial Intelligence,
            Community,
            Hosting,
            Marketplace
            and Learning.
          </p>

        </section>

        <div className="animate-[slideUp_.45s_ease]">

          <HeroSection />

        </div>

        
        <div className="animate-[slideUp_.55s_ease]">

          <QuavronAI />

        </div>


        <div className="animate-[slideUp_.65s_ease]">

          <QuickActions />

        </div>

        <div className="animate-[slideUp_.75s_ease]">

          <ActivityTimeline />

        </div>

      </div>

    </DashboardLayout>

  );

}
