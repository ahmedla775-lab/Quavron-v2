import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
      "
      style={{
        background: "var(--q-bg)",
        color: "var(--q-text)",
      }}
    >

      <Header />

      <main
        className="
          flex-1
          w-full
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
        "
      >
        {children}
      </main>

      <Footer />

    </div>
  );
}
