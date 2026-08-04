import QCCSidebar from "./QCCSidebar";
import QCCTopbar from "./QCCTopbar";

export default function QCCLayout({

  children,

}) {

  return (

    <div
      className="
        min-h-screen
        bg-[var(--q-bg)]
        text-[var(--q-text)]
      "
    >

      <div className="flex min-h-screen">

        {/* Sidebar */}

        <aside
          className="
            hidden
            lg:flex
            w-72
            shrink-0
            border-r
            border-[var(--q-border)]
            bg-[var(--q-surface)]
          "
        >

          <QCCSidebar />

        </aside>

        {/* Main */}

        <div className="flex min-h-screen flex-1 flex-col">

          <QCCTopbar />

          <main
            className="
              flex-1
              overflow-y-auto
              bg-[var(--q-bg)]
              p-6
              lg:p-8
            "
          >

            {children}

          </main>

        </div>

      </div>

    </div>

  );

}
