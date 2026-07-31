import {
  Building2,
  Landmark,
  UserRound,
  Truck,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../theme/ThemeProvider";

const stats = [
  {
    icon: Building2,
    title: "Companies",
    value: "Industrial • Economic",
  },
  {
    icon: Landmark,
    title: "Institutions",
    value: "Commercial • Services",
  },
  {
    icon: UserRound,
    title: "Individuals",
    value: "Private Sellers",
  },
  {
    icon: Truck,
    title: "Delivery",
    value: "Choose Your Carrier",
  },
];

export default function MarketplaceHero() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <section
      className="relative overflow-hidden rounded-[32px] border p-8 lg:p-12"
      style={{
        background: isDark
          ? "linear-gradient(135deg,#020617,#0f172a,#082f49)"
          : "linear-gradient(135deg,#ffffff,#ecfeff,#f8fafc)",
        borderColor: "var(--q-border)",
      }}
    >
      <div
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: "#06b6d4" }}
      />

      <div className="relative z-10">

        <span
          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-bold"
          style={{
            background: "#06b6d4",
            color: "#fff",
          }}
        >
          QUAVRON MARKETPLACE
        </span>

        <h1
          className="mt-6 max-w-4xl text-4xl font-black leading-tight lg:text-6xl"
          style={{
            color: "var(--q-text)",
          }}
        >
          Digital Business
          <br />
          Ecosystem
        </h1>

        <p
          className="mt-6 max-w-3xl text-lg leading-8"
          style={{
            color: "var(--q-muted)",
          }}
        >
          Connect companies, institutions, businesses, private
          sellers and delivery providers in one professional
          marketplace designed for the next generation.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">

          <button
            onClick={() => navigate("/marketplace/companies")}
            className="rounded-2xl px-6 py-3 font-bold transition hover:scale-105"
            style={{
              background: "#06b6d4",
              color: "#fff",
            }}
          >
            <span className="flex items-center gap-2">
              Explore Marketplace
              <ArrowRight size={18} />
            </span>
          </button>

          <button
            className="rounded-2xl border px-6 py-3 font-semibold"
            style={{
              borderColor: "var(--q-border)",
              color: "var(--q-text)",
            }}
          >
            Become a Seller
          </button>

        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-2xl border p-5 backdrop-blur-xl"
                style={{
                  background: isDark
                    ? "rgba(15,23,42,.55)"
                    : "rgba(255,255,255,.80)",
                  borderColor: "var(--q-border)",
                }}
              >
                <div
                  className="mb-4 inline-flex rounded-xl p-3"
                  style={{
                    background: "#06b6d4",
                    color: "#fff",
                  }}
                >
                  <Icon size={22} />
                </div>

                <h3
                  className="text-lg font-bold"
                  style={{
                    color: "var(--q-text)",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="mt-2 text-sm"
                  style={{
                    color: "var(--q-muted)",
                  }}
                >
                  {item.value}
                </p>

              </div>

            );

          })}

        </div>

      </div>
    </section>
  );
}
