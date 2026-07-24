import DashboardLayout from "../components/dashboard/DashboardLayout";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

export default function Settings() {

  return (

    <DashboardLayout>

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-8
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-white
          "
        >
          Settings
        </h1>


        <p
          className="
            mt-2
            text-slate-400
          "
        >
          Manage your Quavron preferences.
        </p>



        <div
          className="
            mt-8
            rounded-2xl
            border
            border-slate-800
            bg-slate-950
            p-6
          "
        >

          <h2
            className="
              mb-4
              text-xl
              font-semibold
              text-white
            "
          >
            Language
          </h2>


          <LanguageSwitcher />


        </div>


      </div>


    </DashboardLayout>

  );

}
